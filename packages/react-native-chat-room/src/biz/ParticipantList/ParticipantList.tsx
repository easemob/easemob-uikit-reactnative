import * as React from 'react';
import {
  ListRenderItemInfo,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18nContext } from '../../i18n';
import { Alert } from '../../ui/Alert';
import { FlatListFactory, FlatListRef } from '../../ui/FlatList';
import {
  BottomSheetNameMenu,
  // BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import type { PropsWithError, PropsWithTest } from '../types';
// import { ParticipantContextMenu } from './ParticipantContextMenu';
import { gTabHeaderHeight } from './ParticipantList.const';
import { usePanHandlers, useParticipantListAPI } from './ParticipantList.hooks';
import {
  ParticipantListItemMemo,
  ParticipantListItemProps,
} from './ParticipantList.item';
import { SearchStyle } from './SearchStyle';
import type { ParticipantListType } from './types';

const FlatList = FlatListFactory<ParticipantListItemProps>();

/**
 * Referencing value of the `ParticipantList` component.
 */
export type ParticipantListRef = {
  /**
   * Add custom menu item list.
   * @param memberMenuItems member menu item list.
   */
  initMenu: (memberMenuItems?: InitMenuItemsType[]) => void;
  /**
   * Remove member.
   * @param memberId the member id.
   */
  removeMember: (memberId: string) => void;
  /**
   * Mute member.
   * @param memberId the member id.
   * @param isMuted whether to mute.
   */
  muteMember: (memberId: string, isMuted: boolean) => void;

  /**
   * Close the menu.
   */
  closeMenu: () => void;
};

/**
 * Properties of the `ParticipantList` component.
 */
export type ParticipantListProps = {
  propsRef?: React.RefObject<ParticipantListRef>;
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture?: (finished: boolean) => void;
  /**
   * List type. {@link ParticipantListType}
   */
  memberType: ParticipantListType;
  /**
   * Callback function when search button is clicked.
   */
  onSearch?: (memberType: ParticipantListType) => void;
  /**
   * Callback function when there is no more member.
   */
  onNoMoreMember?: () => void;
  /**
   * Custom component for each item in the list. Built-in components are used by default.
   */
  MemberItemComponent?: React.ComponentType<ParticipantListItemProps>;
} & PropsWithTest &
  PropsWithError;

/**
 * Member List Component.
 *
 * @param props {@link ParticipantListProps}
 * @returns JSX.Element
 */
export function ParticipantList(props: ParticipantListProps) {
  const {
    requestUseScrollGesture,
    testMode,
    onError,
    memberType,
    onSearch,
    onNoMoreMember,
    MemberItemComponent,
    propsRef,
  } = props;

  const {
    data,
    pageState,
    onRefresh,
    refreshing,
    onEndReached,
    onViewableItemsChanged,
    viewabilityConfigRef,
    muteMember,
    removeMember,
    requestRefresh,
    onScrollBeginDrag,
    onScrollEndDrag,
    menuRef,
    alertRef,
    removedUser,
    onRemoveMember,
  } = useParticipantListAPI({
    testMode,
    onError,
    memberType,
    onNoMoreMember,
  });
  const ref = React.useRef<FlatListRef<ParticipantListItemProps>>({} as any);
  const memberMenuItemsRef = React.useRef<InitMenuItemsType[]>([]);
  // let menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const { tr } = useI18nContext();
  let height =
    winHeight * 0.6 -
    // gBottomSheetHeaderHeight -
    gTabHeaderHeight -
    44 - // search style height
    bottom -
    (StatusBar.currentHeight ?? 0);

  const { panHandlers, isScrollingRef } = usePanHandlers({
    requestUseScrollGesture,
  });

  const _MemberItemComponent = MemberItemComponent ?? ParticipantListItemMemo;

  if (propsRef?.current) {
    propsRef.current.initMenu = (memberMenuItems?: InitMenuItemsType[]) => {
      memberMenuItemsRef.current = memberMenuItems ?? [];
    };
    propsRef.current.removeMember = (memberId: string) => {
      removeMember(memberId);
    };
    propsRef.current.muteMember = (memberId: string, isMuted: boolean) => {
      muteMember(memberId, isMuted);
    };
    propsRef.current.closeMenu = () => {
      menuRef.current?.startHide?.();
    };
  }

  // const onGetMenuItems = () => {
  //   return memberMenuItemsRef.current;
  // };

  return (
    <>
      <View
        style={{
          height: height,
        }}
        {...panHandlers}
      >
        <SearchStyle
          onPress={() => {
            // modalRef.current?.startShow();
            onSearch?.(memberType);
          }}
        />
        <FlatList
          ref={ref}
          style={{
            flexGrow: 1,
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(info: ListRenderItemInfo<ParticipantListItemProps>) => {
            const { item } = info;
            return <_MemberItemComponent {...item} />;
          }}
          keyExtractor={(item: ParticipantListItemProps) => {
            return item.id;
          }}
          onMomentumScrollEnd={() => {
            if (Platform.OS !== 'ios') {
              isScrollingRef.current = false;
              requestUseScrollGesture?.(true);
            }
          }}
          onResponderEnd={() => {
            if (Platform.OS === 'ios') {
              isScrollingRef.current = false;
              requestUseScrollGesture?.(true);
            }
          }}
          onEndReached={onEndReached}
          viewabilityConfig={viewabilityConfigRef.current}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            pageState === 'error' ? (
              <ErrorPlaceholder onClicked={requestRefresh} />
            ) : null
          }
          ListLoadingComponent={
            pageState === 'loading' ? LoadingPlaceholder : null
          }
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
        />
      </View>
      {/* <ParticipantContextMenu
        {...props}
        removeMember={removeMember}
        muteMember={muteMember}
        onGetMenuItems={onGetMenuItems}
        onGetMenuRef={(m) => {
          menuRef = m;
        }}
      /> */}
      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
        initItems={[]}
      />
      <Alert
        ref={alertRef}
        title={tr(
          'Want to remove ${0} from the chatroom?',
          removedUser?.nickname
        )}
        buttons={[
          {
            text: tr('Cancel'),
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: tr('Confirm'),
            onPress: onRemoveMember,
          },
        ]}
      />
    </>
  );
}
