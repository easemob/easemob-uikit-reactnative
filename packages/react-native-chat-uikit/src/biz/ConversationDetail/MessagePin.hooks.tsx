import * as React from 'react';

// import { uilog } from '../../const';
import { useVerticalMoveGesture } from '../hooks';
import { useHeightAnimation } from '../hooks/useHeightAnimation';
import { gMsgPinHeight } from './const';

export type useMessagePinProps = {};
export function useMessagePin(props: useMessagePinProps) {
  const {} = props;
  const [maxListHeight, setMaxListHeight] = React.useState<number>(0);

  const msgPinBackgroundOpacityRef = React.useRef(0);
  const {
    heightAnimate: msgPinBackgroundOpacityAnimate,
    currentHeight: msgPinBackgroundCurrentOpacity,
  } = useHeightAnimation({
    initHeight: msgPinBackgroundOpacityRef.current,
  });
  const msgPinPlaceHolderHeightRef = React.useRef(0);
  const {
    heightAnimate: msgPinPlaceHolderHeightAnimate,
    currentHeight: msgPinPlaceHolderCurrentHeight,
  } = useHeightAnimation({
    initHeight: msgPinPlaceHolderHeightRef.current,
  });
  const msgPinHeightRef = React.useRef(0);
  const {
    heightAnimate: msgPinHeightAnimate,
    currentHeight: msgPinCurrentHeight,
  } = useHeightAnimation({
    initHeight: msgPinHeightRef.current,
  });
  const msgPinLabelTranslateYRef = React.useRef(-gMsgPinHeight);
  const {
    heightAnimate: msgPinLabelTranslateYAnimate,
    currentHeight: msgPinLabelCurrentTranslateY,
  } = useHeightAnimation({
    initHeight: msgPinLabelTranslateYRef.current,
  });
  const msgListMaxCurrentHeight = msgPinPlaceHolderCurrentHeight.interpolate({
    inputRange: [0, gMsgPinHeight],
    outputRange: [maxListHeight, maxListHeight - gMsgPinHeight],
  });
  const { panHandlers } = useVerticalMoveGesture({
    translateY: msgPinCurrentHeight,
  });

  React.useEffect(() => {
    if (msgPinPlaceHolderHeightRef.current === gMsgPinHeight) {
      return;
    }
    setTimeout(() => {
      msgPinPlaceHolderHeightRef.current = gMsgPinHeight;
      msgPinPlaceHolderHeightAnimate(gMsgPinHeight);
      msgPinHeightAnimate(gMsgPinHeight);
      msgPinLabelTranslateYAnimate(0);
    }, 1000);
  }, [
    msgPinHeightAnimate,
    msgPinLabelTranslateYAnimate,
    msgPinPlaceHolderHeightAnimate,
  ]);

  return {
    maxListHeight,
    setMaxListHeight,
    panHandlers,
    msgPinPlaceHolderHeightRef,
    msgPinPlaceHolderHeightAnimate,
    msgPinPlaceHolderCurrentHeight,
    msgListMaxCurrentHeight,
    msgPinHeightRef,
    msgPinHeightAnimate,
    msgPinCurrentHeight,
    msgPinLabelTranslateYRef,
    msgPinLabelTranslateYAnimate,
    msgPinLabelCurrentTranslateY,
    msgPinBackgroundOpacityAnimate,
    msgPinBackgroundCurrentOpacity,
  };
}
