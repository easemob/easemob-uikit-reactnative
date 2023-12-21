import * as React from 'react';

import {
  ChatServiceListener,
  GroupParticipantModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type {
  GroupParticipantListItemProps,
  UseGroupParticipantListProps,
} from './types';

export function useGroupParticipantList(
  props: UseGroupParticipantListProps
): UseFlatListReturn<GroupParticipantListItemProps> &
  Omit<
    ListItemActions<GroupParticipantModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    participantCount: number;
    onCheckClicked?: ((data?: GroupParticipantModel) => void) | undefined;
    onClickedAddParticipant?: () => void;
    onClickedDelParticipant?: () => void;
    onDelParticipant?: () => void;
    deleteCount: number;
    alertRef: React.MutableRefObject<AlertRef>;
  } {
  const {
    onClicked,
    testMode,
    groupId,
    participantType,
    onClickedAddParticipant,
    onClickedDelParticipant,
    onDelParticipant,
    onChangeOwner,
  } = props;
  const flatListProps = useFlatList<GroupParticipantListItemProps>({
    onInit: () => init(),
  });
  const { setData, dataRef } = flatListProps;
  const alertRef = React.useRef<AlertRef>({} as any);
  const [participantCount, setParticipantCount] = React.useState(0);
  const [deleteCount, setDeleteCount] = React.useState(0);

  const im = useChatContext();
  const { tr } = useI18nContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      if (participantType === 'change-owner') {
        alertRef.current.alertWithInit({
          message: tr('Transfer group owner to xx'),
          buttons: [
            {
              text: tr('Cancel'),
              onPress: () => {
                alertRef.current.close?.();
              },
            },
            {
              text: tr('Confirm'),
              isPreferred: true,
              onPress: () => {
                alertRef.current.close?.();
                onChangeOwner?.(data);
              },
            },
          ],
        });
      } else {
        if (onClicked) {
          onClicked(data);
        }
      }
    },
    [onChangeOwner, onClicked, participantType, tr]
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

  const onSetData = React.useCallback(() => {
    calculateDeleteCount();
    const uniqueList = dataRef.current.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.data.id === item.data.id)
    );
    dataRef.current = uniqueList;
    setData([...dataRef.current]);
  }, [calculateDeleteCount, dataRef, setData]);

  const onCheckClickedCallback = React.useCallback(
    (data?: GroupParticipantModel) => {
      if (participantType === 'delete') {
        if (data?.checked !== undefined) {
          im.setGroupMemberState({
            groupId,
            userId: data.id,
            checked: !data.checked,
            onResult: () => {},
          });
          dataRef.current = dataRef.current.map((item) => {
            if (item) {
              if (item.id === data.id) {
                return {
                  ...item,
                  data: { ...item.data, checked: !data.checked },
                };
              }
            }
            return item;
          });
          onSetData();
        }
      }
    },
    [dataRef, groupId, im, onSetData, participantType]
  );

  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      im.getGroupAllMembers({
        groupId: groupId,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                if (participantType === 'delete') {
                  return {
                    id: item.id,
                    data: {
                      ...item,
                      checked:
                        item.checked !== undefined ? item.checked : false,
                    },
                  } as GroupParticipantListItemProps;
                } else {
                  return {
                    id: item.id,
                    data: { ...item, checked: undefined },
                  } as GroupParticipantListItemProps;
                }
              });
              if (participantType === 'change-owner') {
                dataRef.current = dataRef.current.filter((item) => {
                  return item.data.id !== im.userId;
                });
              } else if (participantType === 'delete') {
                dataRef.current = dataRef.current.filter((item) => {
                  return item.data.id !== im.userId;
                });
              } else if (participantType === 'mention') {
                dataRef.current.unshift({
                  id: 'All',
                  data: {
                    id: 'All',
                    name: 'All',
                  } as GroupParticipantModel,
                });
                dataRef.current = dataRef.current.filter((item) => {
                  return item.data.id !== im.userId;
                });
              }
              onSetData();
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
  };

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
      alertRef.current.alertWithInit({
        message: 'Confirm to delete selected members?',
        buttons: [
          {
            text: 'Cancel',
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: 'Confirm',
            isPreferred: true,
            onPress: () => {
              alertRef.current.close?.();
              onDelParticipant?.(list);
            },
          },
        ],
      });
    }
  }, [dataRef, onDelParticipant, participantType]);

  const addData = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const groupMember = im.getGroupMember({
        groupId,
        userId: memberId,
      });
      if (groupMember) {
        dataRef.current.push({
          id: groupMember.id,
          data: groupMember,
        });
      } else {
        dataRef.current.push({
          id: memberId,
          data: {
            id: memberId,
            name: memberId,
          },
        });
      }
      onSetData();
    }
  };
  const removeData = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const index = dataRef.current.findIndex((item) => item.id === memberId);
      if (index !== -1) {
        dataRef.current.splice(index, 1);
      }
      onSetData();
    }
  };

  const chatListenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (_params: { groupId: string; groupName?: string }) => {
      // todo: goto back last page.
    },
    onMemberJoined: (params: { groupId: string; member: string }) => {
      addData(params.groupId, params.member);
    },
    onMemberExited: (params: { groupId: string; member: string }) => {
      removeData(params.groupId, params.member);
    },
  });
  useChatListener(chatListenerRef.current);

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
    onCheckClicked: onCheckClickedCallback,
    participantCount: participantCount,
    onClickedAddParticipant: onClickedAddParticipantCallback,
    onClickedDelParticipant: onClickedDelParticipantCallback,
    deleteCount,
    onDelParticipant: onDelParticipantCallback,
    alertRef,
  };
}
