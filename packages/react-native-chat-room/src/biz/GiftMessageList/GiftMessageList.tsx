import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { Queue } from '../../utils';
import {
  gGiftEffectListHeight,
  gGiftEffectListWidth,
  gItemInterval,
  gTimeoutTask,
} from './GiftMessageList.const';
import { useAddData } from './GiftMessageList.hooks';
import {
  GiftMessageListItem,
  GiftMessageListItemProps,
} from './GiftMessageList.item';
import type { GiftMessageListItemModel } from './GiftMessageList.item.hooks';
import type { GiftMessageListTask } from './types';

/**
 * The reference of the `GiftMessageList` component.
 */
export type GiftMessageListRef = {
  /**
   * Push a task to the queue.
   */
  pushTask: (task: GiftMessageListTask) => void;
};
/**
 * Properties of the `GiftMessageList` component.
 */
export type GiftMessageListProps = {
  /**
   * Whether to display the component.
   *
   * Changing the display or hiding in this way usually does not trigger the loading and unloading of components.
   */
  visible?: boolean;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The component used to render the item.
   */
  GiftEffectItemComponent?: React.ComponentType<GiftMessageListItemProps>;
};

/**
 * The GiftMessageList component provides a floating gift animation.
 *
 * @test {@link example/src/__dev__/test_gift_floating.tsx}
 *
 * @param props {@link GiftMessageListProps}
 * @param ref {@link GiftMessageListRef}
 * @returns JSX.Element
 * @example
 *
 * ```tsx
 * const ref = React.useRef<GiftMessageListRef>({} as any);
 * // ...
 * <GiftMessageList
 *   ref={ref}
 *   containerStyle={
 *     {
 *       // top: 50,
 *       // left: 100,
 *     }
 *   }
 * />
 * // ...
 * ref.current?.pushTask({
 *       model: {
 *         id: seqId('_gf').toString(),
 *         nickname: 'NickName',
 *         giftCount: 1,
 *         giftIcon: 'http://notext.png',
 *         content: 'send Agoraship too too too long',
 *       },
 *     });
 * ```
 */
export const GiftMessageList = React.forwardRef<
  GiftMessageListRef,
  GiftMessageListProps
>(function (
  props: GiftMessageListProps,
  ref?: React.ForwardedRef<GiftMessageListRef>
) {
  const { containerStyle, visible = true, GiftEffectItemComponent } = props;

  const dataRef = React.useRef<GiftMessageListItemModel[]>([]);
  const [data, setData] = React.useState<GiftMessageListItemModel[]>(
    dataRef.current
  );

  const listRef = React.useRef<FlatList<GiftMessageListItemModel>>({} as any);

  const tasks: Queue<GiftMessageListTask> = React.useRef(
    new Queue<GiftMessageListTask>()
  ).current;
  const preTask = React.useRef<GiftMessageListTask | undefined>(undefined);
  const curTask = React.useRef<GiftMessageListTask | undefined>(undefined);
  const delayClear = React.useRef<NodeJS.Timeout>();

  const { addData, clearData, scrollToEnd } = useAddData({
    dataRef: dataRef,
    setData: setData,
    ref: listRef,
  });

  const _GiftEffectItemComponent =
    GiftEffectItemComponent ?? GiftMessageListItem;

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        delayClearData();
        addData(task);
        scrollToEnd();
        preTask.current = curTask.current;
        curTask.current = undefined;
        execTask();
      }
    }
  };

  const checkData = () => {
    delayClearData();
  };

  const delayClearData = () => {
    if (delayClear.current) {
      clearTimeout(delayClear.current);
    }
    delayClear.current = setTimeout(() => {
      delayClear.current = undefined;
      if (curTask.current === undefined) {
        if (dataRef.current.length > 0) {
          clearData();
          scrollToEnd();
          checkData();
        }
      }
    }, gTimeoutTask);
  };

  const pushTask = (task: GiftMessageListTask) => {
    tasks.enqueue(task);
    execTask();
  };

  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GiftMessageListTask) => {
          pushTask(task);
        },
      };
    },
    // !!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <View
      style={[
        containerStyle,
        {
          height: gGiftEffectListHeight,
          width: gGiftEffectListWidth,
          // backgroundColor: '#ffd700',
          display: visible === false ? 'none' : 'flex',
        },
      ]}
    >
      <FlatList
        ref={listRef}
        data={data}
        renderItem={(info: ListRenderItemInfo<GiftMessageListItemModel>) => {
          return <_GiftEffectItemComponent item={info.item} />;
        }}
        keyExtractor={(item: GiftMessageListItemModel) => {
          return item.id;
        }}
        bounces={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const ItemSeparatorComponent = () => {
  return <View style={{ height: gItemInterval }} />;
};

export type GiftMessageListComponent = typeof GiftMessageList;
