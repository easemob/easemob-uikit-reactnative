import * as React from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextLayoutEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { TextProps } from '../../ui/Text';

export type IndentedTextHeaderProps = {
  /**
   * children of the component
   */
  headerChildren: React.ReactNode;
  /**
   * @see https://reactnative.dev/docs/view#style
   */
  headerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * Callback when the layout is calculated
   */
  headerOnLayout?: ((event: LayoutChangeEvent) => void) | undefined;
};

export type IndentedTextBodyProps = {
  /**
   * The unique identifier of the component
   */
  id: string;
  /**
   * The text content to display
   */
  content: string;
  /**
   * Used to truncate the text with an ellipsis after computing the text
   * layout, including line wrapping, such that the total number of lines
   * does not exceed this number.
   *
   * This prop is commonly used with `ellipsizeMode`.
   */
  numberOfLines?: number | undefined;
  /**
   * Invoked on Text layout
   */
  onTextLayout?:
    | ((event: NativeSyntheticEvent<TextLayoutEventData>) => void)
    | undefined;
  /**
   * @see https://reactnative.dev/docs/text#style
   */
  textStyle?: StyleProp<TextStyle> | undefined;
};

export type IndentedTextProps = IndentedTextHeaderProps &
  IndentedTextBodyProps & {
    /**
     * @see https://reactnative.dev/docs/view#style
     */
    scrollStyle?: StyleProp<ViewStyle> | undefined;
    /**
     * Whether to enable scroll
     */
    enableScroll?: boolean;

    /**
     * This function is called on press.
     */
    onPress?: ((event: GestureResponderEvent) => void) | undefined;

    /**
     * This function is called on long press.
     */
    onLongPress?: ((event: GestureResponderEvent) => void) | undefined;

    /**
     * The style of the component inner container
     */
    containerStyle?: StyleProp<ViewStyle> | undefined;
    /**
     * The callback when the layout is calculated
     */
    containerOnLayout?: ((event: LayoutChangeEvent) => void) | undefined;
    /**
     * The style of the outer container
     */
    outContainerStyle?: StyleProp<ViewStyle> | undefined;
    /**
     * The text props
     */
    textProps: Omit<TextProps, 'children'>;
    /**
     * Callback when the real content width is calculated
     */
    onRealContentWidth: (
      realContentWidth: number,
      realContent?: string
    ) => void;
  };
