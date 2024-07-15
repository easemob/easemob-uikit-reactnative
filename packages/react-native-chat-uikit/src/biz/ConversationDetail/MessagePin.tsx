import * as React from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderHandlers,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { UseColors } from '../../hook';
import { I18nContext } from '../../i18n';
import { ChatMessage } from '../../rename.chat';
import {
  ColorsPalette,
  PaletteContext,
  ThemeContext,
  ThemeType,
} from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { gMsgPinHeight } from './const';
import { MessagePinList, MessagePinListRef } from './MessagePinList';

export type MessagePinHolderProps = {
  style?: StyleProp<ViewStyle> | undefined;
};

// !!!  ERROR  Invariant Violation: `createAnimatedComponent` does not support stateless functional components; use a class component instead.
export function MessagePinPlaceholder(props: MessagePinHolderProps) {
  const { style } = props;
  return <Animated.View style={[style]} />;
}
export class MessagePinPlaceholder2 extends React.PureComponent<MessagePinHolderProps> {
  render(): React.ReactNode {
    const { style } = this.props;
    return <Animated.View style={[style]} />;
  }
}
export const AnimatedMessagePinPlaceholder = Animated.createAnimatedComponent(
  MessagePinPlaceholder2
);

export type MessagePinProps = {
  convId: string;
  convType: number;
  style?: StyleProp<ViewStyle> | undefined;
  msgPinHeightRef: React.MutableRefObject<number>;
  msgPinHeightAnimate: (
    toValue: number,
    onFinished?: ((result: Animated.EndResult) => void) | undefined,
    offsetToZero?: boolean
  ) => void;
  msgPinLabelTranslateYRef: React.MutableRefObject<number>;
  msgPinLabelTranslateYAnimate: (
    toValue: number,
    onFinished?: ((result: Animated.EndResult) => void) | undefined
  ) => void;
  msgPinBackgroundOpacityAnimate: (
    toValue: number,
    onFinished?: ((result: Animated.EndResult) => void) | undefined
  ) => void;
  msgPinPlaceHolderHeightAnimate: (
    toValue: number,
    onFinished?: ((result: Animated.EndResult) => void) | undefined
  ) => void;
  msgPinLabelCurrentTranslateY: Animated.Value;
  msgPinBackgroundCurrentOpacity: Animated.Value;
  msgPinCurrentHeight: Animated.Value;
  panHandlers: GestureResponderHandlers;
  onChangePinMaskHeight?: (height: number) => void;
  onRequestClose?: () => void;
};

export type MessagePinState = {
  maxListHeight: number;
};

export class MessagePin2 extends React.PureComponent<
  MessagePinProps,
  MessagePinState
> {
  private listRef: React.RefObject<MessagePinListRef>;
  private getListRef: React.MutableRefObject<
    (ref: React.RefObject<MessagePinListRef>) => void
  >;
  private uc: UseColors;
  private tr?: (key: string, ...args: any[]) => string;
  private colors?: ColorsPalette | undefined;
  private style?: ThemeType | undefined;
  private _maxListHeight: number;
  private _hadShow: boolean;

  constructor(props: MessagePinProps) {
    super(props);
    this.uc = new UseColors();
    this._maxListHeight = 0;
    this.listRef = React.createRef();
    this.getListRef = React.createRef() as any;
    this.getListRef.current = (ref: React.RefObject<MessagePinListRef>) =>
      (this.listRef = ref);
    this.state = {
      maxListHeight: 0,
    };
    this._hadShow = false;
  }

  componentDidMount?(): void {
    this.uc.initColor({
      bg: {
        light: this.colors?.neutral[98],
        dark: this.colors?.neutral[1],
      },
      bg2: {
        light: this.colors?.neutral[95],
        dark: this.colors?.neutral[2],
      },
      fg: {
        light: this.colors?.neutral[1],
        dark: this.colors?.neutral[98],
      },
      bg4: {
        light: this.colors?.neutral[9],
        dark: this.colors?.neutral[3],
      },
      pin: {
        light: this.colors?.neutral[3],
        dark: this.colors?.neutral[7],
      },
    });
  }
  componentWillUnmount?(): void {}

  public show(): void {
    const {
      msgPinHeightRef,
      msgPinPlaceHolderHeightAnimate,
      msgPinHeightAnimate,
      msgPinBackgroundOpacityAnimate,
      onChangePinMaskHeight,
      msgPinLabelTranslateYAnimate,
    } = this.props;
    this._hadShow = true;
    msgPinHeightRef.current = gMsgPinHeight + this._maxListHeight;
    msgPinPlaceHolderHeightAnimate(gMsgPinHeight);
    msgPinHeightAnimate(gMsgPinHeight + this._maxListHeight);
    msgPinBackgroundOpacityAnimate(1);
    msgPinLabelTranslateYAnimate(0);
    onChangePinMaskHeight?.(gMsgPinHeight + this._maxListHeight);
  }
  public hide(): void {
    const {
      msgPinHeightRef,
      msgPinPlaceHolderHeightAnimate,
      msgPinHeightAnimate,
      msgPinBackgroundOpacityAnimate,
      onChangePinMaskHeight,
      msgPinLabelTranslateYAnimate,
    } = this.props;
    this._hadShow = false;
    msgPinHeightRef.current = 0;
    msgPinPlaceHolderHeightAnimate(0);
    msgPinHeightAnimate(0);
    msgPinBackgroundOpacityAnimate(0);
    msgPinLabelTranslateYAnimate(-gMsgPinHeight);
    onChangePinMaskHeight?.(0);
  }

  private onListCountChanged(count: number): void {
    const { msgPinHeightAnimate } = this.props;
    this._maxListHeight =
      count > 0
        ? Math.min(
            count * 60,
            Math.min(
              8 * 60,
              (Dimensions.get('window').height * (844 - 176)) / 844
            )
          ) + 16
        : 16;
    this.setState({ maxListHeight: this._maxListHeight });
    if (this._hadShow === false) {
      return;
    }
    if (count > 0) {
      msgPinHeightAnimate(gMsgPinHeight + this._maxListHeight);
    } else {
      msgPinHeightAnimate(gMsgPinHeight);
    }
  }

  private onRequestClose(): void {
    const { onRequestClose } = this.props;
    onRequestClose?.();
  }

  public addPinMessage(msg: ChatMessage): void {
    this.listRef.current?.addPinMessage(msg);
  }
  public registerCallback(onClickedItem: (msg: ChatMessage) => void): void {
    this.listRef.current?.registerCallback(onClickedItem);
  }

  private _render(): React.ReactNode {
    const {
      convId,
      convType,
      style,
      msgPinHeightRef,
      msgPinLabelCurrentTranslateY,
      msgPinBackgroundCurrentOpacity,
      msgPinCurrentHeight,
      // panHandlers,
    } = this.props;
    return (
      <>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              bottom: -100,
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              opacity: msgPinBackgroundCurrentOpacity,
            },
          ]}
          pointerEvents={msgPinHeightRef.current <= 0 ? 'none' : 'auto'}
          onStartShouldSetResponder={() => true}
          onResponderRelease={this.onRequestClose.bind(this)}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: Dimensions.get('window').width,
              backgroundColor: this.uc.getColor(this.style!, 'bg'),
              overflow: 'hidden',
              height: msgPinCurrentHeight,
            },
            style,
          ]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => {
            this.onRequestClose();
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              marginTop: 8,
              width: '100%',
              alignItems: 'center',
              transform: [
                {
                  translateY: msgPinLabelCurrentTranslateY,
                },
              ],
            }}
          >
            <View
              style={{
                height: 12,
                borderRadius: 12,
                // backgroundColor: this.uc.getColor(
                //   this.style!,
                //   msgPinHeightRef.current <= gMsgPinHeight ? 'bg4' : ''
                // ),
                width: Dimensions.get('window').width - 24 - 16,
                bottom: -28,
              }}
            />
            <View
              style={{
                height: 34,
                width: Dimensions.get('window').width - 24,
                // backgroundColor: this.uc.getColor(
                //   this.style!,
                //   msgPinHeightRef.current <= gMsgPinHeight ? 'bg2' : ''
                // ),
                borderRadius: 4,
                top: -12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name={'pin_2'}
                style={{
                  height: 18,
                  width: 18,
                  marginHorizontal: 8,
                  tintColor: this.uc.getColor(this.style!, 'pin'),
                }}
              />
              <SingleLineText
                paletteType={'label'}
                textType={'medium'}
                style={{
                  color: this.uc.getColor(this.style!, 'fg'),
                }}
              >
                {this.tr?.('_uikit_pin_message_title')}
              </SingleLineText>
            </View>
            <MessagePinList
              propsRef={this.getListRef.current}
              convId={convId}
              convType={convType}
              onCountChanged={this.onListCountChanged.bind(this)}
              onRequestClose={this.onRequestClose.bind(this)}
            />
          </Animated.View>
          <Animated.View
            style={{
              height: msgPinHeightRef.current <= gMsgPinHeight ? 0 : 16,
              width: '100%',
              backgroundColor: this.uc.getColor(this.style!, 'bg'),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // {...panHandlers}
          >
            <View
              style={{
                width: 36,
                height: msgPinHeightRef.current <= gMsgPinHeight ? 0 : 6,
                borderRadius: 2.5,
                backgroundColor: this.uc.getColor(this.style!, 'bg4'),
              }}
            />
          </Animated.View>
        </Animated.View>
      </>
    );
  }

  render(): React.ReactNode {
    return (
      <PaletteContext.Consumer>
        {(palette) => {
          this.colors = palette?.colors;
          return (
            <ThemeContext.Consumer>
              {(theme) => {
                this.style = theme?.style;
                return (
                  <I18nContext.Consumer>
                    {(i18n) => {
                      this.tr = i18n?.tr;
                      return this._render();
                    }}
                  </I18nContext.Consumer>
                );
              }}
            </ThemeContext.Consumer>
          );
        }}
      </PaletteContext.Consumer>
    );
  }
}
export const AnimatedMessagePin = Animated.createAnimatedComponent(MessagePin2);
