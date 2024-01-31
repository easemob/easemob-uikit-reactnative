import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import { Text } from '../../ui/Text';
import { gMaxItemCount } from './BottomSheetMenu.const';
import { useGetItems } from './BottomSheetMenu.hooks';

/**
 * Referencing Values of the `BottomSheetMenu` component.
 */
export type BottomSheetMenuRef = SlideModalRef & {
  /**
   * While displaying the component, the menu items will also be dynamically changed.
   */
  startShowWithInit: (initItems: React.ReactElement[], others?: any) => void;

  /**
   * Get the data of the component.
   */
  getData: () => any;
};
/**
 * Properties of the `BottomSheetMenu` component.
 */
export type BottomSheetMenuProps = {
  /**
   * To request to close the component, you usually need to call the `startHide` method here.
   */
  onRequestModalClose: () => void;
  /**
   * If no title is specified, it will not be displayed.
   */
  title?: string;
  /**
   * The maximum number should not exceed 6.
   * If it is not set here, it can be set dynamically when calling `startShowWithInit`.
   */
  initItems?: React.ReactElement[];
  /**
   * The maximum height of the component.
   *
   * @default half of the entire screen.
   */
  maxHeight?: number;
};

/**
 * The BottomSheetMenu component provides menu functionality.
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/192a6e98cf2f168dd3a5e0e5a306a6762cf5e0d6/example/src/__dev__/test_bottom_sheet_menu.tsx}
 *
 * @example
 *
 * ```tsx
 * const ref = React.useRef<BottomSheetMenuRef>({} as any);
 * // ...
 *  <BottomSheetMenu
 *   ref={ref}
 *   onRequestModalClose={() => {
 *     ref.current.startHide();
 *   }}
 *   title={
 *     'Nickname: Sei la cosa più bella che mia sia mai capitato non so stare senza te.'
 *   }
 *   initItems={data}
 * />
 * ```
 */
export const BottomSheetMenu = React.forwardRef<
  BottomSheetMenuRef,
  BottomSheetMenuProps
>(function (
  props: BottomSheetMenuProps,
  ref?: React.ForwardedRef<BottomSheetMenuRef>
) {
  const {
    onRequestModalClose,
    initItems,
    title,
    maxHeight: propsMaxHeight,
  } = props;
  const { colors } = usePaletteContext();
  const { bottom } = useSafeAreaInsets();
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const othersRef = React.useRef();
  const { items, updateItems } = useGetItems(initItems);
  const { getColor } = useColors({
    bg1: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
    c1: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const isShow = React.useRef(false);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startHide: (onFinished?: () => void) => {
          isShow.current = false;
          modalRef?.current?.startHide?.(onFinished);
        },
        startShow: () => {
          isShow.current = true;
          modalRef?.current?.startShow?.();
        },
        startShowWithInit: (initItems: React.ReactElement[], others?: any) => {
          othersRef.current = others;
          if (initItems !== items) {
            isShow.current = true;
            updateItems(initItems);
          } else {
            isShow.current = true;
            modalRef?.current?.startShow?.();
          }
        },
        getData: () => {
          return othersRef.current;
        },
      };
    },
    [items, updateItems]
  );

  React.useEffect(() => {
    if (isShow.current === true) {
      modalRef?.current?.startShow?.();
    }
  }, [items]);

  if (initItems && initItems.length > gMaxItemCount) {
    throw new UIKitError({ code: ErrorCode.max_count });
  }

  return (
    <SlideModal
      propsRef={modalRef}
      modalAnimationType={'slide'}
      onRequestModalClose={onRequestModalClose}
    >
      <SafeAreaView
        style={{
          // height: 56 * 6 + 36 + 80,
          backgroundColor: getColor('bg1'),
          alignItems: 'center',
          width: '100%',
          // borderTopLeftRadius: 16,
          // borderTopRightRadius: 16,
        }}
      >
        {/* <View
          style={{
            width: 36,
            height: 5,
            marginVertical: 6,
            backgroundColor: getColor('bg2'),
            borderRadius: 2.5,
          }}
        /> */}

        {title ? (
          <View style={{ paddingVertical: 13, paddingHorizontal: 16 }}>
            <Text
              textType={'medium'}
              paletteType={'body'}
              style={{
                color: getColor('c1'),
              }}
            >
              {title}
            </Text>
          </View>
        ) : null}

        {items.length > 6 ? (
          <ScrollView
            style={{
              maxHeight: propsMaxHeight ?? winHeight * 0.5,
              width: '100%',
            }}
            bounces={false}
          >
            <View>{items}</View>
          </ScrollView>
        ) : (
          items
        )}

        <View style={{ height: bottom }} />
      </SafeAreaView>
    </SlideModal>
  );
});
