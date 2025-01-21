import * as React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ViewToken,
} from 'react-native';

import { useDispatchContext, useDispatchListener } from '../../dispatch';
import { useDelayExecTask } from '../../hook';
import { ChatCustomMessageBody, ChatMessageType } from '../../rename.chat';
import {
  custom_msg_event_type_join,
  RoomService,
  RoomServiceListener,
  useRoomContext,
  useRoomListener,
  UserServiceData,
} from '../../room';
import { AlertRef } from '../../ui/Alert';
import { wait } from '../../utils';
import { BottomSheetNameMenuRef, InitMenuItemsType } from '../BottomSheetMenu';
import type { PropsWithError, PropsWithTest } from '../types';
import { gMemberPerPageSize, gSearchTimeout } from './ParticipantList.const';
import type { ParticipantListItemProps } from './ParticipantList.item';
import type { ParticipantListType } from './types';

export function usePanHandlers(params: {
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture: ((finished: boolean) => void) | undefined;
}) {
  const { requestUseScrollGesture } = params;
  const isScrollingRef = React.useRef(false);
  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
    })
  );
  return {
    panHandlers: r.current.panHandlers,
    isScrollingRef: isScrollingRef,
  };
}

export function useIsOwner() {
  const im = useRoomContext();
  const isOwnerCallback = () => im.userId === im.ownerId;
  const [isOwnerState, setIsOwner] = React.useState<boolean | undefined>(
    undefined
  );
  useParticipantListener({
    im: im,
    onUserJoined: (roomId, userId) => {
      if (roomId === im.roomId) {
        if (im.userId === userId) {
          setIsOwner(im.userId === im.ownerId);
        }
      }
    },
    onUserLeave: (roomId, userId) => {
      if (roomId === im.roomId) {
        if (userId === im.userId) {
          setIsOwner(undefined);
        }
      }
    },
  });
  return {
    isOwner: isOwnerCallback,
    isOwnerState,
  };
}

export function useRoomState() {
  const im = useRoomContext();
  return {
    roomState: im.roomState,
  };
}

type useParticipantListAPIProps = PropsWithTest & PropsWithError;
export function useParticipantListAPI(
  props: useParticipantListAPIProps & {
    memberType: ParticipantListType;
    onNoMoreMember?: () => void;
  }
) {
  const { memberType, onNoMoreMember } = props;
  const im = useRoomContext();
  console.log(
    'test:useParticipantListAPI:',
    im.userId === im.ownerId,
    memberType
  );

  const { isOwner } = useIsOwner();
  const memberCursor = React.useRef('');

  const dataRef = React.useRef<ParticipantListItemProps[]>([]);
  // const dataRef = React.useRef(new Map<string, ParticipantListItemProps>());
  const [data, setData] = React.useState<ParticipantListItemProps[]>([]);

  const muterRef = React.useRef<string[]>([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const isRefreshGestureRef = React.useRef(false);
  const contentOffsetYRef = React.useRef(0);
  let menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const [removedUser, setRemovedUser] = React.useState<UserServiceData>();

  const [pageState, setPageState] = React.useState<
    'loading' | 'normal' | 'error'
  >('loading');

  const { emit } = useDispatchContext();
  useDispatchListener(
    `_$${useParticipantListAPI.name}_${memberType}_fetchMemberInfo`,
    (ids: string[]) => {
      _fetchMemberInfo(ids);
    }
  );

  const viewabilityConfigRef = React.useRef({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    viewablePercentThreshold: 50,
    waitForInteraction: false,
  });
  // !!!  ERROR  Invariant Violation: Changing onViewableItemsChanged on the fly is not supported
  const { delayExecTask } = useDelayExecTask(
    500,
    React.useCallback(
      (info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => {
        const ids = info.viewableItems.map((v) => {
          return (v.item as ParticipantListItemProps).userInfo.userId;
        });
        emit(`_$useParticipantListAPI_${memberType}_fetchMemberInfo`, ids);
      },
      [emit, memberType]
    )
  );

  const _addData = (userId?: string) => {
    if (userId === undefined) {
      return false;
    }
    if (dataRef.current.map((v) => v.userInfo.userId).includes(userId)) {
      return false;
    }
    const user = im.getUserInfo(userId);
    dataRef.current.push({
      id: userId,
      userInfo: {
        userId: userId,
        ...user,
        hasMenu: isOwner()
          ? userId === im.userId || userId === im.ownerId
            ? false
            : true
          : false,
      },
      actions: {
        onClicked: () => {
          // const isMuted = _isMuter(userId);
          // emit(
          //   `_$useParticipantListAPI_participantListContextMenu`,
          //   memberType, // current mute list
          //   isOwner(), // current user role
          //   userId, // current member id
          //   isMuted // current member mute state
          // );
          onShowMenu(memberType, isOwner(), userId);
        },
      },
    });
    return true;
  };

  const _updateData = (userInfo?: UserServiceData) => {
    if (userInfo === undefined) {
      return false;
    }
    for (const data of dataRef.current) {
      if (data.userInfo.userId === userInfo.userId) {
        data.userInfo = { ...data.userInfo, ...userInfo };
        return true;
      }
    }
    return false;
  };

  const _addDataList = (userIds: string[]) => {
    let ret = false;
    for (const id of userIds) {
      const r = _addData(id);
      if (r === true) {
        ret = true;
      }
    }
    return ret;
  };

  const _updateDataList = (userInfos?: UserServiceData[]) => {
    if (userInfos === undefined) {
      return false;
    }
    let ret = false;
    for (const data of userInfos) {
      const r = _updateData(data);
      if (r === true) {
        ret = true;
      }
    }
    return ret;
  };

  const _removeData = (userId?: string) => {
    if (userId === undefined) {
      return false;
    }
    for (let index = 0; index < dataRef.current.length; index++) {
      const element = dataRef.current[index];
      if (element?.userInfo.userId === userId) {
        dataRef.current.splice(index, 1);
        return true;
      }
    }
    return false;
  };

  const _removeDataList = (userIds?: string[]) => {
    if (userIds === undefined) {
      return false;
    }
    let ret = false;
    for (const userId of userIds) {
      const r = _removeData(userId);
      if (r === true) {
        ret = true;
      }
    }
    return ret;
  };

  const _updateUI = (isNeedUpdate: boolean) => {
    if (isNeedUpdate === true) {
      setData([...dataRef.current]);
    }
  };

  useParticipantListener({
    im: im,
    onUpdateInfo: (roomId, userInfo) => {
      if (roomId === im.roomId) {
        im.updateUserInfos([userInfo]);
        _updateUI(_updateData(userInfo)); // !!! Save rendering.
      }
    },
    onUserJoinedNotify: (roomId, userInfo) => {
      if (roomId === im.roomId) {
        im.updateUserInfos([userInfo]);
        if (memberType === 'member') {
          _updateUI(_addData(userInfo.userId));
        }
      }
    },
    onUserJoined: (roomId, userId) => {
      if (roomId === im.roomId) {
        if (memberType === 'member') {
          if (im.userId !== userId) {
            _updateUI(_addData(userId));
          } else {
            _refreshMembers(() => {
              const list10 = dataRef.current.slice(0, 19).map((v) => {
                return v.userInfo.userId;
              });
              _fetchMemberInfo(list10);
            });
            // if (isOwner() === true) {
            //   _fetchMuter(() => {
            //     if (muterRef.current.length > 0) {
            //       const list10 = muterRef.current.slice(0, 19);
            //       _fetchMemberInfo(list10);
            //     }
            //   });
            // }
          }
        } else if (memberType === 'muted') {
          if (im.userId === userId) {
            _refreshMembers(() => {
              const list10 = dataRef.current.slice(0, 19).map((v) => {
                return v.userInfo.userId;
              });
              _fetchMemberInfo(list10);
            });
          }
        }
      }
    },
    onUserLeave: (roomId, userId) => {
      if (roomId === im.roomId) {
        if (memberType === 'member') {
          if (userId !== im.userId) {
            _updateUI(_removeData(userId));
          }
        }
      }
    },
    onUserMuted: (roomId, userIds, _operatorId) => {
      if (roomId === im.roomId) {
        if (memberType === 'muted') {
          _updateUI(_addDataList(userIds));
        }
      }
    },
    onUserUnmuted: (roomId, userIds, _operatorId) => {
      if (roomId === im.roomId) {
        if (memberType === 'muted') {
          _updateUI(_removeDataList(userIds));
        }
      }
    },
  });

  React.useEffect(() => {
    _refreshMembers(() => {
      const list10 = dataRef.current.slice(0, 19).map((v) => {
        return v.userInfo.userId;
      });
      _fetchMemberInfo(list10);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const _isMuter = (memberId: string) => {
  //   return im.getMuter(memberId) !== undefined;
  // };

  const _refreshMembers = (onFinished?: () => void) => {
    if (memberType === 'member') {
      if (im.roomState === 'joined') {
        // _onPageState('loading');
        dataRef.current = [];
        memberCursor.current = '';
        im.fetchMembers(im.roomId!, gMemberPerPageSize, memberCursor.current)
          .then((r) => {
            // add owner
            if (im?.ownerId) {
              _addDataList([im.ownerId]);
            }

            memberCursor.current = r.cursor;
            if (r.list) {
              _addDataList(r.list);
            }
            _updateUI(true);
            onFinished?.();
            _onPageState('normal');
            im.sendFinished({ event: 'fetch_member_list' });
          })
          .catch((e) => {
            onFinished?.();
            im.sendError({
              error: e,
              from: useParticipantListAPI?.caller?.name,
            });
            _onPageState('error');
          });
      } else {
        onFinished?.();
      }
    } else if (memberType === 'muted') {
      if (im.roomState === 'joined') {
        dataRef.current = [];
        memberCursor.current = '';
        im.fetchMutedMembers(im.roomId!, 1)
          .then((r) => {
            im.updateMuter(r ?? []);
            muterRef.current = r ?? [];
            if (r) {
              _updateUI(_addDataList(r));
            }
            onFinished?.();
            _onPageState('normal');
            im.sendFinished({ event: 'fetch_muter_list' });
          })
          .catch((e) => {
            onFinished?.();
            im.sendError({
              error: e,
              from: useParticipantListAPI?.caller?.name,
            });
            _onPageState('error');
          });
      } else {
        onFinished?.();
      }
    }
  };

  const _loadMoreMembers = () => {
    if (memberType !== 'member') {
      return;
    }
    if (im.roomState === 'joined') {
      im.fetchMembers(im.roomId!, gMemberPerPageSize, memberCursor.current)
        .then((r) => {
          memberCursor.current = r.cursor;
          const isNeedUpdate = _addDataList(r?.list ?? []);
          _updateUI(isNeedUpdate);
          if (isNeedUpdate === false) {
            onNoMoreMember?.();
          }
          im.sendFinished({ event: 'fetch_member_list' });
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useParticipantListAPI?.caller?.name,
          });
        });
    }
  };

  const _fetchMemberInfo = (ids: string[]) => {
    if (im.roomState === 'joined') {
      im.fetchUserInfos(im.getNoExisted(ids))
        .then((list) => {
          im.updateUserInfos(list ?? []);
          _updateUI(_updateDataList(list));
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useParticipantListAPI?.caller?.name,
          });
        });
    }
  };

  // const _fetchMuter = (onFinished?: () => void) => {
  //   if (memberType === 'muted') {
  //     return;
  //   }
  //   if (im.roomState === 'joined') {
  //     im.fetchMutedMembers(im.roomId!, 1)
  //       .then((r) => {
  //         im.updateMuter(r ?? []);
  //         muterRef.current = r ?? [];
  //         onFinished?.();
  //         im.sendFinished({ event: 'fetch_muter_list' });
  //       })
  //       .catch((e) => {
  //         onFinished?.();
  //         im.sendError({
  //           error: new UIKitError({
  //             code: ErrorCode.room_fetch_mute_member_list_error,
  //             extra: e.toString(),
  //           }),
  //           from: useParticipantListAPI?.caller?.name,
  //         });
  //       });
  //   } else {
  //     onFinished?.();
  //   }
  // };

  const _onRefresh = () => {
    setRefreshing(true);
    _refreshMembers(() => {
      wait(1000).then(() => {
        setRefreshing(false);
      });
    });
  };

  const _onPageState = (state: typeof pageState) => {
    setPageState(state);
  };

  const _onEndReached = () => {
    if (isRefreshGestureRef.current === false) {
      _loadMoreMembers();
    }
  };

  const _muteMember = (memberId: string, isMuted: boolean) => {
    if (memberType === 'member') {
      if (im.roomState === 'joined') {
        im.updateMemberState(
          im.roomId!,
          memberId,
          isMuted === true ? 'mute' : 'unmute'
        )
          .then(() => {
            // const member = dataRef.current.find((v) => {
            //   return v.userInfo.userId === memberId;
            // });
            // if (member) {
            //   _updateUI(_updateData(member?.userInfo));
            // }
            im.sendFinished({ event: isMuted === true ? 'mute' : 'unmute' });
          })
          .catch((e) => {
            im.sendError({
              error: e,
              from: useParticipantListAPI?.caller?.name,
            });
          });
      }
    } else if (memberType === 'muted') {
      if (im.roomState === 'joined') {
        im.updateMemberState(
          im.roomId!,
          memberId,
          isMuted === true ? 'mute' : 'unmute'
        )
          .then(() => {
            _updateUI(_removeData(memberId));
            im.sendFinished({ event: isMuted === true ? 'mute' : 'unmute' });
          })
          .catch((e) => {
            im.sendError({
              error: e,
              from: useParticipantListAPI?.caller?.name,
            });
          });
      }
    }
  };
  const _removeMember = (memberId: string) => {
    if (memberType !== 'member') {
      return;
    }
    if (im.roomState === 'joined') {
      im.kickMember(im.roomId!, memberId)
        .then(() => {
          _updateUI(_removeData(memberId));
          im.sendFinished({
            event: 'kick',
            extra: {
              userId: memberId,
              userName: im.getUserInfo(memberId)?.nickname,
            },
          });
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useParticipantListAPI?.caller?.name,
          });
        });
    }
  };

  const _onScrollBeginDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    contentOffsetYRef.current = event.nativeEvent.contentOffset.y;
  };
  const _onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (contentOffsetYRef.current > event.nativeEvent.contentOffset.y) {
      isRefreshGestureRef.current = true;
    } else {
      isRefreshGestureRef.current = false;
    }
  };

  const onShowMenu = (
    memberType: ParticipantListType,
    isOwner: boolean,
    userId: string
  ) => {
    if (isOwner === false || userId === undefined) {
      return;
    }
    if (memberType === 'member') {
      const isMuted = im.getMuter(userId);
      const user = im.getUserInfo(userId);
      setRemovedUser(user ?? { userId: userId });
      let items: InitMenuItemsType[] = [
        {
          name: isMuted === undefined ? 'Mute' : 'Unmute',
          isHigh: false,
          onClicked: () => {
            if (userId !== im.userId) {
              _muteMember(userId, isMuted === undefined ? true : false);
            }
            menuRef?.current?.startHide?.();
          },
        },
        {
          name: 'Remove',
          isHigh: true,
          onClicked: () => {
            if (userId !== im.userId) {
              // _removeMember(userId);
              menuRef?.current?.startHide?.(() => {
                alertRef.current?.alert?.();
              });
            } else {
              menuRef?.current?.startHide?.();
            }
          },
        },
      ];
      menuRef?.current?.startShowWithInit(items);
    } else if (memberType === 'muted') {
      menuRef?.current?.startShowWithInit([
        {
          name: 'Unmute',
          isHigh: false,
          onClicked: () => {
            if (userId !== im.userId) {
              _muteMember(userId, false);
            }
            menuRef?.current?.startHide?.();
          },
        },
      ]);
    }
  };

  const listener = React.useRef(
    (
      _memberType: ParticipantListType, // current mute list
      isOwner: boolean, // current user role
      userId: string // current member id
      // isMuted: boolean // current member mute state
    ) => {
      onShowMenu(_memberType, isOwner, userId);
    }
  );
  useDispatchListener(
    `_$useParticipantListAPI_participantListContextMenu`,
    listener.current
  );

  const onRemoveMember = () => {
    alertRef.current?.close?.();
    if (removedUser?.userId) {
      _removeMember(removedUser.userId);
    }
  };

  return {
    data: data,
    pageState: pageState,
    muter: muterRef.current,
    refreshing: refreshing,
    onRefresh: _onRefresh,
    onEndReached: _onEndReached,
    viewabilityConfigRef: viewabilityConfigRef,
    onViewableItemsChanged: delayExecTask,
    muteMember: _muteMember,
    removeMember: _removeMember,
    requestRefresh: _refreshMembers,
    onScrollBeginDrag: _onScrollBeginDrag,
    onScrollEndDrag: _onScrollEndDrag,
    menuRef,
    alertRef,
    removedUser: removedUser,
    onRemoveMember,
  };
}

export function useSearchParticipantListAPI(props: {
  memberType: ParticipantListType;
  searchType?: keyof UserServiceData;
  onMuteOperatorFinished?: () => void;
}) {
  const { memberType, searchType = 'nickname', onMuteOperatorFinished } = props;
  // const ds = React.useRef<NodeJS.Timeout | undefined>();
  const im = useRoomContext();

  const [data, setData] = React.useState<ParticipantListItemProps[]>([]);

  const { isOwner } = useIsOwner();
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const keyRef = React.useRef('');
  const removeList = React.useRef<string[]>([]);
  const [value, setValue] = React.useState('');
  const [removedUser, setRemovedUser] = React.useState<UserServiceData>();

  const _execSearch = (key: string) => {
    keyRef.current = key;
    const r = im.getIncludes(key, searchType);
    const rr = r
      .map((v) => {
        return {
          id: v.userId,
          userInfo: {
            ...v,
            hasMenu: isOwner()
              ? v.userId === im.userId || v.userId === im.ownerId
                ? false
                : true
              : false,
          },
          actions: {
            onClicked: () => {
              onShowMenu(memberType, isOwner(), v.userId);
            },
          },
        } as ParticipantListItemProps;
      })
      .filter((v) => {
        return removeList.current.includes(v.userInfo.userId) === false;
      });
    if (key.length === 0) {
      setData([]);
    } else {
      setData([...rr]);
    }
  };

  const { delayExecTask: _deferSearch } = useDelayExecTask(
    gSearchTimeout,
    _execSearch
  );

  const _muteMember = (memberId: string, isMuted: boolean) => {
    if (im.roomState === 'joined') {
      im.updateMemberState(
        im.roomId!,
        memberId,
        isMuted === true ? 'mute' : 'unmute'
      )
        .then(() => {
          im.sendFinished({ event: isMuted === true ? 'mute' : 'unmute' });
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useParticipantListAPI?.caller?.name,
          });
        });
    }
  };

  const _removeMember = (memberId: string) => {
    if (im.roomState === 'joined') {
      im.kickMember(im.roomId!, memberId)
        .then(() => {
          removeList.current.push(memberId);
          im.sendFinished({
            event: 'kick',
            extra: {
              userId: memberId,
              userName: im.getUserInfo(memberId)?.nickname,
            },
          });
          _execSearch(keyRef.current);
        })
        .catch((e) => {
          im.sendError({
            error: e,
            from: useParticipantListAPI?.caller?.name,
          });
        });
    }
  };

  const onShowMenu = (
    memberType: ParticipantListType,
    isOwner: boolean,
    userId: string
  ) => {
    if (isOwner === false || userId === undefined) {
      return;
    }
    if (memberType === 'member') {
      const isMuted = im.getMuter(userId);
      const user = im.getUserInfo(userId);
      setRemovedUser(user ?? { userId: userId });
      let items: InitMenuItemsType[] = [
        {
          name: isMuted === undefined ? 'Mute' : 'Unmute',
          isHigh: false,
          onClicked: () => {
            if (userId !== im.userId) {
              _muteMember(userId, isMuted === undefined ? true : false);
            }
            menuRef?.current?.startHide?.(() => {
              onMuteOperatorFinished?.();
            });
          },
        },
        {
          name: 'Remove',
          isHigh: true,
          onClicked: () => {
            if (userId !== im.userId) {
              // _removeMember(userId);
              menuRef?.current?.startHide?.(() => {
                alertRef.current?.alert?.();
              });
            } else {
              menuRef?.current?.startHide?.();
            }
          },
        },
      ];
      menuRef?.current?.startShowWithInit(items);
    } else if (memberType === 'muted') {
      menuRef?.current?.startShowWithInit([
        {
          name: 'Unmute',
          isHigh: false,
          onClicked: () => {
            if (userId !== im.userId) {
              _muteMember(userId, false);
            }
            menuRef?.current?.startHide?.(() => {
              onMuteOperatorFinished?.();
            });
          },
        },
      ]);
    }
  };

  const onRemoveMember = () => {
    alertRef.current?.close?.();
    if (removedUser?.userId) {
      _removeMember(removedUser.userId);
    }
  };

  return {
    _data: data,
    deferSearch: _deferSearch,
    menuRef,
    value,
    setValue,
    alertRef,
    removedUser,
    onRemoveMember,
  };
}

type useParticipantListenerProps = {
  im: RoomService;
  onUpdateInfo?: (roomId: string, userInfo: UserServiceData) => void;
  onUserJoinedNotify?: (roomId: string, userInfo: UserServiceData) => void;
  onUserJoined?: (roomId: string, userId: string) => void;
  onUserLeave?: (roomId: string, userId: string) => void;
  onUserMuted?: (roomId: string, userIds: string[], operatorId: string) => void;
  onUserUnmuted?: (
    roomId: string,
    userIds: string[],
    operatorId: string
  ) => void;
};
export function useParticipantListener(props: useParticipantListenerProps) {
  const {
    im,
    onUpdateInfo,
    onUserJoined,
    onUserLeave,
    onUserJoinedNotify,
    onUserMuted,
    onUserUnmuted,
  } = props;
  const msgListener = React.useRef<RoomServiceListener>({
    onMessageReceived: (roomId, message) => {
      const userInfo = im.userInfoFromMessage(message);
      if (userInfo) {
        onUpdateInfo?.(roomId, userInfo);
        if (message.body.type === ChatMessageType.CUSTOM) {
          const body = message.body as ChatCustomMessageBody;
          if (body.event === custom_msg_event_type_join) {
            onUserJoinedNotify?.(roomId, userInfo);
          }
        }
      }
    },
    onUserJoined: (roomId, user) => {
      onUserJoined?.(roomId, user.userId);
    },
    onUserLeave: (roomId, userId) => {
      onUserLeave?.(roomId, userId);
    },
    onUserMuted(roomId, userIds, operatorId) {
      onUserMuted?.(roomId, userIds, operatorId);
    },
    onUserUnmuted(roomId, userIds, operatorId) {
      onUserUnmuted?.(roomId, userIds, operatorId);
    },
  });
  useRoomListener(msgListener.current);
}
