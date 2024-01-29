import * as React from 'react';
import {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';

import { useChatContext } from '../../chat';
import { Services } from '../../services';
import type { TimerTextRef } from '../../ui/Text';
import { getFileExtension, LocalPath, uuid } from '../../utils';
import type { VoiceBarProps, VoiceBarState } from './types';

export function useVoiceBar(props: VoiceBarProps) {
  const {
    onClickedRecordButton,
    onClickedClearButton,
    onClickedSendButton,
    onFailed,
    onState: propsOnState,
  } = props;
  const [state, setState] = React.useState<VoiceBarState>('idle');
  const voiceFilePathRef = React.useRef<string>('');
  const voiceFileNameRef = React.useRef<string>('');
  const voiceDurationRef = React.useRef<number>(0);
  const isPlayingRef = React.useRef<boolean>(false);
  const recordTimeoutRef = React.useRef<NodeJS.Timeout>();
  const im = useChatContext();
  const contentTimerRef = React.useRef<TimerTextRef>({} as any);
  const [playRipple, setPlayRipple] = React.useState<boolean>(false);

  const AudioOptionRef = React.useRef<AudioSet>({
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    // OutputFormatAndroid: OutputFormatAndroidType.AAC_ADIF,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVModeIOS: AVModeIOSOption.measurement,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac, // !!! amr is not supported
  });
  const [currentTime, setCurrentTime] = React.useState<number>(0);

  const onContentTimeChanged = React.useCallback((v: number) => {
    setCurrentTime(v);
  }, []);

  const onState = React.useCallback(
    (s: VoiceBarState) => {
      propsOnState?.(s);
      setState(s);
    },
    [propsOnState]
  );

  const startRecord = (voiceFilePath?: string) => {
    if (voiceFilePath) {
      voiceFilePathRef.current = voiceFilePath;
    }
    onState('recording');
    recordTimeoutRef.current = setTimeout(() => {
      stopRecord();
    }, 60000);
    contentTimerRef.current?.reset?.();
    contentTimerRef.current?.start?.();
    setPlayRipple(true);

    Services.ms
      .startRecordAudio({
        url: voiceFilePath,
        audio: AudioOptionRef.current,
        onPosition: (pos) => {
          console.log('dev:startRecordAudio:pos:', pos);
          voiceDurationRef.current = Math.floor(pos);
        },
        onFailed: (error) => {
          console.warn('dev:startRecordAudio:onFailed:', error);
          onFailed?.({ reason: 'record voice is failed.', error: error });
          contentTimerRef.current?.stop?.();
          setPlayRipple(false);
        },
        onFinished: ({ result, path, error }) => {
          console.log('dev:startRecordAudio:onFinished:', result, path, error);
        },
      })
      .then((result) => {
        console.log('dev:startRecordAudio:result:', result);
      })
      .catch((error) => {
        console.warn('dev:startRecordAudio:error:', error);
        onFailed?.({ reason: 'record voice is failed.', error: error });
        contentTimerRef.current?.stop?.();
        setPlayRipple(false);
      });
  };
  const stopRecord = React.useCallback(() => {
    contentTimerRef.current?.stop?.();
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = undefined;
    }

    onState('stopping');
    setPlayRipple(false);

    const conv = im.getCurrentConversation();
    if (!conv) {
      Services.ms.stopRecordAudio();
      return;
    }

    Services.ms
      .stopRecordAudio()
      .then((result?: { pos: number; path: string }) => {
        if (result?.path) {
          voiceFileNameRef.current = uuid();
          let localPath = LocalPath.sendVoice(
            Services.dcs.getFileDir(conv.convId, voiceFileNameRef.current)
          );
          const extension = getFileExtension(result.path);
          localPath = localPath + extension;
          voiceFilePathRef.current = localPath;
          voiceFileNameRef.current = voiceFileNameRef.current + extension;
          Services.ms
            .saveFromLocal({
              targetPath: localPath,
              localPath: result.path,
            })
            .catch((error) => {
              onFailed?.({
                reason: 'save file voice is failed.',
                error: error,
              });
            });
        }
      })
      .catch((error) => {
        onFailed?.({
          reason: 'stop record voice is failed.',
          error: error,
        });
      });
  }, [im, onFailed, onState]);
  const replay = async () => {
    onState('playing');
    if (isPlayingRef.current === true) {
      return;
    }
    isPlayingRef.current = true;
    contentTimerRef.current?.reset?.();
    contentTimerRef.current?.start?.();
    setPlayRipple(true);
    Services.ms
      .playAudio({
        url: LocalPath.playVoice(voiceFilePathRef.current),
        onPlay({ currentPosition, duration }) {
          if (currentPosition === duration) {
            isPlayingRef.current = false;
            contentTimerRef.current?.stop?.();
            onState('stopping');
            setPlayRipple(false);
          }
        },
      })
      .then(() => {})
      .catch((error) => {
        onFailed?.({ reason: 'play voice is failed.', error: error });
        isPlayingRef.current = false;
        contentTimerRef.current?.stop?.();
        onState('stopping');
        setPlayRipple(false);
      });
  };
  const _onClickedRecordButton = () => {
    onClickedRecordButton?.(state);
    switch (state) {
      case 'idle':
        startRecord();
        break;
      case 'recording':
        stopRecord();
        break;
      case 'playing':
        replay();
        break;
      case 'stopping':
        replay();
        break;
    }
  };
  const _onClickedClearButton = () => {
    onClickedClearButton?.();
    onState('idle');
    setCurrentTime(0);
    if (isPlayingRef.current === true) {
      Services.ms.stopAudio();
      isPlayingRef.current = false;
    }
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = undefined;
    }
    contentTimerRef.current?.stop?.();
    voiceFilePathRef.current = '';
  };
  const _onClickedSendButton = () => {
    onClickedSendButton?.({
      localPath: voiceFilePathRef.current,
      duration: voiceDurationRef.current,
      displayName: voiceFileNameRef.current,
      type: 'voice',
    });
  };

  React.useEffect(() => {
    return () => {
      if (recordTimeoutRef.current) {
        clearTimeout(recordTimeoutRef.current);
        recordTimeoutRef.current = undefined;
        stopRecord();
      }
      if (isPlayingRef.current === true) {
        Services.ms.stopAudio();
        isPlayingRef.current = false;
      }
    };
  }, [stopRecord]);

  return {
    state,
    onClickedRecordButton: _onClickedRecordButton,
    onClickedClearButton: _onClickedClearButton,
    onClickedSendButton: _onClickedSendButton,
    contentTimerRef,
    playRipple,
    onContentTimeChanged,
    currentTime: currentTime,
  };
}
