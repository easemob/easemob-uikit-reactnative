import * as React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { a_logo } from '../assets';
import { Image, useColors, usePaletteContext } from '../rename.room';

export function Agora() {
  const { lineGradient } = usePaletteContext();
  const { start, end } = lineGradient.leftTopToRightBottom;
  const { getColors } = useColors({
    bg: {
      light: ['#009EFF', '#6678FF'],
      dark: ['#009EFF', '#6678FF'],
    },
  });
  return (
    <LinearGradient
      start={start}
      end={end}
      colors={getColors('bg') as (string | number)[]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View
        style={{ flex: 100, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={a_logo} />
      </View>
      <View style={{ flex: 10 }}>
        <Text
          style={{
            lineHeight: 18.2,
            fontWeight: '400',
            fontSize: 13,
            color: '#F9FAFA',
          }}
        >
          {'Powered by Agora.io'}
        </Text>
      </View>
    </LinearGradient>
  );
}
