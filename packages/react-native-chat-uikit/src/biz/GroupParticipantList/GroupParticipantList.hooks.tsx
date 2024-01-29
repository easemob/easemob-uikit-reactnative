import * as React from 'react';

import {
  ChatServiceListener,
  GroupParticipantModel,
  UIGroupParticipantListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useFlatList } from '../List';
import { GroupParticipantListItemMemo } from './GroupParticipantList.item';
import type {
  GroupParticipantListItemComponentType,
  GroupParticipantListItemProps,
  GroupParticipantListProps,
} from './types';

export function useGroupParticipantList(props: GroupParticipantListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    testMode,
    groupId,
    participantType,
    onClickedAddParticipant,
    onClickedDelParticipant,
    onDelParticipant,
    onChangeOwner,
    ListItemRender: propsListItemRender,
    onKicked: propsOnKicked,
    // onRequestGroupData,
  } = props;
  const flatListProps = useFlatList<GroupParticipantListItemProps>({
    // onInit: () => init(),
  });
  const { setData, dataRef } = flatListProps;
  const [participantCount, setParticipantCount] = React.useState(0);
  const [deleteCount, setDeleteCount] = React.useState(0);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const { closeMenu } = useCloseMenu({ menuRef });
  const ListItemRenderRef = React.useRef<GroupParticipantListItemComponentType>(
    propsListItemRender ?? GroupParticipantListItemMemo
  );
  const [ownerId, setOwnerId] = React.useState<string | undefined>(undefined);

  const im = useChatContext();
  const { tr } = useI18nContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      const ret = onClickedItem?.(data);
      if (ret !== false) {
        if (participantType === 'change-owner') {
          alertRef.current.alertWithInit({
            title: tr(
              '_uikit_group_alert_change_owner_title',
              data?.memberName ?? data?.memberId
            ),
            buttons: [
              {
                text: tr('cancel'),
                onPress: () => {
                  alertRef.current.close?.();
                },
              },
              {
                text: tr('confirm'),
                isPreferred: true,
                onPress: () => {
                  alertRef.current.close?.();
                  onChangeOwner?.(data);
                },
              },
            ],
          });
        }
      }
    },
    [onChangeOwner, onClickedItem, participantType, tr]
  );

  const onLongPressedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const calculateDeleteCount = React.useCallback(() => {
    if (participantType !== 'delete') {
      return;
    }
    let count = 0;
    dataRef.current = dataRef.current.map((item) => {
      if (item) {
        if (item.data.checked === true) {
          count++;
        }
      }
      return item;
    });
    setDeleteCount(count);
  }, [dataRef, participantType]);

  const refreshToUI = React.useCallback(() => {
    calculateDeleteCount();
    const uniqueList = dataRef.current.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.data.memberId === item.data.memberId)
    );
    dataRef.current = uniqueList;
    setData([...dataRef.current]);
  }, [calculateDeleteCount, dataRef, setData]);

  const onCheckClickedCallback = React.useCallback(
    (data?: GroupParticipantModel) => {
      if (participantType === 'delete') {
        if (data?.checked !== undefined) {
          im.setModelState({
            tag: groupId,
            id: data.memberId,
            state: { checked: !data.checked },
          });
          dataRef.current = dataRef.current.map((item) => {
            if (item) {
              if (item.id === data.memberId) {
                return {
                  ...item,
                  data: { ...item.data, checked: !data.checked },
                };
              }
            }
            return item;
          });
          refreshToUI();
        }
      }
    },
    [dataRef, groupId, im, refreshToUI, participantType]
  );

  const init = React.useCallback(async () => {
    if (testMode === 'only-ui') {
    } else {
      // im.setGroupParticipantOnRequestData(onRequestGroupData);
      const owner = await im.getGroupOwner({ groupId });
      if (owner) {
        setOwnerId(owner.memberId);
      }
      if (participantType === 'delete') {
        im.clearModelState({ tag: groupId });
      }
      im.getGroupAllMembers({
        groupId: groupId,
        owner,
        isReset:
          participantType === undefined || participantType === 'common'
            ? true
            : false,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                if (participantType === 'delete') {
                  const modelState = im.getModelState({
                    tag: groupId,
                    id: item.memberId,
                  });
                  return {
                    id: item.memberId,
                    data: {
                      ...item,
                      isOwner: item.memberId === owner?.memberId,
                      checked: modelState?.checked ?? false,
                    },
                  } as GroupParticipantListItemProps;
                } else {
                  return {
                    id: item.memberId,
                    data: {
                      ...item,
                      isOwner: item.memberId === owner?.memberId,
                      checked: undefined,
                    },
                  } as GroupParticipantListItemProps;
                }
              });
              if (participantType === 'change-owner') {
                dataRef.current = dataRef.current.filter((item) => {
                  return (
                    item.data.memberId !== im.userId ||
                    item.data.isOwner !== true
                  );
                });
              } else if (participantType === 'delete') {
                dataRef.current = dataRef.current.filter((item) => {
                  return (
                    item.data.memberId !== im.userId ||
                    item.data.isOwner !== true
                  );
                });
              } else if (participantType === 'mention') {
                dataRef.current.unshift({
                  id: 'All',
                  data: {
                    memberId: 'All',
                    memberName: 'All',
                  } as GroupParticipantModel,
                });
              }
              refreshToUI();
              setParticipantCount(dataRef.current.length);
            }
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  }, [dataRef, groupId, im, participantType, refreshToUI, testMode]);

  const onClickedAddParticipantCallback = React.useCallback(() => {
    if (onClickedAddParticipant) {
      onClickedAddParticipant();
    }
  }, [onClickedAddParticipant]);
  const onClickedDelParticipantCallback = React.useCallback(() => {
    if (onClickedDelParticipant) {
      onClickedDelParticipant();
    }
  }, [onClickedDelParticipant]);
  const onDelParticipantCallback = React.useCallback(() => {
    if (participantType !== 'delete') {
      return;
    }

    if (onDelParticipant) {
      const list = dataRef.current
        .filter((item) => {
          return item.data.checked === true;
        })
        .map((item) => item.data);
      const names = list.map((item) => item.memberName ?? item.memberId);
      alertRef.current.alertWithInit({
        message: tr('_uikit_group_alert_del_member_title', names.join(',')),
        buttons: [
          {
            text: 'cancel',
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: 'confirm',
            isPreferred: true,
            onPress: () => {
              alertRef.current.close?.();
              onDelParticipant?.(list);
            },
          },
        ],
      });
    }
  }, [dataRef, onDelParticipant, participantType, tr]);

  const addDataToUI = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const groupMember = im.getGroupMember({
        groupId,
        userId: memberId,
      });
      if (groupMember) {
        dataRef.current.push({
          id: groupMember.memberId,
          data: groupMember,
        });
      } else {
        dataRef.current.push({
          id: memberId,
          data: {
            memberId: memberId,
            memberName: memberId,
          },
        });
      }
      refreshToUI();
    }
  };
  const removeDataToUI = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const index = dataRef.current.findIndex((item) => item.id === memberId);
      if (index !== -1) {
        dataRef.current.splice(index, 1);
      }
      refreshToUI();
    }
  };

  const chatListenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (_params: { groupId: string; groupName?: string }) => {
      propsOnKicked?.(groupId);
    },
    onMemberJoined: (params: { groupId: string; member: string }) => {
      addDataToUI(params.groupId, params.member);
    },
    onMemberExited: (params: { groupId: string; member: string }) => {
      removeDataToUI(params.groupId, params.member);
      if (params.member === im.userId) {
        return;
      }
      setParticipantCount((prev) => prev - 1);
    },
  });
  useChatListener(chatListenerRef.current);

  React.useEffect(() => {
    const uiListener: UIGroupParticipantListListener = {
      onUpdatedEvent: (_data) => {},
      onDeletedEvent: (_data) => {},
      onAddedEvent: (data) => {
        if (data.memberId === im.userId) {
          return;
        }
        setParticipantCount((prev) => prev + 1);
      },
      onRequestRefreshEvent: (id) => {
        if (id === groupId) {
          refreshToUI();
        }
      },
      onRequestReloadEvent: (id) => {
        if (id === groupId) {
          init();
        }
      },
      type: UIListenerType.GroupParticipant,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [groupId, im, init, refreshToUI]);

  React.useEffect(() => {
    init();
  }, [init]);

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressedCallback,
    onCheckClicked: onCheckClickedCallback,
    participantCount: participantCount,
    onClickedAddParticipant: onClickedAddParticipantCallback,
    onClickedDelParticipant: onClickedDelParticipantCallback,
    deleteCount,
    onDelParticipant: onDelParticipantCallback,
    alertRef,
    menuRef,
    onRequestCloseMenu: closeMenu,
    ListItemRender: ListItemRenderRef.current,
    groupId,
    ownerId,
  };
}
