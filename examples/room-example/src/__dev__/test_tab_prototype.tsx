import * as React from 'react';
import {
  Animated,
  ScrollView,
  ScrollViewProps,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

type TabBodyItemProps = ScrollViewProps;
export function TabBodyItem(props: TabBodyItemProps) {
  const { style, children, ...others } = props;
  const { width } = useWindowDimensions();
  return (
    <ScrollView style={[{ width: width }, style]} {...others}>
      {children}
    </ScrollView>
  );
}

type TabBodyRef = {
  scrollTo: (index: number) => void;
};
type TabBodyProps = Omit<
  ScrollViewProps,
  'pagingEnabled' | 'showsHorizontalScrollIndicator' | 'bounces' | 'horizontal'
> & {
  propsRef: React.RefObject<TabBodyRef>;
};
export function TabBody(props: TabBodyProps) {
  const { style, children, propsRef, ...others } = props;
  const ref = React.useRef<ScrollView>({} as any);
  const { width } = useWindowDimensions();
  if (propsRef.current) {
    propsRef.current.scrollTo = (index: number) => {
      ref.current.scrollTo({ x: index * width });
    };
  }
  return (
    <ScrollView
      ref={ref}
      style={[style]}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      {...others}
    >
      {children}
    </ScrollView>
  );
}

const calculateLeft = (params: {
  width: number;
  count: number;
  index: number;
  indicatorWidth: number;
}) => {
  const { width, count, index, indicatorWidth } = params;
  const unitWidth = width / count;
  return unitWidth / 2 - indicatorWidth / 2 + unitWidth * index;
};

const calculateIndex = (params: { width: number; contentOffsetX: number }) => {
  const { width, contentOffsetX } = params;
  return Math.floor(contentOffsetX / width);
  // return Math.ceil(contentOffsetX / width);
  // return Math.round(contentOffsetX / width);
};

const useTabHeaderAnimation = (params: { unitWidth: number; left: number }) => {
  const { unitWidth, left: leftValue } = params;
  const left = React.useRef(new Animated.Value(leftValue)).current;

  const createAnimated = (type: 'r' | 'l', count?: number) => {
    //@ts-ignore
    const cur = left.__getValue();
    const c = count ?? 1;
    const config = { duration: 250, useNativeDriver: false };
    return Animated.timing(left, {
      toValue: type === 'r' ? cur + unitWidth * c : cur - unitWidth * c,
      ...config,
    }).start;
  };

  return {
    left,
    toRight: createAnimated('r'),
    toLeft: createAnimated('l'),
    toNext: createAnimated,
  };
};

type TabHeaderRef = {
  toLeft: (count?: number) => void;
  toRight: (count?: number) => void;
};
type TabHeaderProps = {
  propRef: React.RefObject<TabHeaderRef>;
  onClicked?: (index: number) => void;
};
export function TabHeader(props: TabHeaderProps) {
  const { propRef, onClicked } = props;
  const { width } = useWindowDimensions();
  const indicatorWidth = 28;
  const { left, toNext } = useTabHeaderAnimation({
    unitWidth: width / 3,
    left: calculateLeft({
      width: width,
      count: 3,
      index: 0,
      indicatorWidth: indicatorWidth,
    }),
  });

  if (propRef.current) {
    propRef.current.toLeft = (count?: number) => {
      // toLeft();
      toNext('l', count)();
    };
    propRef.current.toRight = (count?: number) => {
      // toRight();
      toNext('r', count)();
    };
  }

  return (
    <View
      style={{ width: width, height: 50, margin: 10, backgroundColor: 'green' }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{ height: 40, width: 40, backgroundColor: 'yellow' }}
          onPress={() => {
            onClicked?.(0);
          }}
        >
          <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 40, width: 40, backgroundColor: 'yellow' }}
          onPress={() => {
            onClicked?.(1);
          }}
        >
          <Text>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 40, width: 40, backgroundColor: 'yellow' }}
          onPress={() => {
            onClicked?.(2);
          }}
        >
          <Text>3</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          width: indicatorWidth,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'blue',
          bottom: 0,
          left: left,
        }}
      />
    </View>
  );
}

export function TestTab() {
  const { width } = useWindowDimensions();
  const headerRef = React.useRef<TabHeaderRef>({} as any);
  const bodyRef = React.useRef<TabBodyRef>({} as any);
  const preIndex = React.useRef(0);
  const all = 3;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TabHeader
        propRef={headerRef}
        onClicked={(index: number) => {
          bodyRef.current?.scrollTo(index);
        }}
      />
      <View
        style={{
          backgroundColor: 'green',
          height: 500,
        }}
      >
        <TabBody
          propsRef={bodyRef}
          onMomentumScrollEnd={(e) => {
            const index = calculateIndex({
              width,
              contentOffsetX: e.nativeEvent.contentOffset.x,
            });
            const current = index;
            const pre = preIndex.current;
            const count = Math.abs(current - pre);
            preIndex.current = current;
            if (current > pre) {
              if (current < all) {
                headerRef.current?.toRight(count);
              }
            } else if (current < pre) {
              if (current >= 0) {
                headerRef.current?.toLeft(count);
              }
            }
          }}
          onLayout={() => {}}
        >
          <TabBodyItem style={{ backgroundColor: 'blue' }}>
            <View style={{ height: 40, backgroundColor: 'red', margin: 15 }} />
          </TabBodyItem>
          <TabBodyItem style={{ backgroundColor: 'orange' }}>
            <View
              style={{ height: 40, backgroundColor: 'yellow', margin: 15 }}
            />
          </TabBodyItem>
          <TabBodyItem style={{ backgroundColor: 'yellow' }}>
            <View style={{ height: 40, backgroundColor: 'gray', margin: 15 }} />
          </TabBodyItem>
        </TabBody>
      </View>
    </View>
  );
}

export default function test_tab_prototype() {
  return <TestTab />;
}
