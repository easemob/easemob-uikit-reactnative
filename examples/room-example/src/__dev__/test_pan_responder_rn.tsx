// ref: https://github.com/necolas/react-native-web/issues/1825

import * as React from 'react';
import { FlatList, PanResponder, ScrollView, Text, View } from 'react-native';

import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
} from '../rename.room';

export function PanResponderComponent(): JSX.Element {
  const p = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:p:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:p:move:');
      },
    })
  ).current.panHandlers;
  const pp = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:pp:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:pp:move:');
      },
    })
  ).current.panHandlers;
  return (
    <View style={{ width: 300, height: 400, backgroundColor: 'blue' }} {...p}>
      <View style={{ width: 200, height: 300, backgroundColor: 'red' }}>
        <View
          style={{ width: 100, height: 200, backgroundColor: 'yellow' }}
          {...pp}
        />
      </View>
    </View>
  );
}

/**
 * Test the scrolling of FlatList.
 */
export function PanResponderComponent3(): JSX.Element {
  const ref = React.useRef<FlatList>({} as any);

  const p = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:p:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:p:move:');
      },
    })
  ).current.panHandlers;
  const pp = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // onStartShouldSetPanResponderCapture: () => true,
      // onMoveShouldSetPanResponder: () => true,
      // onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        console.log('test:pp:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:pp:move:');
      },
    })
  ).current.panHandlers;
  return (
    <View style={{ width: 300, height: 400, backgroundColor: 'blue' }} {...p}>
      <View style={{ width: 200, height: 300, backgroundColor: 'red' }}>
        <View
          style={{ width: 100, height: 200, backgroundColor: 'yellow' }}
          {...pp}
        >
          <FlatList
            ref={ref}
            data={[
              { id: 1 },
              { id: 2 },
              { id: 3 },
              { id: 4 },
              { id: 5 },
              { id: 6 },
            ]}
            renderItem={(info) => {
              const { item } = info;
              return (
                <View
                  key={item.id}
                  style={{ height: 50, margin: 2, backgroundColor: 'orange' }}
                >
                  <Text>{item.id}</Text>
                </View>
              );
            }}
            onScroll={() => {
              console.log('test:pp:onScroll:');
            }}
            nestedScrollEnabled={true}
            // {...pp}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * Test the scrolling of FlatList.
 *
 * The nested scrolling problem of ScrollView has been solved. But not perfect.
 */
export function PanResponderComponent5(): JSX.Element {
  console.log('test:PanResponderComponent5:');
  const ref = React.useRef<FlatList>({} as any);
  const isRef = React.useRef(false);
  const p = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('test:p:start:', isRef.current);
        if (isRef.current === true) {
          return false;
        }
        return true;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:p:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:p:move:');
      },
    })
  ).current.panHandlers;
  return (
    <View style={{ width: 300, height: 400, backgroundColor: 'blue' }} {...p}>
      <View style={{ width: 200, height: 300, backgroundColor: 'red' }}>
        <View
          style={{ width: 100, height: 200, backgroundColor: 'yellow' }}
          onStartShouldSetResponder={() => {
            console.log('test:pp:start:', isRef.current);
            if (isRef.current === false) {
              console.log('test:pp:start:2:');
              isRef.current = true;
            }
            if (isRef.current === true) {
              return false;
            }
            return true;
          }}
          onResponderGrant={() => {
            console.log('test:pp:grant:');
          }}
          onResponderMove={() => {
            console.log('test:pp:move:');
          }}
        >
          <FlatList
            ref={ref}
            data={[
              { id: 1 },
              { id: 2 },
              { id: 3 },
              { id: 4 },
              { id: 5 },
              { id: 6 },
            ]}
            renderItem={(info) => {
              const { item } = info;
              return (
                <View
                  key={item.id}
                  style={{ height: 50, margin: 2, backgroundColor: 'orange' }}
                >
                  <Text>{item.id}</Text>
                </View>
              );
            }}
            onScroll={() => {
              console.log('test:pp:onScroll:');
            }}
            onResponderEnd={() => {
              console.log('test:pp:onResponderEnd:');
              isRef.current = false;
            }}
            onMomentumScrollEnd={() => {
              console.log('test:pp:onMomentumScrollEnd:');
              isRef.current = false;
            }}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * Test the scrolling of FlatList.
 *
 * The nested scrolling problem of ScrollView has been solved. But not perfect.
 */
export function PanResponderComponent6(): JSX.Element {
  const ref = React.useRef<FlatList>({} as any);
  // const [isF, setIsF] = React.useState(false);
  const isRef = React.useRef(false);
  return (
    <View
      style={{ width: 300, height: 400, backgroundColor: 'blue' }}
      onStartShouldSetResponder={() => {
        console.log('test:p:start:');
        if (isRef.current === true) {
          return false;
        }
        return true;
      }}
      onResponderGrant={() => {
        console.log('test:p:grant:');
      }}
      onResponderMove={() => {
        console.log('test:p:move:');
      }}
    >
      <View style={{ width: 200, height: 300, backgroundColor: 'red' }}>
        <View
          style={{ width: 100, height: 200, backgroundColor: 'yellow' }}
          onStartShouldSetResponder={() => {
            console.log('test:pp:start:', isRef.current);
            if (isRef.current === false) {
              console.log('test:pp:start:2:');
              isRef.current = true;
            }
            if (isRef.current === true) {
              return false;
            }
            return true;
          }}
          onResponderGrant={() => {
            console.log('test:pp:grant:');
          }}
          onResponderMove={() => {
            console.log('test:pp:move:');
          }}
        >
          <FlatList
            ref={ref}
            data={[
              { id: 1 },
              { id: 2 },
              { id: 3 },
              { id: 4 },
              { id: 5 },
              { id: 6 },
            ]}
            renderItem={(info) => {
              const { item } = info;
              return (
                <View
                  key={item.id}
                  style={{ height: 50, margin: 2, backgroundColor: 'orange' }}
                >
                  <Text>{item.id}</Text>
                </View>
              );
            }}
            onScroll={() => {
              console.log('test:pp:onScroll:');
            }}
            onResponderEnd={() => {
              console.log('test:pp:onResponderEnd:');
              isRef.current = false;
            }}
            onMomentumScrollEnd={() => {
              console.log('test:pp:onMomentumScrollEnd:');
              isRef.current = false;
            }}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * Test the ScrollView's scrolling.
 *
 * The nested scrolling problem of ScrollView has been solved. But not perfect.
 */
export function PanResponderComponent4(): JSX.Element {
  const ref = React.useRef<ScrollView>({} as any);

  const p = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:p:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:p:move:');
      },
    })
  ).current.panHandlers;
  const pp = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('test:pp:start:');
        // ref.current.scrollResponderHandleStartShouldSetResponder = () => true;
        return true;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:pp:grant:');
      },
      onPanResponderMove: () => {
        console.log('test:pp:move:');
      },
    })
  ).current.panHandlers;

  return (
    <View style={{ width: 300, height: 400, backgroundColor: 'blue' }} {...p}>
      <View style={{ width: 200, height: 300, backgroundColor: 'red' }}>
        <View
          style={{ width: 100, height: 200, backgroundColor: 'yellow' }}
          // {...pp}
        >
          <ScrollView
            ref={ref}
            onScroll={() => {
              console.log('test:onScroll:');
              // ref.current.scrollResponderHandleScrollShouldSetResponder();
            }}
            // onStartShouldSetResponder={() => true}
            // {...pp}
          >
            <View
              style={{
                height: 800,
                width: 100,
                backgroundColor: 'orange',
              }}
              {...pp}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

/**
 * Test tap gestures.
 */
export function PanResponderComponent2(): JSX.Element {
  const p = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('test:p:grant:');
      },
      onPanResponderStart: () => {
        console.log('test:p:start:');
      },
      onPanResponderEnd: () => {
        console.log('test:p:end:');
      },
    })
  );
  const pp = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        console.log('test:pp:grant:');
      },
      onPanResponderStart: () => {
        console.log('test:pp:start:');
      },
      onPanResponderEnd: () => {
        console.log('test:pp:end:');
      },
    })
  );
  return (
    <View
      style={{ width: 300, height: 300, backgroundColor: 'blue' }}
      {...p.current.panHandlers}
    >
      <View style={{ width: 200, height: 200, backgroundColor: 'red' }}>
        <View
          style={{ width: 100, height: 100, backgroundColor: 'yellow' }}
          {...pp.current.panHandlers}
        />
      </View>
    </View>
  );
}

export default function test_pan_responder() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <View style={{ flex: 1, backgroundColor: 'green', paddingTop: 100 }}>
          <PanResponderComponent5 />
        </View>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
