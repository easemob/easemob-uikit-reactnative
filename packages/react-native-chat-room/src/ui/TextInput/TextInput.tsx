import * as React from 'react';
import {
  Platform,
  StyleProp,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export type TextInputProps = RNTextInputProps & {
  unitHeight?: number;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Mainly solves the multi-line problem of the native `RNTextInput` android platform.
 */
export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  function (
    props: React.PropsWithChildren<TextInputProps>,
    ref?: React.ForwardedRef<RNTextInput>
  ) {
    const {
      unitHeight,
      multiline,
      numberOfLines,
      style,
      onContentSizeChange,
      containerStyle,
      ...others
    } = props;

    const getMaxHeight = () => {
      if (multiline === true && numberOfLines && unitHeight) {
        return numberOfLines * unitHeight;
      }
      return undefined;
    };
    const maxHeightRef = React.useRef<number | undefined>(getMaxHeight());
    let [maxHeight, setMaxHeight] = React.useState<number | undefined>(
      maxHeightRef.current
    );

    const getStyle = (): StyleProp<TextStyle> => {
      const s = containerStyle as any;
      const max = s?.maxHeight ?? maxHeight;
      const min = s?.minHeight ?? unitHeight;
      if (max || min) {
        if (Platform.OS === 'ios') {
          return {
            maxHeight: max,
            minHeight: min,
          };
        } else {
          return {
            maxHeight: max,
            minHeight: min,
            flex: 1,
          };
        }
      }
      return undefined;
    };

    return (
      <View style={[containerStyle, getStyle()]}>
        <RNTextInput
          ref={ref}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={style}
          onContentSizeChange={(e) => {
            onContentSizeChange?.(e);
            if (Platform.OS !== 'ios') {
              if (maxHeightRef.current) {
                setMaxHeight(
                  Math.min(
                    e.nativeEvent.contentSize.height,
                    maxHeightRef.current
                  )
                );
              }
            }
          }}
          {...others}
        />
      </View>
    );
  }
);
