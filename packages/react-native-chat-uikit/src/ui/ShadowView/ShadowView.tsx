import * as React from 'react';
import { View } from 'react-native';

import { useThemeContext } from '../../theme';

export type ShadowViewProps = React.PropsWithChildren<{}>;

export function ShadowView(props: ShadowViewProps) {
  const { children } = props;
  const { shadow } = useThemeContext();
  return (
    <View
      style={{
        //  WARN  (ADVICE) View #3647 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
        // backgroundColor: getColor('backgroundColor'),
        ...shadow.style.small[0],
        backgroundColor: '#ffffff',
      }}
    >
      <View
        style={{
          //  WARN  (ADVICE) View #3645 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
          // backgroundColor: getColor('backgroundColor'),
          ...shadow.style.small[1],
          backgroundColor: '#ffffff',
        }}
      >
        {children}
      </View>
    </View>
  );
}
