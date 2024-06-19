import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { StatusType } from '../types';

type Point = {
  x: number;
  y: number;
};

export function findIntersectionPoints(parentSize: number): Point[] {
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

export type AvatarStatusProps = {
  parentSize: number;
  size?: number;
  childrenPaddingSize: number;
  scale: number;
  intersection?: Point;
  positionStyle?: 'bottomRight1' | 'bottomRight2';
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  status: string;
  AvatarStatusRender?:
    | React.FC<{
        status: StatusType;
        style?: StyleProp<ViewStyle>;
      }>
    | React.MemoExoticComponent<
        (props: {
          status: StatusType;
          style?: StyleProp<ViewStyle>;
        }) => JSX.Element
      >;
};
export function AvatarStatus(props: AvatarStatusProps) {
  const {
    parentSize,
    childrenPaddingSize,
    scale,
    intersection = findIntersectionPoints(parentSize)[0],
    positionStyle = 'bottomRight1',
    containerStyle,
    style,
    AvatarStatusRender,
    status,
  } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          position: 'absolute',
          height: parentSize / scale,
          width: parentSize / scale,
          borderRadius: parentSize / scale,
          top:
            positionStyle === 'bottomRight1'
              ? intersection!.y - parentSize / scale / 2
              : undefined,
          left:
            positionStyle === 'bottomRight1'
              ? intersection!.x - parentSize / scale / 2
              : undefined,
          bottom:
            positionStyle === 'bottomRight2' ? -childrenPaddingSize : undefined,
          right:
            positionStyle === 'bottomRight2' ? -childrenPaddingSize : undefined,
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      {AvatarStatusRender ? (
        <AvatarStatusRender
          status={status}
          style={[
            {
              backgroundColor: getColor('bg2'),
              height: parentSize / scale - childrenPaddingSize * 2,
              width: parentSize / scale - childrenPaddingSize * 2,
              borderRadius: parentSize / scale - childrenPaddingSize * 2,
            },
            style,
          ]}
        />
      ) : (
        <View
          style={[
            {
              backgroundColor: getColor('bg2'),
              height: parentSize / scale - childrenPaddingSize * 2,
              width: parentSize / scale - childrenPaddingSize * 2,
              borderRadius: parentSize / scale - childrenPaddingSize * 2,
            },
            style,
          ]}
        />
      )}
    </View>
  );
}
