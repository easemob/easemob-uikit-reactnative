import * as React from 'react';
import { View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  useLifecycle,
} from '../rename.room';

function useMyData() {
  const r = React.useRef(0);
  useLifecycle(() => {}, 'useMyData', true);
  return {
    selfIncreasing: () => {
      ++r.current;
      console.log('test:r:', r.current);
    },
    r: r,
  };
}

type Component1Ref = {
  getR: () => any;
};
export const Component1 = React.forwardRef<Component1Ref, {}>(
  (props: {}, ref?: React.ForwardedRef<Component1Ref>) => {
    const {} = props;
    const { r, selfIncreasing } = useMyData();
    React.useImperativeHandle(
      ref,
      () => {
        return {
          getR: () => r,
        };
      },
      [r]
    );
    return (
      <View
        style={{ width: 100, height: 50, backgroundColor: 'blue', margin: 1 }}
        onTouchEnd={() => {
          selfIncreasing();
        }}
      />
    );
  }
);

export function Component2(): JSX.Element {
  const { selfIncreasing } = useMyData();
  useLifecycle(() => {}, 'Component2', true);
  return (
    <View
      style={{ width: 100, height: 50, backgroundColor: 'blue', margin: 1 }}
      onTouchEnd={() => {
        selfIncreasing();
      }}
    />
  );
}

export function Component3(): JSX.Element {
  const [isShow, setIsShow] = React.useState(false);
  const ref1 = React.useRef<Component1Ref>({} as any);
  const ref2 = React.useRef<Component1Ref>({} as any);
  return (
    <View
      style={{ width: 100, height: 50, backgroundColor: 'yellow', margin: 1 }}
      onTouchEnd={() => {
        setIsShow(!isShow);
        if (ref2.current) {
          console.log(
            'test:equal:',
            ref2.current.getR() === ref1.current?.getR(),
            ref1.current.getR().current,
            ref2.current.getR().current
          );
        }
      }}
    >
      <Component1 ref={ref1} />
      {isShow === true ? <Component1 ref={ref2} /> : null}
    </View>
  );
}

export default function test_use_local_object() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      isDevMode={true}
      palette={palette}
      theme={theme}
    >
      <View
        style={{
          flex: 1,
          // paddingTop: 100,
          backgroundColor: 'green',
        }}
      >
        <Component3 />
      </View>
    </Container>
  );
}
