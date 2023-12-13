import * as React from 'react';
import {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';

import { useChatContext } from '../../chat';
import { Services } from '../../services';
import type { TimerTextRef } from '../../ui/Text';
import {
  getFileExtension,
  localUrl,
  localUrlEscape,
  playUrl,
  uuid,
} from '../../utils';
import type { VoiceBarProps, VoiceBarState } from './types';

export function useVoiceBar(props: VoiceBarProps) {
  const {
    onClickedRecordButton,
    onClickedClearButton,
    onClickedSendButton,
    onRecordFailed,
    onState: propsOnState,
  } = props;
  const [state, setState] = React.useState<VoiceBarState>('idle');
  const voiceFilePathRef = React.useRef<string>('');
  const voiceDurationRef = React.useRef<number>(0);
  const isPlayingRef = React.useRef<boolean>(false);
  const recordTimeoutRef = React.useRef<NodeJS.Timeout>();
  const im = useChatContext();
  const tipTimerRef = React.useRef<TimerTextRef>({} as any);
  const contentTimerRef = React.useRef<TimerTextRef>({} as any);

  const AudioOptionRef = React.useRef<AudioSet>({
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    OutputFormatAndroid: OutputFormatAndroidType.AAC_ADIF,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVModeIOS: AVModeIOSOption.measurement,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  });

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
    tipTimerRef.current?.reset?.();
    tipTimerRef.current?.start?.();
    contentTimerRef.current?.reset?.();
    contentTimerRef.current?.start?.();

    Services.ms
      .startRecordAudio({
        url: voiceFilePath,
        audio: AudioOptionRef.current,
        onPosition: (pos) => {
          console.log('test:startRecordAudio:pos:', pos);
          voiceDurationRef.current = pos;
        },
        onFailed: (error) => {
          console.warn('test:startRecordAudio:onFailed:', error);
          onRecordFailed?.({ reason: error.toString() });
        },
        onFinished: ({ result, path, error }) => {
          console.log('test:startRecordAudio:onFinished:', result, path, error);
        },
      })
      .then((result) => {
        console.log('test:startRecordAudio:result:', result);
      })
      .catch((error) => {
        console.warn('test:startRecordAudio:error:', error);
        onRecordFailed?.({ reason: error.toString() });
        tipTimerRef.current?.stop?.();
        contentTimerRef.current?.stop?.();
      });
  };
  const stopRecord = React.useCallback(() => {
    tipTimerRef.current?.stop?.();
    contentTimerRef.current?.stop?.();
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = undefined;
    }

    onState('stopping');

    const conv = im.getCurrentConversation();
    if (!conv) {
      console.log('test:zuoyu:', conv);
      Services.ms.stopRecordAudio();
      return;
    }

    Services.ms
      .stopRecordAudio()
      .then((result?: { pos: number; path: string }) => {
        if (result?.path) {
          let localPath = localUrl(
            Services.dcs.getFileDir(conv.convId, uuid())
          );
          const extension = getFileExtension(result.path);
          localPath = localPath + extension;
          console.log('test:zuoyu:localPath:', localPath);
          voiceFilePathRef.current = localPath;
          Services.ms
            .saveFromLocal({
              targetPath: localPath,
              localPath: result.path,
            })
            .then(() => {
              // todo: send message
            })
            .catch((error) => {
              console.warn('test:zuoyu:startRecordAudio:save:error', error);
            });
        }
      })
      .catch((error) => {
        console.warn('test:zuoyu:stopRecordAudio:error:', error);
      });
  }, [im, onState]);
  const replay = async () => {
    onState('playing');
    if (isPlayingRef.current === true) {
      return;
    }
    isPlayingRef.current = true;
    contentTimerRef.current?.reset?.();
    contentTimerRef.current?.start?.();
    Services.ms
      .playAudio({
        url: localUrlEscape(playUrl(voiceFilePathRef.current)),
        onPlay({ isMuted, currentPosition, duration }) {
          console.log('test:zuoyu:onPlay', isMuted, currentPosition, duration);
          if (currentPosition === duration) {
            isPlayingRef.current = false;
            contentTimerRef.current?.stop?.();
            onState('stopping');
          }
        },
      })
      .then(() => {
        console.log('test:zuoyu:playAudio:finish:2:');
      })
      .catch((error) => {
        console.warn('test:zuoyu:error:', error);
        isPlayingRef.current = false;
        contentTimerRef.current?.stop?.();
        onState('stopping');
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
    if (isPlayingRef.current === true) {
      Services.ms.stopAudio();
      isPlayingRef.current = false;
    }
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = undefined;
    }
    contentTimerRef.current?.stop?.();
    tipTimerRef.current?.stop?.();
    voiceFilePathRef.current = '';
  };
  const _onClickedSendButton = () => {
    onClickedSendButton?.({
      localPath: voiceFilePathRef.current,
      duration: voiceDurationRef.current,
      type: 'voice',
    });
    // todo: do something after send message?
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
    tipTimerRef,
    contentTimerRef,
  };
}
