import * as React from 'react';
import { View } from 'react-native';
import { Container } from 'react-native-chat-uikit';

type Point = {
  x: number;
  y: number;
};

function findIntersectionPoints(parentSize: number): Point[] {
  const sqrt2 = Math.sqrt(2);
  const halfA = parentSize / 2;

  const offset = (parentSize / 2) * (sqrt2 / 2);

  const intersection1: Point = {
    x: halfA + offset,
    y: halfA + offset,
  };

  const intersection2: Point = {
    x: halfA - offset,
    y: halfA - offset,
  };

  return [intersection1, intersection2];
}

function Status(props: {
  parentSize: number;
  size: number;
  childrenPaddingSize: number;
  scale: number;
  intersections: Point[];
  positionStyle?: 'bottomRight1' | 'bottomRight2';
}) {
  const {
    parentSize,
    childrenPaddingSize,
    scale,
    intersections,
    positionStyle = 'bottomRight1',
  } = props;
  console.log(
    'test:zuoyu:Status',
    parentSize,
    scale,
    intersections,
    positionStyle
  );
  return (
    <View
      style={{
        backgroundColor: '#7fff00',
        position: 'absolute',
        height: parentSize / scale,
        width: parentSize / scale,
        borderRadius: parentSize / scale,
        top:
          positionStyle === 'bottomRight1'
            ? intersections[0]!.y - parentSize / scale / 2
            : undefined,
        left:
          positionStyle === 'bottomRight1'
            ? intersections[0]!.x - parentSize / scale / 2
            : undefined,
        bottom:
          positionStyle === 'bottomRight2' ? -childrenPaddingSize : undefined,
        right:
          positionStyle === 'bottomRight2' ? -childrenPaddingSize : undefined,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: '#ff00ff',
          height: parentSize / scale - childrenPaddingSize * 2,
          width: parentSize / scale - childrenPaddingSize * 2,
          borderRadius: parentSize / scale - childrenPaddingSize * 2,
        }}
      />
    </View>
  );
}

export function TestMath() {
  // 示例调用
  const parentSize = 100;
  const size = 26;
  const scale = parentSize / size;
  const intersections = findIntersectionPoints(parentSize);
  console.log(intersections); // 输出两个交点的坐标
  return (
    <View
      style={{
        backgroundColor: 'orange',
        height: 100,
        width: 100,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: 'yellow',
          height: 100,
          width: 100,
          borderRadius: 100,
        }}
      />
      <Status
        parentSize={parentSize}
        size={size}
        scale={scale}
        intersections={intersections}
        positionStyle={'bottomRight1'}
        childrenPaddingSize={4}
      />
    </View>
  );
}

export default function TestUtils() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <View style={{ height: 100 }} />
      <TestMath />
    </Container>
  );
}
