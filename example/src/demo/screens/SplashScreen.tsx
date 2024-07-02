import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ImageBackground, View } from 'react-native';

import {
  Icon,
  LoadingIcon,
  Text,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { logo, main_bg } from '../common/assets';
import { accountType } from '../common/const';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SplashScreen(props: Props) {
  const {} = props;
  const { tr } = useI18nContext();
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
  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
      source={main_bg}
    >
      <View style={{ flex: 277 }} />
      <Icon name={logo} resolution={'3x'} style={{ width: 100, height: 100 }} />
      <View style={{ flex: 35 }} />
      <Text
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
      </Text>
      <View style={{ flex: 322 }} />
      <Text
        style={{
          fontSize: 13,
          fontWeight: '400',
          lineHeight: 18,
          textAlign: 'center',
          color: getColor('n'),
        }}
      >
        {accountType === 'agora' ? 'Powered by Agora' : 'Powered by Easemob'}
      </Text>

      <View style={{ flex: 62 }} />

      <View style={{ position: 'absolute', bottom: 140 }}>
        <LoadingIcon
          name={'spinner'}
          style={{ width: 36, height: 36, tintColor: getColor('n') }}
        />
      </View>
    </ImageBackground>
  );
}
