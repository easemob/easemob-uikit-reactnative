import * as React from 'react';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';

import { SlideModal } from '../Modal';
import { ContextMenuProps } from './types';
import { useContextMenu } from './useContextMenu';

export function ContextMenu(props: ContextMenuProps) {
  const { position, children, propsRef, containerStyle } = props;
  const { calculateComponentPosition } = useContextMenu(props);
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
      }),
    [
      calculateComponentPosition,
      componentHeight,
      componentWidth,
      position.x,
      position.y,
      screenHeight,
      screenWidth,
    ]
  );

  const _onLayout = React.useCallback((event: LayoutChangeEvent) => {
    setComponentHeight(event.nativeEvent.layout.height);
    setComponentWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <SlideModal
      propsRef={propsRef}
      modalAnimationType="fade"
      backgroundColor={'rgba(1,1,1, 0.2)'}
      backgroundTransparent={false}
      onRequestModalClose={() => {
        propsRef.current.startHide();
      }}
      enableSlideComponent={false}
    >
      <View
        style={[
          containerStyle,
          {
            position: 'absolute',
            top: position.y,
            left: position.x,
            bottom: undefined,
            right: undefined,
            height: componentHeight,
            width: componentWidth,
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
