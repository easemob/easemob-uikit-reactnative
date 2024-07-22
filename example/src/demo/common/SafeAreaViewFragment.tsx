import * as React from 'react';
import { ColorValue, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors, useThemeContext } from '../../rename.uikit';
import { useBackgroundColor } from '../hooks';

type Props = React.PropsWithChildren<{
  backgroundColor?: ColorValue | undefined | null;
  visibleStatusBar?: boolean;
}>;
export function SafeAreaViewFragment(props: Props) {
  const { children, backgroundColor, visibleStatusBar = true } = props;
  const { getBackgroundColor } = useBackgroundColor();
  const { style } = useThemeContext();
  const { getColor } = useColors();
  return (
    <View style={{ flex: 1 }}>
      {visibleStatusBar && (
        <StatusBar
          barStyle={style === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={getColor('bg')}
        />
      )}

      <SafeAreaView
        style={{
          backgroundColor:
            backgroundColor === null ? undefined : getBackgroundColor('bg'),
          flex: 1,
        }}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}
