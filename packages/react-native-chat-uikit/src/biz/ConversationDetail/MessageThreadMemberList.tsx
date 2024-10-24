import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { useChatContext } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { useCloseMenu, useDataPriority } from '../hooks';
import { useMessageThreadMemberListMoreActions } from '../hooks/useMessageThreadMemberListMoreActions';
import { useFlatList } from '../List';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { TopNavigationBar, TopNavigationBarLeft } from '../TopNavigationBar';
import { ContextNameMenuRef } from '../types';
import { gRequestMaxThreadCount } from './const';
import type {
  MessageThreadMemberListItemProps,
  MessageThreadMemberListProps,
  ThreadMemberModel,
} from './types';

/**
 * Message Thread Member List Component.
 */
export function MessageThreadMemberList(props: MessageThreadMemberListProps) {
  const FlatList = React.useMemo(
    () => FlatListFactory<MessageThreadMemberListItemProps>(),
    []
  );
  const { containerStyle, navigationBarVisible, customNavigationBar, onBack } =
    props;
  const {
    data,
    onMore,
    reachedThreshold,
    bounces,
    listState,
    menuRef,
    onClickedItem,
    onRequestCloseMenu,
  } = useMessageThreadMemberList(props);
  const { tr } = useI18nContext();
  const { getColor } = useColors();

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
              <TopNavigationBarLeft
                onBack={onBack}
                content={tr('_uikit_thread_member')}
              />
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
            info: ListRenderItemInfo<MessageThreadMemberListItemProps>
          ) => {
            const { item } = info;
            return <ListItemRender {...item} onClickedItem={onClickedItem} />;
          }}
          keyExtractor={(item: MessageThreadMemberListItemProps) => {
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

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
    </View>
  );
}

function useMessageThreadMemberList(props: MessageThreadMemberListProps) {
  const { testMode, thread, onClickedItem } = props;
  const flatListProps = useFlatList<MessageThreadMemberListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
    enableMore: true,
  });
  const { dataRef, setData } = flatListProps;
  const [reachedThreshold] = React.useState(0.5);
  const hasNoMoreRef = React.useRef(false);
  const currentCursorRef = React.useRef<string>('');
  const bounces = React.useRef(true).current;
  const im = useChatContext();
  const menuRef = React.useRef<ContextNameMenuRef>({} as any);
  const alertRef = React.useRef<any>(null);
  const { closeMenu } = useCloseMenu({ menuRef });
  const groupOwnerRef = React.useRef<string>('');
  const { getContactInfo } = useDataPriority({});

  const onClickedKickMember = React.useCallback(
    (threadId: string, memberId: string) => {
      im.removeMemberFromThread({
        threadId: threadId,
        userId: memberId,
      });
    },
    [im]
  );

  const { onShowMessageThreadMemberListMoreActions } =
    useMessageThreadMemberListMoreActions({
      thread,
      menuRef,
      alertRef,
    });

  const _onClickedItem = React.useCallback(
    (data?: ThreadMemberModel) => {
      if (data) {
        if (onClickedItem) {
          const ret = onClickedItem(data);
          if (ret === true) {
            if (
              (thread.owner === im.userId ||
                groupOwnerRef.current === im.userId) &&
              data.id !== im.userId
            ) {
              onShowMessageThreadMemberListMoreActions({
                threadId: thread.threadId,
                memberId: data.id,
                onClickedKickMember: onClickedKickMember,
                groupOwner: groupOwnerRef.current,
              });
            }
          }
        } else {
          if (
            (thread.owner === im.userId ||
              groupOwnerRef.current === im.userId) &&
            data.id !== im.userId
          ) {
            onShowMessageThreadMemberListMoreActions({
              threadId: thread.threadId,
              memberId: data.id,
              onClickedKickMember: onClickedKickMember,
              groupOwner: groupOwnerRef.current,
            });
          }
        }
      }
    },
    [
      im.userId,
      onClickedItem,
      onClickedKickMember,
      onShowMessageThreadMemberListMoreActions,
      thread,
    ]
  );

  const requestMore = React.useCallback(() => {
    if (thread) {
      im.fetchMembersFromThread({
        threadId: thread.threadId,
        cursor: currentCursorRef.current,
        pageSize: gRequestMaxThreadCount,
        onResult: (res) => {
          if (res.isOk && res.value?.list) {
            if (res.value.list.length < gRequestMaxThreadCount) {
              hasNoMoreRef.current = true;
            }
            currentCursorRef.current = res.value.cursor;
            if (res.value) {
              res.value.list.forEach((item) => {
                dataRef.current.push({
                  model: {
                    id: item,
                    name: getContactInfo(item).name,
                    avatar: getContactInfo(item).avatar,
                    isOwner: thread.owner === item,
                    type: 'user',
                  },
                });
              });
              setData([...dataRef.current]);
            }
          }
        },
      });
    }
  }, [dataRef, getContactInfo, im, setData, thread]);

  const _onMore = React.useCallback(() => {
    if (hasNoMoreRef.current === true) {
      return;
    }
    if (dataRef.current.length < 10) {
      return;
    }
    requestMore();
  }, [dataRef, requestMore]);

  const init = React.useCallback(() => {
    if (thread && thread.parentId) {
      im.getGroupInfo({
        groupId: thread.parentId,
        onResult: (res) => {
          if (res.isOk && res.value) {
            groupOwnerRef.current = res.value.owner;
          }
        },
      });
    }
  }, [im, thread]);

  React.useEffect(() => {
    init();
  }, [init]);

  React.useEffect(() => {
    currentCursorRef.current = '';
    requestMore();
  }, [requestMore]);

  return {
    ...flatListProps,
    reachedThreshold,
    onMore: _onMore,
    bounces,
    menuRef,
    onRequestCloseMenu: closeMenu,
    onClickedItem: _onClickedItem,
  };
}

function ListItemRender(props: MessageThreadMemberListItemProps) {
  const { model } = props;
  const { id, name, avatar } = model;
  const {} = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
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
  });

  const _onClicked = React.useCallback(() => {
    // onClickedItem?.(model);
  }, []);

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
        }}
      >
        <Avatar url={avatar} size={40} />
        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: '80%',
          }}
        >
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{ color: getColor('t1') }}
          >
            {name === undefined || name.length === 0 ? id : name}
          </SingleLineText>
          {/* {isOwner === true ? (
            <SingleLineText
              paletteType={'title'}
              textType={'small'}
              style={{
                color: getColor('t2'),
              }}
            >
              {tr('_uikit_thread_owner')}
            </SingleLineText>
          ) : null} */}
        </View>
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </Pressable>
  );
}
