import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { gVoiceBarHeight } from '../const';

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
export type VoiceBarProps = {
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
  onClickedClearButton?: (voiceFilePath?: string) => void;
  /**
   * Callback notification when the send button is clicked. Returns the path of the recording file.
   */
  onClickedSendButton?: () => void;
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
  const [state, _setState] = React.useState<VoiceBarState>('idle');
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
              onPress={() => {}}
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
              onPress={() => {}}
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
