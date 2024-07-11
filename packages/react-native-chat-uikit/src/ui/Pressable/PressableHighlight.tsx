import * as React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { useColors } from '../../hook';

export type PressableHighlightProps = PressableProps &
  React.RefAttributes<View> & {
    /**
     * The color of the underlay that will show through when the touch is active.
     */
    underlayColor?: ColorValue | undefined;
  };

/**
 * Click on the component with the highlighted background. Referenced `Pressable` and `TouchableHighlight`.
 */
export function PressableHighlight(props: PressableHighlightProps) {
  const { underlayColor, onPressIn, onPressOut, style, ...others } = props;
  const [_underlayColor, setUnderlayColor] = React.useState<
    ColorValue | undefined
  >(underlayColor);

  const { getColor } = useColors();

  const _onPressIn = React.useCallback(
    (event: GestureResponderEvent) => {
      onPressIn?.(event);
      const uc = underlayColor ?? getColor('bg2');
      if (uc) {
        setUnderlayColor(uc);
      }
    },
    [getColor, onPressIn, underlayColor]
  );
  const _onPressOut = React.useCallback(
    (event: GestureResponderEvent) => {
      onPressOut?.(event);
      const uc = underlayColor ?? getColor('bg2');
      if (uc) {
        setUnderlayColor(undefined);
      }
    },
    [getColor, onPressOut, underlayColor]
  );
  return (
    <Pressable
      {...others}
      style={
        [
          style,
          _underlayColor
            ? {
                backgroundColor: _underlayColor,
              }
            : undefined,
        ] as StyleProp<ViewStyle>
      }
      onPressIn={_onPressIn}
      onPressOut={_onPressOut}
    />
  );
}
