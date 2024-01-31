import * as React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useColors, useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon } from '../Image';
import { Text } from '../Text';

export type TextInputProps = RNTextInputProps & {
  unitHeight?: number;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Enable clear button.
   *
   * Default is `false`.
   */
  enableClearButton?: boolean;
  /**
   * Clear button style.
   */
  clearButtonStyle?: ViewStyle;
  /**
   * Callback notification when clear button is pressed.
   */
  onClear?: () => void;

  /**
   * Statistics settings for the text input component.
   */
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
      value,
      clearButtonMode: _,
      clearTextOnFocus: __,
      enableClearButton,
      clearButtonStyle,
      onClear,
      ...others
    } = props;
    _;
    __;
    const { cornerRadius: corner } = useThemeContext();
    const { cornerRadius, colors } = usePaletteContext();
    const { getBorderRadius } = useGetStyleProps();
    const { getColor } = useColors({
      bg: {
        light: colors.neutral[95],
        dark: colors.neutral[2],
      },
      fg: {
        light: colors.neutral[1],
        dark: colors.neutral[98],
      },
      clear: {
        light: colors.neutral[3],
        dark: colors.neutral[8],
      },
      count: {
        light: colors.neutral[7],
        dark: colors.neutral[8],
      },
    });

    const { getStyleProp } = useGetStyleProps();
    const minHeight = getStyleProp('minHeight', containerStyle);
    const maxHeight = getStyleProp('maxHeight', containerStyle);

    const getMaxHeight = () => {
      if (multiline === true && numberOfLines && unitHeight) {
        return numberOfLines * unitHeight;
      }
      return undefined;
    };
    const maxHeightRef = React.useRef<number | undefined>(getMaxHeight());
    let [_maxHeight, setMaxHeight] = React.useState<number | undefined>(
      maxHeightRef.current
    );
    let [_height, setHeight] = React.useState<number | undefined>(minHeight);

    const _onChangeText = React.useCallback(
      (text: string) => {
        onChangeText?.(text);
        if (statistics) {
          statistics.onCountChange?.(text.length);
        }
      },
      [onChangeText, statistics]
    );

    const _onClearValue = React.useCallback(() => {
      _onChangeText('');
      onClear?.();
    }, [_onChangeText, onClear]);

    const getStyle = (): StyleProp<TextStyle> => {
      if (multiline !== true) {
        return undefined;
      }
      const maxHeight = getStyleProp('maxHeight', containerStyle);
      const minHeight = getStyleProp('minHeight', containerStyle);
      if (Platform.OS === 'ios') {
        return {
          maxHeight: _maxHeight,
          minHeight: minHeight,
        };
      } else if (Platform.OS === 'android') {
        return {
          height: _height,
          minHeight: minHeight,
        };
      } else {
        return {
          maxHeight: maxHeight,
          minHeight: minHeight,
        };
      }
    };

    return (
      <View
        style={[
          {
            borderRadius: getBorderRadius({
              height: 36,
              crt: corner.avatar,
              cr: cornerRadius,
              style: containerStyle,
            }),
            backgroundColor: getColor('bg'),
          },
          containerStyle,
          getStyle(),
        ]}
      >
        <RNTextInput
          ref={ref}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            {
              color: getColor('fg'),
            },
            style,
          ]}
          onContentSizeChange={(e) => {
            onContentSizeChange?.(e);
            // console.log(
            //   'dev:onContentSizeChange',
            //   minHeight,
            //   maxHeight,
            //   maxHeightRef.current,
            //   e.nativeEvent.contentSize.height,
            //   Math.min(
            //     Math.max(minHeight, e.nativeEvent.contentSize.height),
            //     maxHeight ?? maxHeightRef.current
            //   )
            // );
            if (Platform.OS === 'ios') {
              if (maxHeightRef.current && maxHeight) {
                setMaxHeight(Math.min(maxHeight, maxHeightRef.current));
              }
            } else if (Platform.OS === 'android') {
              if (numberOfLines !== undefined) {
                if (maxHeightRef.current) {
                  setHeight(
                    Math.min(
                      Math.max(minHeight, e.nativeEvent.contentSize.height),
                      maxHeight ?? maxHeightRef.current
                    )
                  );
                }
              } else {
                if (maxHeightRef.current && maxHeight) {
                  setHeight(Math.min(maxHeight, maxHeightRef.current));
                }
              }
            }
          }}
          onChangeText={_onChangeText}
          autoCapitalize={'none'}
          value={value}
          {...others}
        />
        {statistics ? (
          <View
            style={{
              height: 22,
              width: '100%',
              position: 'absolute',
              bottom: -22,
            }}
          >
            <Text
              textType={'large'}
              paletteType={'body'}
              style={[
                {
                  // height: 22,
                  // paddingRight: 12,
                  width: '100%',
                  textAlign: 'right',
                  color: getColor('count'),
                },
                statistics.textStyles,
              ]}
            >{`${statistics.count}/${statistics.maxCount}`}</Text>
          </View>
        ) : null}
        {value && value?.length > 0 && enableClearButton === true ? (
          <Pressable
            style={[
              {
                position: 'absolute',
                right: 0,
                padding: 13,
                justifyContent: 'center',
                alignItems: 'center',
              },
              clearButtonStyle,
            ]}
            onPress={_onClearValue}
          >
            <Icon
              name={'xmark_in_circle_fill'}
              resolution={'3x'}
              style={{ height: 22, width: 22, tintColor: getColor('clear') }}
            />
          </Pressable>
        ) : null}
      </View>
    );
  }
);
