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

import { Text } from '../Text';

export type TextInputProps = RNTextInputProps & {
  unitHeight?: number;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;

  statistics?: {
    /**
     * Current word count.
     */
    count: number;
    /**
     * Callback notification when word count changes.
     */
    onCountChange?: (count: number) => void;
    /**
     * The maximum number of characters that can be entered.
     */
    maxCount: number;
    /**
     * Style of the text.
     */
    textStyles?: StyleProp<TextStyle>;
  };
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
      statistics,
      onChangeText,
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

    const _onChangeText = (text: string) => {
      onChangeText?.(text);
      if (statistics) {
        statistics.onCountChange?.(text.length);
      }
    };

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
            // flex: 1,
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
          onChangeText={_onChangeText}
          {...others}
        />
        {statistics ? (
          <View style={{ height: 22, width: '100%' }}>
            <Text
              textType={'large'}
              paletteType={'body'}
              style={[
                {
                  // height: 22,
                  // paddingRight: 12,
                  width: '100%',
                  textAlign: 'right',
                },
                statistics.textStyles,
              ]}
            >{`${statistics.count}/${statistics.maxCount}`}</Text>
          </View>
        ) : null}
      </View>
    );
  }
);
