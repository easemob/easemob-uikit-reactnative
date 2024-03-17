import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import type { AbsoluteViewProps } from './types';

export function AbsoluteView(props: AbsoluteViewProps) {
  const { containerStyle, propsRef, children } = props;
  const [display, setDisplay] = React.useState<'none' | 'flex' | undefined>(
    'flex'
  );
  const [destroyed, setDestroyed] = React.useState(true);
  const sRef = React.useRef(containerStyle);
  const cRef = React.useRef(children);
  const pointerEventsRef = React.useRef<
    'box-none' | 'none' | 'box-only' | 'auto' | undefined
  >('none');

  if (propsRef?.current) {
    propsRef.current.show = () => {
      pointerEventsRef.current = 'box-none';
      setDisplay('flex');
    };
    propsRef.current.hide = () => {
      pointerEventsRef.current = 'none';
      setDisplay('none');
    };
    propsRef.current.destroy = () => {
      pointerEventsRef.current = 'none';
      setDestroyed(true);
    };
    propsRef.current.showWithProps = (
      props: Pick<AbsoluteViewProps, 'children' | 'containerStyle'>
    ) => {
      const { children, containerStyle } = props;
      sRef.current = containerStyle;
      cRef.current = children;
      pointerEventsRef.current = 'box-none';
      setDisplay('flex');
      setDestroyed(false);
    };
  }
  return (
    <View
      style={[{ display: display }, StyleSheet.absoluteFill, sRef.current]}
      pointerEvents={pointerEventsRef.current}
    >
      {destroyed === false ? cRef.current : null}
    </View>
  );
}
