import * as React from 'react';
import { Dimensions, useWindowDimensions, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useColors } from '../../hook';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import { EmojiListMemo } from '../EmojiList';
import type { EmojiIconItem } from '../types';

/**
 * Referencing Values of the `BottomSheetEmojiList` component.
 */
export type BottomSheetEmojiListRef = SlideModalRef & {
  /**
   * While displaying the component, the menu items will also be dynamically changed.
   */
  startShowWithProps: (props: BottomSheetEmojiListProps) => void;
};
/**
 * Properties of the `BottomSheetEmojiList` component.
 */
export type BottomSheetEmojiListProps = {
  /**
   * To request to close the component, you usually need to call the `startHide` method here.
   */
  onRequestModalClose: () => void;
  /**
   * emoji list.
   */
  emojiList: EmojiIconItem[];
  /**
   * The maximum height of the component.
   *
   * @default half of the entire screen.
   */
  maxHeight?: number;

  /**
   * Callback function when an emoji is selected.
   */
  onFace?: (face: string) => void;
};

/**
 * The BottomSheetEmojiList component provides menu functionality.
 */
export const BottomSheetEmojiList = React.forwardRef<
  BottomSheetEmojiListRef,
  BottomSheetEmojiListProps
>(function (
  props: BottomSheetEmojiListProps,
  ref?: React.ForwardedRef<BottomSheetEmojiListRef>
) {
  const { bottom } = useSafeAreaInsets();
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const {
    emojiList,
    updateProps,
    onRequestModalClose,
    maxHeight: propsMaxHeight,
    onFace,
  } = useGetProps(props);
  const { getColor } = useColors();
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
        startShowWithProps: (props: BottomSheetEmojiListProps) => {
          const { emojiList: emoji } = props;
          if (emoji !== emojiList) {
            isShow.current = true;
            updateProps(props);
          } else {
            isShow.current = true;
            modalRef?.current?.startShow?.();
          }
        },
      };
    },
    [emojiList, updateProps]
  );

  React.useEffect(() => {
    if (isShow.current === true) {
      modalRef?.current?.startShow?.();
    }
  }, [emojiList]);

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
        <EmojiListMemo
          containerStyle={{
            height: propsMaxHeight ?? winHeight * 0.5,
            width: Dimensions.get('window').width,
          }}
          onFace={onFace}
          emojiList={emojiList}
          isEmojiCharacter={true}
        />

        <View style={{ height: bottom }} />
      </SafeAreaView>
    </SlideModal>
  );
});

function useGetProps(props: BottomSheetEmojiListProps) {
  const { emojiList, ...others } = props;
  const [_emojiList, setEmojiList] = React.useState(emojiList);
  const _updateProps = (props: BottomSheetEmojiListProps) => {
    const { emojiList } = props;
    setEmojiList(emojiList);
  };
  return {
    emojiList: _emojiList,
    updateProps: _updateProps,
    ...others,
  };
}
