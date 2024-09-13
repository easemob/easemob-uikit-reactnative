import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ErrorCode, UIKitError } from '../../error';
import { getElement, useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import { SingleLineText } from '../../ui/Text';
import { MessageMenuProps, MessageMenuRef } from '../types';
import { gMaxItemCount } from './BottomSheetMenu.const';
import { useGetProps } from './BottomSheetMenu.hooks';

/**
 * The BottomSheetMenu component provides menu functionality.
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/192a6e98cf2f168dd3a5e0e5a306a6762cf5e0d6/example/src/__dev__/test_bottom_sheet_menu.tsx}
 *
 * @example
 *
 * ```tsx
 * const ref = React.useRef<MessageMenuRef>({} as any);
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
  MessageMenuRef,
  MessageMenuProps
>(function (props: MessageMenuProps, ref?: React.ForwardedRef<MessageMenuRef>) {
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
  const { items, updateItems, header, headerProps, updateProps } =
    useGetProps(props);
  const count = header ? 5 : 6;
  const { getColor } = useColors({
    bg3: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
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
        startShowWithProps: (props: MessageMenuProps) => {
          const { initItems } = props;
          if (initItems !== items && initItems) {
            isShow.current = true;
            updateProps(props);
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
    [items, updateProps, updateItems]
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
          backgroundColor: getColor('bg'),
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
            backgroundColor: getColor('bg3'),
            borderRadius: 2.5,
          }}
        /> */}

        {title ? (
          <View style={{ paddingVertical: 13, paddingHorizontal: 16 }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'body'}
              style={{
                color: getColor('disable'),
              }}
            >
              {title}
            </SingleLineText>
          </View>
        ) : null}

        {header ? getElement(header, headerProps) : null}

        {items.length > count ? (
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
