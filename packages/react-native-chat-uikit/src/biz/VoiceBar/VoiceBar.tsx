import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text, TimerText } from '../../ui/Text';
import { gVoiceBarHeight } from '../const';
import type { VoiceBarProps } from './types';
import { useVoiceBar } from './VoiceBar.hooks';

export function VoiceBar(props: VoiceBarProps) {
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
    tipTimerRef,
    contentTimerRef,
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
                propsRef={contentTimerRef}
              />
              <Text
                textType={'small'}
                paletteType={'headline'}
                style={{
                  color: getColor('bg'),
                }}
              >
                {'s'}
              </Text>
            </View>
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
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            display: state === 'recording' ? 'flex' : 'none',
          }}
        >
          <TimerText
            textStyle={{
              textType: 'small',
              paletteType: 'body',
              style: {
                color: getColor('trash'),
              },
            }}
            isIncrease={false}
            startValue={60}
            stopValue={0}
            propsRef={tipTimerRef}
          />
          <Text
            textType={'small'}
            paletteType={'body'}
            style={{
              color: getColor('trash'),
            }}
          >
            {tr('s Remaining')}
          </Text>
        </View>
      </View>
    </View>
  );
}
