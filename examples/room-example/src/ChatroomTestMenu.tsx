import * as React from 'react';
import { View } from 'react-native';

import {
  BottomSheetMenu,
  BottomSheetMenuItem,
  BottomSheetMenuProps,
  BottomSheetMenuRef,
  useColors,
  usePaletteContext,
} from './rename.room';

export type ChatroomTestMenuRef = BottomSheetMenuRef;
export type ChatroomTestMenuProps = Omit<
  BottomSheetMenuProps,
  'title' | 'initItems'
> & {
  addGlobalBroadcastTask: () => void;
  addGiftEffectTask: () => void;
  showParticipantList: () => void;
};

export const ChatroomTestMenu = React.forwardRef<
  ChatroomTestMenuRef,
  ChatroomTestMenuProps
>(function (
  props: ChatroomTestMenuProps,
  ref?: React.ForwardedRef<ChatroomTestMenuRef>
) {
  const {
    onRequestModalClose,
    addGiftEffectTask,
    showParticipantList,
    addGlobalBroadcastTask,
    ...others
  } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const menuRef = React.useRef<BottomSheetMenuRef>({} as any);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          menuRef?.current?.startShow?.();
        },
        startHide: (onFinished?) => {
          menuRef?.current?.startHide?.(onFinished);
        },
        startShowWithInit: (initItems?) => {
          menuRef?.current?.startShowWithInit?.(initItems);
        },
        getData: () => {
          return menuRef?.current?.getData?.();
        },
      };
    },
    []
  );

  const data = React.useMemo(
    () => [
      <BottomSheetMenuItem
        key={0}
        id={'1'}
        initState={'enabled'}
        text={'add globalBroadcast task'}
        onPress={addGlobalBroadcastTask}
      />,
      <BottomSheetMenuItem
        key={1}
        id={'2'}
        initState={'enabled'}
        text={'add gift list task'}
        onPress={addGiftEffectTask}
      />,
      <BottomSheetMenuItem
        key={2}
        id={'3'}
        initState={'enabled'}
        text={'show member list'}
        onPress={showParticipantList}
      />,
      <View
        key={6}
        style={{
          height: 8,
          width: '100%',
          backgroundColor: getColor('divider'),
        }}
      />,
      <BottomSheetMenuItem
        key={5}
        id={'6'}
        initState={'enabled'}
        text={'Cancel'}
        onPress={() => {
          onRequestModalClose?.();
        }}
      />,
    ],
    [
      addGiftEffectTask,
      addGlobalBroadcastTask,
      getColor,
      onRequestModalClose,
      showParticipantList,
    ]
  );
  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={() => {
        onRequestModalClose?.();
      }}
      title={'test'}
      initItems={data}
      {...others}
    />
  );
});
