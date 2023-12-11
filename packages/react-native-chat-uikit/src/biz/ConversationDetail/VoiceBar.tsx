import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';

import { useChatContext } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import {
  getFileExtension,
  localUrl,
  localUrlEscape,
  playUrl,
  uuid,
} from '../../utils';
import { gVoiceBarHeight } from '../const';
import type { PropsWithError, PropsWithTest } from '../types';

export type VoiceBarState = 'idle' | 'recording' | 'playing' | 'stopping';
export type VoiceBarRef = {
  /**
   * You can specify the path to save the file. If not specified, the default path will be used.
   * @param voiceFilePath the voice file path.
   */
  startRecord: (voiceFilePath?: string) => void;
  stopRecord: () => void;
  replay: () => void;
};
export type VoiceBarProps = PropsWithError &
  PropsWithTest & {
    /**
     * The height of the voice bar.
     */
    height?: number;
    /**
     * Callback notification when the record button is clicked.
     *
     * Click this button to start recording voice, stop recording voice, and play voice operations. and returns status.
     *
     * If recording is in progress, clicking the button will trigger the recording to stop. Or automatically stop recording after 60 seconds.
     *
     * If it is playing, clicking the button will start playing again, and it will automatically stop when the playback is completed.
     *
     * @param state {@link VoiceBarState}
     * - 'idle' - The initial state, click to start recording. {@link VoiceBarRef.startRecord}
     * - 'recording' - Recording is in progress, click to stop recording. It will automatically stop after 60 seconds and change to `stopping` state. {@link VoiceBarRef.stopRecord}
     * - 'playing' - Playing is in progress, click to replaying. {@link VoiceBarRef.replay}
     * - 'stopping' - Stopping is in progress, click to playing. {@link VoiceBarRef.replay}
     */
    onClickedRecordButton?: (state: VoiceBarState) => void;
    /**
     * Callback notification when the clean button is clicked.
     *
     * Clean up the status and change it to `idle` status. {@link VoiceBarState}
     */
    onClickedClearButton?: () => void;
    /**
     * Callback notification when the send button is clicked. Returns the path of the recording file.
     */
    onClickedSendButton?: (voiceFilePath: string) => void;
    /**
     * Callback notification when the recording is failed.
     */
    onRecordFailed?: (error: { reason: string }) => void;
  };
export function VoiceBar(props: VoiceBarProps) {
  console.log('test:zuoyu:VoiceBar:props', props);
  const { height } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    trash: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    trash_bg: {
      light: colors.neutral[9],
      dark: colors.neutral[7],
    },
  });
  const {
    state,
    onClickedClearButton,
    onClickedRecordButton,
    onClickedSendButton,
  } = useVoiceBar(props);

  const getTextTip = () => {
    switch (state) {
      case 'idle':
        return tr('press to record');
      case 'recording':
        return tr('recording');
      case 'playing':
        return tr('playing');
      case 'stopping':
        return tr('press to play');
    }
  };
  return (
    <View
      style={{
        height: height !== undefined ? height : gVoiceBarHeight,
        width: '100%',
      }}
    >
      <View style={{}} />
      <View style={{ height: 70 }} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        {state === 'playing' || state === 'stopping' ? (
          <View
            style={{
              backgroundColor: getColor('trash_bg'),
              borderRadius: 36,
              height: 36,
              width: 36,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              iconName={'trash'}
              style={{
                height: 20,
                width: 20,
                tintColor: getColor('trash'),
              }}
              onPress={onClickedClearButton}
            />
          </View>
        ) : null}

        <Pressable
          style={{
            height: 48,
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: getColor('enable'),
            borderRadius: 24,
          }}
          onPress={onClickedRecordButton}
        >
          <View>
            {state === 'idle' ? (
              <Icon
                name={'mic_on'}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: getColor('bg'),
                }}
              />
            ) : (
              <Text
                textType={'small'}
                paletteType={'headline'}
                style={{
                  color: getColor('bg'),
                }}
              >
                {'sdf'}
              </Text>
            )}
          </View>
        </Pressable>
        {state === 'playing' || state === 'stopping' ? (
          <View
            style={{
              backgroundColor: getColor('enable'),
              borderRadius: 36,
              height: 36,
              width: 36,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              iconName={'airplane'}
              style={{
                height: 20,
                width: 20,
                tintColor: getColor('bg'),
              }}
              onPress={onClickedSendButton}
            />
          </View>
        ) : null}
      </View>
      <View style={{ flexGrow: 1, alignSelf: 'center', alignItems: 'center' }}>
        <Text
          textType={'medium'}
          paletteType={'label'}
          style={{
            color: getColor('trash'),
            marginTop: 16,
          }}
        >
          {getTextTip()}
        </Text>
        {state === 'recording' ? (
          <Text
            textType={'small'}
            paletteType={'body'}
            style={{
              color: getColor('trash'),
              marginTop: 8,
            }}
          >
            {tr('left xx seconds')}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function useVoiceBar(props: VoiceBarProps) {
  const {
    onClickedRecordButton,
    onClickedClearButton,
    onClickedSendButton,
    onRecordFailed,
  } = props;
  const [state, setState] = React.useState<VoiceBarState>('idle');
  const voiceFilePathRef = React.useRef<string>('');
  const isPlayingRef = React.useRef<boolean>(false);
  const recordTimeoutRef = React.useRef<NodeJS.Timeout>();
  const im = useChatContext();

  const startRecord = (voiceFilePath?: string) => {
    if (voiceFilePath) {
      voiceFilePathRef.current = voiceFilePath;
    }
    setState('recording');
    recordTimeoutRef.current = setTimeout(() => {
      stopRecord();
    }, 60000);

    Services.ms
      .startRecordAudio({
        url: voiceFilePath,
        audio: {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        } as AudioSet,
        onPosition: (pos) => {
          console.log('test:startRecordAudio:pos:', pos);
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
      });
  };
  const stopRecord = React.useCallback(() => {
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = undefined;
    }

    setState('stopping');

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
  }, [im]);
  const replay = async () => {
    setState('playing');
    if (isPlayingRef.current === true) {
      await Services.ms.stopAudio();
    }
    isPlayingRef.current = true;
    Services.ms
      .playAudio({
        url: localUrlEscape(playUrl(voiceFilePathRef.current)),
        onPlay({ isMuted, currentPosition, duration }) {
          console.log('test:zuoyu:onPlay', isMuted, currentPosition, duration);
        },
      })
      .then(() => {
        console.log('test:zuoyu:playAudio:finish:2:');
        isPlayingRef.current = false;
        setState('stopping');
      })
      .catch((error) => {
        console.warn('test:zuoyu:error:', error);
        isPlayingRef.current = false;
        setState('stopping');
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
    setState('idle');
    if (isPlayingRef.current === true) {
      Services.ms.stopAudio();
      isPlayingRef.current = false;
    }
    if (recordTimeoutRef.current) {
      clearTimeout(recordTimeoutRef.current);
      recordTimeoutRef.current = undefined;
    }
    voiceFilePathRef.current = '';
  };
  const _onClickedSendButton = () => {
    onClickedSendButton?.(voiceFilePathRef.current);
    // todo: do something after send message?
  };

  React.useEffect(() => {
    return () => {
      if (recordTimeoutRef.current) {
        clearTimeout(recordTimeoutRef.current);
        recordTimeoutRef.current = undefined;
        stopRecord();
      }
    };
  }, [stopRecord]);

  return {
    state,
    onClickedRecordButton: _onClickedRecordButton,
    onClickedClearButton: _onClickedClearButton,
    onClickedSendButton: _onClickedSendButton,
  };
}
