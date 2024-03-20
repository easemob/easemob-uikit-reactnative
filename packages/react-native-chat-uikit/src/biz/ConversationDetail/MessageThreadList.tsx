import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';
import type {
  ChatMessage,
  ChatMessageThread,
  ChatMessageThreadEvent,
} from 'react-native-chat-sdk';

import {
  getMessageSnapshot,
  MessageServiceListener,
  useChatContext,
} from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { useFlatList } from '../List';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { TopNavigationBar } from '../TopNavigationBar';
import { gRequestMaxThreadCount } from './const';
import type {
  MessageThreadListItemProps,
  MessageThreadListProps,
  MessageThreadListRef,
} from './types';

/**
 * Message Thread List Component.
 */
export const MessageThreadList = React.forwardRef<
  MessageThreadListRef,
  MessageThreadListProps
>(function (
  props: MessageThreadListProps,
  ref?: React.ForwardedRef<MessageThreadListRef>
) {
  const FlatList = React.useMemo(
    () => FlatListFactory<MessageThreadListItemProps>(),
    []
  );
  const {
    containerStyle,
    onClickedItem,
    navigationBarVisible,
    customNavigationBar,
    onBack,
    parentId,
  } = props;
  const { data, onMore, reachedThreshold, bounces, listState, threadCount } =
    useMessageThreadList(props, ref);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    text2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          flexGrow: 1,
          // flexShrink: 1,
          // flex: 1,
        },
        containerStyle,
      ]}
    >
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={onBack}
              >
                <Icon
                  name={'chevron_left'}
                  style={{ width: 24, height: 24, tintColor: getColor('text') }}
                />
                <View style={{ flexDirection: 'column' }}>
                  <SingleLineText
                    paletteType={'title'}
                    textType={'medium'}
                    style={{ color: getColor('text') }}
                  >
                    {tr('_uikit_thread_list', threadCount)}
                  </SingleLineText>
                  <SingleLineText
                    paletteType={'body'}
                    textType={'extraSmall'}
                    style={{ color: getColor('text2') }}
                  >
                    {`#${parentId}`}
                  </SingleLineText>
                </View>
              </Pressable>
            }
            Right={<View style={{ width: 32, height: 32 }} />}
          />
        )
      ) : null}

      <View
        style={{
          // flexGrow: 1,
          // flexShrink: 1,
          flex: 1,
          // maxListHeight: '80%',
          // height: 1,
          // maxHeight: maxListHeight,
          // maxHeight: 400,
          // backgroundColor: 'red',
        }}
      >
        <FlatList
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          renderItem={(
            info: ListRenderItemInfo<MessageThreadListItemProps>
          ) => {
            const { item } = info;
            return <ListItemRenderMemo {...item} onClicked={onClickedItem} />;
          }}
          keyExtractor={(item: MessageThreadListItemProps) => {
            return item.model.id;
          }}
          onEndReached={onMore}
          onEndReachedThreshold={reachedThreshold}
          bounces={bounces}
          // !!! This effect does not work well when inserting the first element without scrolling.
          // maintainVisibleContentPosition={{
          //   minIndexForVisible: 0,
          //   autoscrollToTopThreshold: 10,
          // }}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder
                onClicked={() => {
                  // todo:
                }}
              />
            ) : null
          }
          ListLoadingComponent={
            listState === 'loading' ? <LoadingPlaceholder /> : null
          }
        />
      </View>
    </View>
  );
});

export const MessageThreadListMemo = React.memo(MessageThreadList);

function useMessageThreadList(
  props: MessageThreadListProps,
  ref?: React.ForwardedRef<MessageThreadListRef>
) {
  const { testMode, parentId } = props;
  const flatListProps = useFlatList<MessageThreadListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
    enableMore: true,
  });
  const { dataRef, setData } = flatListProps;
  const [reachedThreshold] = React.useState(0.5);
  const hasNoMoreRef = React.useRef(false);
  const currentCursorRef = React.useRef<string>('');
  const bounces = React.useRef(true).current;
  const im = useChatContext();
  const [threadCount, setThreadCount] = React.useState(0);

  const removeDuplicateData = React.useCallback(
    (list: MessageThreadListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.model.id === item.model.id)
      );
      return uniqueList;
    },
    []
  );

  const refreshToUI = React.useCallback(
    (list: MessageThreadListItemProps[]) => {
      dataRef.current = removeDuplicateData(list);
      setData([...dataRef.current]);
    },
    [dataRef, removeDuplicateData, setData]
  );

  const onAddDataToUI = React.useCallback(
    (thread: ChatMessageThread) => {
      dataRef.current.push({
        model: {
          id: thread.threadId,
          count: thread.msgCount,
          thread: thread,
          title: thread.threadName,
        },
      });
    },
    [dataRef]
  );

  const onUpdateDataToUI = React.useCallback(
    (thread: ChatMessageThread) => {
      for (const item of dataRef.current) {
        if (thread.threadId === item.model.id) {
          item.model.thread = { ...thread };
          item.model.title = thread.threadName;
          item.model = { ...item.model };
          break;
        }
      }
    },
    [dataRef]
  );

  const onRemoveDataToUI = React.useCallback(
    (thread: ChatMessageThread) => {
      const index = dataRef.current.findIndex((item) => {
        return thread.threadId === item.model.id;
      });
      if (index >= 0) {
        dataRef.current.splice(index, 1);
      }
    },
    [dataRef]
  );

  const requestMore = React.useCallback(() => {
    im.fetchThreadsFromGroup({
      parentId,
      cursor: currentCursorRef.current,
      pageSize: gRequestMaxThreadCount,
      onResult: (res) => {
        if (res.isOk && res.value?.list) {
          const list = res.value.list;
          if (list.length < gRequestMaxThreadCount) {
            hasNoMoreRef.current = true;
          }
          currentCursorRef.current = res.value.cursor;
          const ids = [] as string[];
          res.value.list.forEach((item) => {
            ids.push(item.threadId);
            onAddDataToUI(item);
          });
          refreshToUI(dataRef.current);
          setThreadCount(dataRef.current.length);

          im.fetchThreadsLastMessage({
            threadId: ids,
            onResult: (res) => {
              if (res.isOk && res.value) {
                const list = res.value;
                dataRef.current.forEach((item) => {
                  const lastMessage = list.get(item.model.id);
                  if (lastMessage) {
                    item.model.thread.lastMessage = {
                      ...lastMessage,
                    } as ChatMessage;
                  }
                });
                refreshToUI(dataRef.current);
              }
            },
          });
        }
      },
    });
  }, [dataRef, im, onAddDataToUI, parentId, refreshToUI]);

  const _onMore = React.useCallback(() => {
    if (hasNoMoreRef.current === true) {
      return;
    }
    if (dataRef.current.length < 10) {
      return;
    }
    requestMore();
  }, [dataRef, requestMore]);

  React.useEffect(() => {
    currentCursorRef.current = '';
    requestMore();
  }, [requestMore]);

  React.useEffect(() => {
    const listener = {
      onChatMessageThreadCreated: (event: ChatMessageThreadEvent) => {
        onAddDataToUI(event.thread);
        refreshToUI(dataRef.current);
      },
      onChatMessageThreadUpdated: (event: ChatMessageThreadEvent) => {
        onUpdateDataToUI(event.thread);
        refreshToUI(dataRef.current);
      },
      onChatMessageThreadDestroyed: (event: ChatMessageThreadEvent) => {
        onRemoveDataToUI(event.thread);
        refreshToUI(dataRef.current);
      },
      onChatMessageThreadUserRemoved: (_event: ChatMessageThreadEvent) => {},
    } as MessageServiceListener;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [
    dataRef,
    im,
    onAddDataToUI,
    onRemoveDataToUI,
    onUpdateDataToUI,
    refreshToUI,
  ]);

  React.useImperativeHandle(ref, () => ({}));
  return {
    ...flatListProps,
    reachedThreshold,
    onMore: _onMore,
    bounces,
    threadCount,
  };
}

function ListItemRender(props: MessageThreadListItemProps) {
  const { model, onClicked } = props;
  const { title, thread } = model;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    count: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });

  const _onClicked = React.useCallback(() => {
    onClicked?.(model);
  }, [model, onClicked]);

  return (
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={_onClicked}
    >
      <View
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'column', width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              paletteType={'title'}
              textType={'small'}
              style={{ color: getColor('t1') }}
            >
              {title}
            </SingleLineText>
            <View style={{ flexGrow: 1 }} />
            {/* <SingleLineText
              paletteType={'title'}
              textType={'small'}
              style={{ color: getColor('count') }}
            >
              {count > 99 ? '99+' : count}
            </SingleLineText> */}
            <Icon
              name={'chevron_right'}
              style={{ width: 15, height: 15, tintColor: getColor('count') }}
            />
          </View>
          <View>
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{ color: getColor('t2') }}
            >
              {getMessageSnapshot(thread.lastMessage)}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 54,
        }}
      />
    </Pressable>
  );
}

const ListItemRenderMemo = React.memo(ListItemRender);
