/**
 * ref: 0.71.11 react-native KeyboardAvoidingView.js
 *
 * This component is modified based on `KeyboardAvoidingView.js` and adds android animation support.
 */

import * as React from 'react';
import type { KeyboardAvoidingViewProps, LayoutRectangle } from 'react-native';
import {
  AccessibilityInfo,
  EventSubscription,
  Keyboard,
  KeyboardEvent,
  KeyboardMetrics,
  LayoutAnimation,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

type ViewLayout = LayoutRectangle;
type ViewLayoutEvent = LayoutChangeEvent;

type State = {
  bottom: number;
};

/**
 * Mainly trying to solve the problem of native component `KeyboardAvoidingView` android keyboard animation. It has not been effectively solved yet. Subsequent optimization.
 */
export class KeyboardAvoidingView extends React.Component<
  KeyboardAvoidingViewProps,
  State
> {
  _frame: ViewLayout | null = null;
  _keyboardEvent: KeyboardEvent | null = null;
  _subscriptions: Array<EventSubscription> = [];
  viewRef: React.RefObject<View>;
  _initialFrameHeight: number = 0;

  constructor(props: KeyboardAvoidingViewProps) {
    super(props);
    this.state = { bottom: 0 };
    this.viewRef = React.createRef();
  }

  async _relativeKeyboardHeight(
    keyboardFrame: KeyboardMetrics
  ): Promise<number> {
    const frame = this._frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    // On iOS when Prefer Cross-Fade Transitions is enabled, the keyboard position
    // & height is reported differently (0 instead of Y position value matching height of frame)
    if (
      Platform.OS === 'ios' &&
      keyboardFrame.screenY === 0 &&
      (await AccessibilityInfo.prefersCrossFadeTransitions())
    ) {
      return 0;
    }

    const keyboardY =
      keyboardFrame.screenY - (this.props.keyboardVerticalOffset ?? 0);

    if (this.props.behavior === 'height') {
      return Math.max(
        this.state.bottom + frame.y + frame.height - keyboardY,
        0
      );
    }

    // Calculate the displacement needed for the view such that it
    // no longer overlaps with the keyboard
    return Math.max(frame.y + frame.height - keyboardY, 0);
  }

  _onKeyboardChange = (event: KeyboardEvent | null) => {
    if (this._keyboardEvent !== undefined || this._keyboardEvent !== null) {
      this._keyboardEvent =
        Platform.OS === 'ios'
          ? event
          : ({ ...event, duration: 250, easing: 'linear' } as KeyboardEvent);
    }

    // console.log('rn:_onKeyboardChange:', event, this._keyboardEvent);
    this._updateBottomIfNecessary();
  };

  _onLayout = async (event: ViewLayoutEvent) => {
    // console.log('rn:_onLayout:', event.nativeEvent);
    const wasFrameNull = this._frame == null;
    this._frame = event.nativeEvent.layout;
    if (!this._initialFrameHeight) {
      // save the initial frame height, before the keyboard is visible
      this._initialFrameHeight = this._frame.height;
    }

    if (wasFrameNull) {
      await this._updateBottomIfNecessary();
    }

    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  };

  _updateBottomIfNecessary = async () => {
    if (this._keyboardEvent == null) {
      this.setState({ bottom: 0 });
      return;
    }

    const { duration, easing, endCoordinates } = this._keyboardEvent;
    const height = await this._relativeKeyboardHeight(endCoordinates);
    // console.log(
    //   'rn:_updateBottomIfNecessary:',
    //   duration,
    //   easing,
    //   endCoordinates,
    //   height
    // );

    if (this.state.bottom === height) {
      return;
    }

    if (duration && easing) {
      LayoutAnimation.configureNext({
        // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
        duration: duration > 10 ? duration : 10,
        update: {
          duration: duration > 10 ? duration : 10,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.setState({ bottom: height });
  };

  componentDidMount(): void {
    if (Platform.OS === 'ios') {
      this._subscriptions = [
        Keyboard.addListener(
          'keyboardWillChangeFrame',
          this._onKeyboardChange.bind(this)
        ),
      ];
    } else {
      this._subscriptions = [
        Keyboard.addListener(
          'keyboardDidHide',
          this._onKeyboardChange.bind(this)
        ),
        Keyboard.addListener(
          'keyboardDidShow',
          this._onKeyboardChange.bind(this)
        ),
      ];
    }
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach((subscription) => {
      subscription.remove();
    });
  }

  render() {
    const {
      behavior,
      children,
      contentContainerStyle,
      enabled = true,
      style,
      ...props
    } = this.props;
    const bottomHeight = enabled === true ? this.state.bottom : 0;
    // console.log(
    //   'rn:render:',
    //   bottomHeight,
    //   this._initialFrameHeight,
    //   this._frame,
    //   this.state.bottom
    // );
    switch (behavior) {
      case 'height':
        let heightStyle;
        if (this._frame != null && this.state.bottom > 0) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = {
            height: this._initialFrameHeight - bottomHeight,
            flex: 0,
          };
        }
        return (
          <View
            ref={this.viewRef}
            style={StyleSheet.compose(style, heightStyle)}
            onLayout={this._onLayout}
            {...props}
          >
            {children}
          </View>
        );

      case 'position':
        return (
          <View
            ref={this.viewRef}
            style={style}
            onLayout={this._onLayout}
            {...props}
          >
            <View
              style={StyleSheet.compose(contentContainerStyle, {
                bottom: bottomHeight,
              })}
            >
              {children}
            </View>
          </View>
        );

      case 'padding':
        return (
          <View
            ref={this.viewRef}
            style={StyleSheet.compose(style, { paddingBottom: bottomHeight })}
            onLayout={this._onLayout}
            {...props}
          >
            {children}
          </View>
        );

      default:
        return (
          <View
            ref={this.viewRef}
            onLayout={this._onLayout}
            style={style}
            {...props}
          >
            {children}
          </View>
        );
    }
  }
}
