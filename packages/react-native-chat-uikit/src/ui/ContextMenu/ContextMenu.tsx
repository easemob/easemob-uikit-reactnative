import * as React from 'react';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';

import { SlideModal } from '../Modal';
import { ContextMenuProps } from './types';
import { useContextMenu } from './useContextMenu';

export function ContextMenu(props: ContextMenuProps) {
  const {
    position = { x: 0, y: 0 },
    children,
    propsRef,
    containerStyle,
    autoCalculateSize = true,
    onRequestModalClose,
    noCoverageArea,
    onLayout,
    policy,
    padding = 0,
  } = props;
  const { calculateComponentPosition } = useContextMenu();
  const screenWidth = React.useRef(Dimensions.get('window').width).current;
  const screenHeight = React.useRef(Dimensions.get('window').height).current;
  const [componentHeight, setComponentHeight] = React.useState<
    number | undefined
  >(undefined);
  const [componentWidth, setComponentWidth] = React.useState<
    number | undefined
  >(undefined);

  const calculateResult = React.useMemo(
    () =>
      calculateComponentPosition({
        pressedX: position.x,
        pressedY: position.y,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        componentWidth: componentWidth ?? 0,
        componentHeight: componentHeight ?? 0,
        noCoverageArea: noCoverageArea,
        policy: policy,
        padding: padding,
      }),
    [
      calculateComponentPosition,
      componentHeight,
      componentWidth,
      noCoverageArea,
      padding,
      policy,
      position.x,
      position.y,
      screenHeight,
      screenWidth,
    ]
  );

  const _onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);
      if (autoCalculateSize === false) {
        return;
      }
      setComponentHeight(event.nativeEvent.layout.height);
      setComponentWidth(event.nativeEvent.layout.width);
    },
    [autoCalculateSize, onLayout]
  );

  return (
    <SlideModal
      propsRef={propsRef}
      modalAnimationType="fade"
      backgroundTransparent={true}
      onRequestModalClose={onRequestModalClose}
      enableSlideComponent={false}
    >
      <View
        style={[
          containerStyle,
          {
            flex: 1,
            position: 'absolute',
            top: position.y,
            left: position.x,
            bottom: undefined,
            right: undefined,
            // maxHeight: componentHeight,
            // maxWidth: componentWidth,
            ...calculateResult,
          },
        ]}
        onLayout={_onLayout}
      >
        {children}
      </View>
    </SlideModal>
  );
}
