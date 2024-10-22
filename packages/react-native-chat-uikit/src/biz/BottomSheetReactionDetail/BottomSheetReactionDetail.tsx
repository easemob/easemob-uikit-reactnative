import * as React from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DataModel, useChatContext } from '../../chat';
import { useConfigContext } from '../../config';
import { useColors, useGetStyleProps } from '../../hook';
import type { ChatMessageReaction } from '../../rename.chat';
import { usePaletteContext, useThemeContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { useDataPriority } from '../hooks';

export type MessageReactionModel = Omit<ChatMessageReaction, 'userList'> & {
  userList: DataModel[];
};

/**
 * Referencing Values of the `BottomSheetReactionDetail` component.
 */
export type BottomSheetReactionDetailRef = SlideModalRef & {
  /**
   * While displaying the component, the menu items will also be dynamically changed.
   */
  startShowWithProps: (props: BottomSheetReactionDetailProps) => void;
};
export type BottomSheetReactionDetailProps = {
  /**
   * To request to close the component, you usually need to call the `startHide` method here.
   */
  onRequestModalClose: () => void;
  /**
   * The maximum height of the component.
   *
   * @default half of the entire screen.
   */
  maxHeight?: number;

  /**
   * The current selected reaction.
   */
  currentSelected?: string;

  /**
   * The reaction list.
   */
  reactionList: MessageReactionModel[];

  /**
   * The message ID.
   */
  msgId: string;
};

/**
 * The `BottomSheetReactionDetail` component displays the list of reactions and the list of users who have reacted to the message.
 */
export const BottomSheetReactionDetail = React.forwardRef<
  BottomSheetReactionDetailRef,
  BottomSheetReactionDetailProps
>(function (
  props: BottomSheetReactionDetailProps,
  ref: React.ForwardedRef<BottomSheetReactionDetailRef>
) {
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const isShow = React.useRef(false);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg3: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
  });
  const {} = useSafeAreaInsets();
  const {
    list,
    onRequestModalClose,
    msgId,
    currentSelected,
    onClickedReaction,
    updateProps,
    maxHeight = Dimensions.get('window').height / 2,
    onRemoveReaction,
  } = useGetProps(props);

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
        startShowWithProps: (props: BottomSheetReactionDetailProps) => {
          isShow.current = true;
          updateProps(props);
          modalRef?.current?.startShow?.();
        },
      };
    },
    [updateProps]
  );

  React.useEffect(() => {
    if (isShow.current === true) {
      modalRef?.current?.startShow?.();
    }
  }, []);

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
          height: maxHeight,
        }}
      >
        <TabReaction
          list={list}
          onClicked={onClickedReaction}
          currentSelected={currentSelected}
        />
        <UserList
          msgId={msgId}
          currentSelected={currentSelected}
          onRemoveReaction={onRemoveReaction}
        />
        {/* <View style={{ height: bottom }} /> */}
      </SafeAreaView>
    </SlideModal>
  );
});

function useGetProps(props: BottomSheetReactionDetailProps) {
  const {
    reactionList,
    msgId,
    currentSelected = reactionList[0]!.reaction,
    onRequestModalClose,
    ...others
  } = props;
  const [_msgId, setMsgId] = React.useState<string>(msgId);
  const [_currentSelected, setCurrentSelected] =
    React.useState<string>(currentSelected);
  const [data, setData] = React.useState<MessageReactionModel[]>(
    reactionList ?? []
  );
  const im = useChatContext();
  const _updateProps = (props: BottomSheetReactionDetailProps) => {
    const {
      reactionList,
      msgId,
      currentSelected = reactionList[0]!.reaction,
    } = props;
    setData(reactionList);
    setMsgId(msgId);
    setCurrentSelected(currentSelected);
  };

  const onClickedReaction = React.useCallback((reaction: string) => {
    setCurrentSelected(reaction);
  }, []);

  const onRemoveReaction = React.useCallback(
    (msgId: string, reaction: string) => {
      im.removeReactionFromMessage({
        msgId: msgId,
        reaction: reaction,
        onResult: (res) => {
          if (res.isOk) {
            const index = data.findIndex((v) => v.reaction === reaction);
            if (index !== -1) {
              if (data[index]!.count > 1) {
                data[index]!.count--;
                setData([...data]);
              } else {
                data.splice(index, 1);
                setData([...data]);
              }
              if (data.length > 0) {
                setCurrentSelected(data[0]!.reaction);
              } else {
                setCurrentSelected('');
                onRequestModalClose?.();
              }
            }
          }
        },
      });
    },
    [im, data, onRequestModalClose]
  );
  return {
    updateProps: _updateProps,
    list: data,
    msgId: _msgId,
    currentSelected: _currentSelected,
    onClickedReaction,
    onRemoveReaction,
    onRequestModalClose,
    ...others,
  };
}

type TabReactionItemProps = MessageReactionModel & {
  onClicked?: (reaction: string) => void;
  currentSelected?: string;
};
type TabReactionProps = {
  list: MessageReactionModel[];
  onClicked?: (reaction: string) => void;
  currentSelected?: string;
};

function TabReaction(props: TabReactionProps) {
  const { list, onClicked, currentSelected } = props;
  const FlatList = React.useMemo(
    () => FlatListFactory<TabReactionItemProps>(),
    []
  );
  return (
    <View style={{ height: 44, width: Dimensions.get('window').width - 32 }}>
      <FlatList
        horizontal={true}
        data={list}
        renderItem={(info) => {
          const { item } = info;
          return (
            <TabItemMemo
              {...item}
              onClicked={onClicked}
              currentSelected={currentSelected ?? list[0]!.reaction}
            />
          );
          // return TabItemMemo(item);
        }}
        keyExtractor={(item) => item.reaction}
      />
    </View>
  );
}

function TabItem(props: TabReactionItemProps) {
  const { reaction, count, onClicked, currentSelected } = props;
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { fontFamily } = useConfigContext();
  const { getColor } = useColors({
    dis: {
      light: colors.neutral[3],
      dark: colors.neutral[7],
    },
    bg4: {
      light: colors.neutral[9],
      dark: colors.neutral[7],
    },
    green: {
      light: colors.secondary[4],
      dark: colors.secondary[5],
    },
  });
  const r = reaction;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Pressable onPress={() => onClicked?.(reaction)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // borderColor: getColor('enable'),
            // borderWidth: 1,
            marginRight: 4,
            paddingRight: 8,
            paddingLeft: 6,
            backgroundColor: getColor(
              currentSelected === reaction ? 'bg4' : ''
            ),
            borderRadius: getBorderRadius({
              height: 36,
              crt: corner.bubble[0]!,
              cr: cornerRadius,
            }),
            maxHeight: 28,
          }}
        >
          <SingleLineText
            style={{
              fontSize: Platform.OS === 'ios' ? 15 : 12,
              fontFamily: fontFamily,
              margin: 4,
            }}
          >
            {r}
          </SingleLineText>
          <View style={{ width: 6 }} />
          <SingleLineText
            paletteType={'label'}
            textType={'medium'}
            style={{
              color: getColor('dis'),
            }}
          >
            {count > 99 ? '+99' : count}
          </SingleLineText>
        </View>
      </Pressable>
    </View>
  );
}
const TabItemMemo = React.memo(TabItem);

type UserListProps = {
  msgId: string;
  currentSelected: string;
  onRemoveReaction?: (msgId: string, reaction: string) => void;
};
type UserListItemProps = {
  userId: string;
  isMyself?: boolean;
  userAvatar?: string;
  userName?: string;
  onClickedItem?: (userId: string) => void;
};
function UserList(props: UserListProps) {
  const { currentSelected, msgId, onRemoveReaction } = props;
  const FlatList = React.useMemo(
    () => FlatListFactory<UserListItemProps>(),
    []
  );
  const [data, setData] = React.useState<UserListItemProps[]>([]);
  const cursorRef = React.useRef('');
  const im = useChatContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const { getContactInfo } = useDataPriority({});

  const onClickedItem = React.useCallback(
    (userId: string) => {
      if (userId === im.userId) {
        onRemoveReaction?.(msgId, currentSelected);
      }
    },
    [currentSelected, im.userId, msgId, onRemoveReaction]
  );

  const request = React.useCallback(() => {
    im.getMessageReactionsDetail({
      msgId: msgId,
      reaction: currentSelected,
      cursor: cursorRef.current,
      pageSize: 20,
      onResult: (res) => {
        if (
          res.isOk &&
          res.value &&
          res.value.list &&
          res.value.list.length > 0
        ) {
          const userId = im.userId;
          if (userId) {
            const list = res.value.list.filter(
              (v) => v.reaction === currentSelected
            );
            if (cursorRef.current === '') {
              setData(
                list[0]!.userList
                  .map((v) => {
                    return {
                      userId: v,
                      isMyself: v === userId,
                      userAvatar: getContactInfo(v).avatar,
                      userName: getContactInfo(v).name,
                    } as UserListItemProps;
                  })
                  .sort((a) => {
                    if (a.isMyself) return -1;
                    return 1;
                  })
              );
            } else {
              setData((prev) => {
                const ret = [
                  ...prev,
                  ...list[0]!.userList.map((v) => {
                    return {
                      userId: v,
                      isMyself: v === userId,
                      userAvatar: getContactInfo(v).avatar,
                      userName: getContactInfo(v).name,
                    };
                  }),
                ];
                return ret.sort((a) => {
                  if (a.isMyself) return -1;
                  return 1;
                });
              });
            }
          }
          cursorRef.current = res.value.cursor;
        }
      },
    });
  }, [currentSelected, getContactInfo, im, msgId]);

  React.useEffect(() => {
    cursorRef.current = '';
    request();
  }, [currentSelected, im, msgId, request]);

  const onRefresh = React.useCallback(() => {
    cursorRef.current = '';
    setRefreshing(true);
    request();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [request]);

  const onEndReached = React.useCallback(() => {
    if (cursorRef.current !== '') {
      request();
    }
  }, [request]);

  return (
    <View style={{ flex: 1, width: Dimensions.get('window').width }}>
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        data={data}
        renderItem={(info) => {
          const { item } = info;
          return <UserListItemMemo {...item} onClickedItem={onClickedItem} />;
          // return TabItemMemo(item);
        }}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
}

function UserListItem(props: UserListItemProps) {
  const { userId, userAvatar, userName, onClickedItem, isMyself } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    trash: {
      light: colors.neutral[7],
      dark: colors.neutral[7],
    },
  });
  return (
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        onClickedItem?.(userId);
      }}
      onLongPress={() => {}}
    >
      <View
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 16,
        }}
      >
        <Avatar url={userAvatar} size={40} />
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
            style={{ color: getColor('fg') }}
          >
            {userName === undefined || userName.length === 0
              ? userId
              : userName}
          </SingleLineText>
        </View>
        {isMyself === true ? (
          <Icon
            name={'trash'}
            style={{
              width: 16,
              height: 16,
              padding: 4,
              tintColor: getColor('trash'),
            }}
          />
        ) : null}
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
const UserListItemMemo = React.memo(UserListItem);
