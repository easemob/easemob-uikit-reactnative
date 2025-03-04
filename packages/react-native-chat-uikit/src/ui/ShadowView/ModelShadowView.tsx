import * as React from 'react';
import { Platform, View } from 'react-native';

import { useThemeContext } from '../../theme';

export type ModelShadowViewProps = React.PropsWithChildren<{
  viewRef: React.RefObject<View>;
}>;

export function ModelShadowView(props: ModelShadowViewProps) {
  if (Platform.OS === 'ios') {
    return <ModelShadowStyleIos {...props} />;
  } else {
    return <ModelShadowStyleAndroid {...props} />;
  }
}
function ModelShadowStyleIos(props: ModelShadowViewProps) {
  const { children, viewRef } = props;
  const { shadow } = useThemeContext();
  return (
    <View
      ref={viewRef}
      style={[
        shadow.style.middle[0],
        {
          backgroundColor: 'transparent',
          borderRadius: 4,
          flex: 1,
        },
      ]}
    >
      <View
        style={[
          shadow.style.middle[1],
          {
            flex: 1,
            borderRadius: 4,
            // alignItems: 'flex-start',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
function ModelShadowStyleAndroid(props: ModelShadowViewProps) {
  const { children, viewRef } = props;
  const { shadow } = useThemeContext();
  return (
    <View
      ref={viewRef}
      style={[
        shadow.style.middle[0],
        {
          borderRadius: 4,
          flex: 1,
          elevation: 10,
        },
      ]}
    >
      {children}
    </View>
  );
}
