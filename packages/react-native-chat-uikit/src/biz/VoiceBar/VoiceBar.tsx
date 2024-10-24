import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Ripple } from '../../ui/Ripple';
import { SingleLineText, TimerText } from '../../ui/Text';
import { gVoiceBarHeight } from '../const';
import type { VoiceBarProps } from './types';
import { useVoiceBar } from './VoiceBar.hooks';

/**
 * Component for recording and playing speech.
 */
export function VoiceBar(props: VoiceBarProps) {
  const { height } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
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
    contentTimerRef,
    playRipple,
    onContentTimeChanged,
    currentTime,
  } = useVoiceBar(props);

  const getTextTip = () => {
    switch (state) {
      case 'idle':
        return tr('voice_bar_tip_click_record');
      case 'recording':
        return tr('voice_bar_tip_recording');
      case 'playing':
        return tr('voice_bar_tip_playing');
      case 'stopping':
        return tr('voice_bar_tip_click_play');
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

        <Ripple
          containerStyle={{
            height: 58,
            width: 90,
          }}
          childrenStyle={{
            borderRadius: 24,
            height: 48,
            width: 80,
          }}
          rippleStyle={{
            height: 58,
            width: 90,
            backgroundColor: getColor('enable') as string,
          }}
          playAnimated={playRipple}
          rippleStartOpacity={0.1}
        >
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
              <Icon
                name={'mic_on'}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: getColor('bg'),
                  display: state === 'idle' ? 'flex' : 'none',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  display: state === 'idle' ? 'none' : 'flex',
                }}
              >
                <TimerText
                  textStyle={{
                    textType: 'small',
                    paletteType: 'headline',
                    style: {
                      color: getColor('bg'),
                    },
                  }}
                  isIncrease={true}
                  startValue={0}
                  stopValue={60}
                  onChanged={onContentTimeChanged}
                  propsRef={contentTimerRef}
                />
                <SingleLineText
                  textType={'small'}
                  paletteType={'headline'}
                  style={{
                    color: getColor('bg'),
                  }}
                >
                  {'s'}
                </SingleLineText>
              </View>
            </View>
          </Pressable>
        </Ripple>

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
        <SingleLineText
          textType={'medium'}
          paletteType={'label'}
          style={{
            color: getColor('trash'),
            marginTop: 16,
          }}
        >
          {getTextTip()}
        </SingleLineText>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            display: currentTime > 50 ? 'flex' : 'none',
          }}
        >
          <SingleLineText
            textType={'small'}
            paletteType={'body'}
            style={{
              color: getColor('trash'),
            }}
          >
            {tr('voice_bar_remain', 60 - currentTime)}
          </SingleLineText>
        </View>
      </View>
    </View>
  );
}
