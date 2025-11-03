import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { AppState, ImageBackground, View } from 'react-native';

import {
  Icon,
  LoadingIcon,
  SingleLineText,
  useColors,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from '../../rename.uikit';
import { logo, main_bg, main_bg_dark } from '../common/assets';
import { accountType } from '../common/const';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SplashScreen(props: Props) {
  const {} = props;
  const [isStop, setIsStop] = React.useState(true);
  const [isFocused, setIsFocused] = React.useState(false);
  const { tr } = useI18nContext();
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    p: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    n: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  React.useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (status === 'active' && isFocused === true) {
        setIsStop(false);
      } else if (status === 'background') {
        setIsStop(true);
      }
    });
    return () => {
      listener.remove();
    };
  }, [isFocused]);
  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      setIsStop(false);
      return () => {
        setIsFocused(false);
        setIsStop(true);
      };
    }, [])
  );
  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
      source={style === 'light' ? main_bg : main_bg_dark}
    >
      <View style={{ flex: 277 }} />
      <Icon name={logo} resolution={'3x'} style={{ width: 100, height: 100 }} />
      <View style={{ flex: 35 }} />
      <SingleLineText
        style={{
          fontSize: 24,
          fontWeight: '600',
          lineHeight: 28,
          textAlign: 'center',
          letterSpacing: 10,
          color: getColor('p'),
        }}
      >
        {tr(
          '_demo_splash_title',
          accountType === 'agora' ? 'agora' : 'easemob'
        )}
      </SingleLineText>
      <View style={{ flex: 322 }} />
      <SingleLineText
        style={{
          fontSize: 13,
          fontWeight: '400',
          lineHeight: 18,
          textAlign: 'center',
          color: getColor('n'),
        }}
      >
        {accountType === 'agora' ? 'Powered by Agora' : 'Powered by Easemob'}
      </SingleLineText>

      <View style={{ flex: 62 }} />

      <View style={{ position: 'absolute', bottom: 140 }}>
        <LoadingIcon
          name={'spinner'}
          isStop={isStop}
          style={{ width: 36, height: 36, tintColor: getColor('n') }}
        />
      </View>
    </ImageBackground>
  );
}
