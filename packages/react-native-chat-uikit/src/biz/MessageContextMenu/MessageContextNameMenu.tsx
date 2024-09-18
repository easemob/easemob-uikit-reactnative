import * as React from 'react';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';

import { getElement, useColors } from '../../hook';
import { useThemeContext } from '../../theme';
import {
  ComponentArea,
  ContextMenu,
  useContextMenu,
} from '../../ui/ContextMenu';
import { Icon } from '../../ui/Image';
import { SlideModalRef } from '../../ui/Modal';
import { PressableHighlight } from '../../ui/Pressable';
import { SingleLineText } from '../../ui/Text';
import { TriangleView } from '../../ui/TriangleView';
import { useMessageNameMenu } from '../hooks';
import { InitMenuItemsType, MessageLayoutType } from '../types';
import { ContextNameMenuProps, ContextNameMenuRef } from '../types';

/**
 * The MessageContextNameMenu component provides menu functionality.
 *
 * Compared with `BottomSheetMenu`, it is simpler to use, you only need to enter a text array.
 *
 */
export const MessageContextNameMenu = React.forwardRef<
  ContextNameMenuRef,
  ContextNameMenuProps
>(function (
  props: ContextNameMenuProps,
  ref?: React.ForwardedRef<ContextNameMenuRef>
) {
  const { onRequestModalClose } = props;
  const { getColor } = useColors();
  const { shadow } = useThemeContext();
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const isShowRef = React.useRef<boolean>(false);
  const stateProps = useMessageNameMenu(props);
  const {
    updateItems,
    updateProps,
    items,
    header,
    headerProps,
    suggestedPosition,
    noCoverageArea,
  } = stateProps;
  const {
    onLayout,
    viewRef,
    calculateNoCoverageAreaMiddlePosition,
    componentHeight,
    componentWidth,
    screenHeight,
    screenWidth,
    triangleOffset,
    componentPageX,
  } = useMessageContextNameMenu(props);
  const triangleViewWidth = React.useRef(8).current;

  const trianglePosition = React.useMemo(() => {
    const first = calculateNoCoverageAreaMiddlePosition({
      pressedX: suggestedPosition?.x ?? 0,
      pressedY: suggestedPosition?.y ?? 0,
      screenHeight: screenHeight,
      screenWidth: screenWidth,
      componentHeight: componentHeight ?? 0,
      componentWidth: componentWidth ?? 0,
      noCoverageArea: noCoverageArea,
    });

    if (first.x) {
      if (
        first.spatialOrientation === 'center-down' ||
        first.spatialOrientation === 'center-up'
      ) {
        first.x -= componentPageX + triangleViewWidth / 2;
      } else {
        first.x += triangleOffset - triangleViewWidth / 2;
      }
    }

    return first;
  }, [
    calculateNoCoverageAreaMiddlePosition,
    componentHeight,
    componentPageX,
    componentWidth,
    noCoverageArea,
    screenHeight,
    screenWidth,
    suggestedPosition?.x,
    suggestedPosition?.y,
    triangleOffset,
    triangleViewWidth,
  ]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          isShowRef.current = true;
          modalRef?.current?.startShow?.();
        },
        startHide: (onFinished?: () => void) => {
          modalRef?.current?.startHide?.(onFinished);
          isShowRef.current = false;
        },
        startShowWithInit: (initItems: InitMenuItemsType[], _?: any) => {
          isShowRef.current = true;
          updateItems(initItems);
        },
        startShowWithProps: (props: ContextNameMenuProps) => {
          isShowRef.current = true;
          updateProps(props);
        },
        getData: () => {
          return undefined;
        },
      };
    },
    [updateItems, updateProps]
  );

  React.useEffect(() => {
    if (isShowRef.current) {
      modalRef?.current?.startShow?.();
    }
  }, [items]);

  return (
    <ContextMenu
      propsRef={modalRef}
      position={suggestedPosition}
      onRequestModalClose={onRequestModalClose}
      noCoverageArea={noCoverageArea}
      onLayout={React.useCallback(
        (event: LayoutChangeEvent) => {
          onLayout(event, noCoverageArea);
        },
        [noCoverageArea, onLayout]
      )}
    >
      <View
        style={[
          shadow.style.middle[0],
          {
            backgroundColor: 'transparent',
            borderRadius: 4,
          },
        ]}
      >
        <View
          ref={viewRef}
          style={[
            shadow.style.middle[1],
            {
              backgroundColor: 'transparent',
              borderRadius: 4,
            },
          ]}
        >
          {trianglePosition.spatialOrientation === 'down' ||
          trianglePosition.spatialOrientation === 'center-down' ? (
            <View
              style={{
                alignItems:
                  trianglePosition.messageLayoutType === 'left' &&
                  trianglePosition.x
                    ? 'flex-start'
                    : trianglePosition.messageLayoutType === 'right' &&
                      trianglePosition.x
                    ? 'flex-end'
                    : 'center',
                paddingRight:
                  trianglePosition.messageLayoutType === 'left'
                    ? undefined
                    : trianglePosition.x,
                paddingLeft:
                  trianglePosition.messageLayoutType === 'right'
                    ? undefined
                    : trianglePosition.x,
              }}
            >
              <TriangleView />
            </View>
          ) : null}

          <View style={{ backgroundColor: getColor('bg'), borderRadius: 4 }}>
            <ItemsRender {...props} initItems={items} />
            {header ? (
              <>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: getColor('divider'),
                    marginHorizontal: 21,
                  }}
                />
                <View style={{ marginVertical: 12 }}>
                  {getElement(header, headerProps)}
                </View>
              </>
            ) : null}
          </View>

          {trianglePosition.spatialOrientation === 'up' ||
          trianglePosition.spatialOrientation === 'center-up' ? (
            <View
              style={{
                alignItems:
                  trianglePosition.messageLayoutType === 'left' &&
                  trianglePosition.x
                    ? 'flex-start'
                    : trianglePosition.messageLayoutType === 'right' &&
                      trianglePosition.x
                    ? 'flex-end'
                    : 'center',
                paddingRight:
                  trianglePosition.messageLayoutType === 'left'
                    ? undefined
                    : trianglePosition.messageLayoutType === 'right'
                    ? trianglePosition.x
                    : undefined,
                paddingLeft:
                  trianglePosition.messageLayoutType === 'left'
                    ? trianglePosition.x
                    : trianglePosition.messageLayoutType === 'right'
                    ? undefined
                    : undefined,
              }}
            >
              <TriangleView rotate={'180deg'} />
            </View>
          ) : null}
        </View>
      </View>
    </ContextMenu>
  );
});

const ItemsRender = (props: ContextNameMenuProps) => {
  const { initItems, maxRowCount, unitCountPerRow } = props;
  let screenWidth = Dimensions.get('window').width;
  screenWidth = screenWidth >= 392 ? 392 - 42 : 392 - 32;
  const itemWidth = 68;
  const itemHeight = 58;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: screenWidth,
        marginHorizontal: 4,
        marginVertical: 12,
      }}
    >
      {initItems
        ? initItems.map((item, index) => {
            if (index >= maxRowCount * unitCountPerRow) {
              return null;
            }
            return (
              <PressableHighlight
                key={index}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal:
                    (screenWidth -
                      itemWidth * Math.floor(screenWidth / itemWidth)) /
                    (Math.floor(screenWidth / itemWidth) * 2),
                  marginBottom: index !== initItems.length ? 8 : 0,
                }}
                onPress={() => item.onClicked?.(item.name)}
              >
                <Icon
                  name={item.icon ?? 'star_fill'}
                  style={{ width: 32, height: 32 }}
                />
                <SingleLineText paletteType={'label'} textType={'small'}>
                  {item.name}
                </SingleLineText>
              </PressableHighlight>
            );
          })
        : ([] as JSX.Element[])}
    </View>
  );
};

function useMessageContextNameMenu(props: ContextNameMenuProps) {
  const {} = props;
  const viewRef = React.useRef<View>(null);
  const screenWidth = React.useRef(Dimensions.get('window').width).current;
  const screenHeight = React.useRef(Dimensions.get('window').height).current;
  const [componentHeight, setComponentHeight] = React.useState<
    number | undefined
  >(undefined);
  const [componentWidth, setComponentWidth] = React.useState<
    number | undefined
  >(undefined);
  const [componentPageX, setComponentPageX] = React.useState<number>(0);

  const [triangleOffset, setTriangleOffset] = React.useState<number>(0);

  const { convertComponentCoordinate } = useContextMenu();
  const calculateNoCoverageAreaMiddlePosition = React.useCallback(
    (params: {
      pressedX: number;
      pressedY: number;
      screenWidth: number;
      screenHeight: number;
      componentWidth: number;
      componentHeight: number;
      noCoverageArea?: ComponentArea;
    }) => {
      const {
        pressedX,
        pressedY,
        screenHeight,
        screenWidth,
        componentHeight,
        componentWidth,
        noCoverageArea,
      } = params;
      let relativePosition: {
        x?: number;
        y?: number;
        spatialOrientation:
          | 'up'
          | 'down'
          | 'left'
          | 'right'
          | 'center'
          | 'center-up'
          | 'center-down';
        messageLayoutType?: MessageLayoutType;
      } = { spatialOrientation: 'down', messageLayoutType: 'left' };
      if (noCoverageArea) {
        const c = convertComponentCoordinate(noCoverageArea);
        const left = c.leftTop.x;
        const top = c.leftTop.y;
        const right = c.rightBottom.x;
        const bottom = c.rightBottom.y;

        if (left < screenWidth - right) {
          relativePosition.messageLayoutType = 'left';
        } else if (left > screenWidth - right) {
          relativePosition.messageLayoutType = 'right';
        } else {
          relativePosition.messageLayoutType = 'middle';
        }

        if (
          top >= componentHeight ||
          screenHeight - bottom >= componentHeight
        ) {
          const middleX = (left + right) / 2;
          const s = Math.max(left, Math.min(middleX, right));
          relativePosition.x = s - left;
          relativePosition.y = undefined;
          relativePosition.spatialOrientation =
            top >= componentHeight ? 'up' : 'down';
        } else if (
          left >= componentWidth ||
          screenWidth - right >= componentWidth
        ) {
          const middleY = (top + bottom) / 2;
          const s = Math.max(top, Math.min(middleY, bottom));
          relativePosition.y = s - top;
          relativePosition.x = undefined;
          relativePosition.spatialOrientation =
            left >= componentWidth ? 'left' : 'right';
        } else {
          relativePosition.spatialOrientation = 'center';
          relativePosition.x =
            relativePosition.messageLayoutType === 'left'
              ? pressedX
              : screenWidth - pressedX;
          relativePosition.y = pressedY - top;

          if (pressedY + componentHeight > screenHeight) {
            if (pressedY > componentHeight) {
              relativePosition.spatialOrientation = 'center-up';
            }
          } else {
            relativePosition.spatialOrientation = 'center-down';
          }
        }
      }
      return relativePosition;
    },
    [convertComponentCoordinate]
  );

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent, noCoverageArea?: ComponentArea) => {
      setComponentHeight(event.nativeEvent.layout.height);
      setComponentWidth(event.nativeEvent.layout.width);
      viewRef.current?.measure((_, ____, width, __, pageX, ___) => {
        setComponentPageX(pageX);
        if (noCoverageArea) {
          const area = convertComponentCoordinate(noCoverageArea);

          const leftOffset = Math.abs(pageX - area.leftTop.x);
          const rightOffset = Math.abs(pageX + width - area.rightBottom.x);

          setTriangleOffset(Math.min(leftOffset, rightOffset));
        }
      });
    },
    [convertComponentCoordinate]
  );

  return {
    calculateNoCoverageAreaMiddlePosition,
    componentHeight,
    componentWidth,
    screenWidth,
    screenHeight,
    triangleOffset,
    onLayout,
    viewRef,
    componentPageX,
  };
}
