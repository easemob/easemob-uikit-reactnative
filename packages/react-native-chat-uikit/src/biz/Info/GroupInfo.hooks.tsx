import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { GroupInfoProps } from './types';

export function useGroupInfo(props: GroupInfoProps) {
  const {
    groupId,
    ownerId,
    groupName: propsGroupName,
    groupAvatar: propsGroupAvatar,
    groupDescription: propsGroupDescription,
    doNotDisturb: propsDoNotDisturb,
    onClearChat: propsOnClearChat,
    onGroupName: propsOnGroupName,
    onGroupMyRemark: propsOnGroupMyRemark,
    onGroupDescription: propsOnGroupDescription,
    onCopyId: propsOnCopyId,
    onParticipant: propsOnParticipant,
    onClickedChangeGroupOwner,
    onGroupDestroy,
    onGroupQuit,
    onGroupUpdateMyRemark,
  } = props;
  const im = useChatContext();
  const { tr } = useI18nContext();
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const ownerIdRef = React.useRef('');
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [groupName, setGroupName] = React.useState(propsGroupName);
  const [groupAvatar, setGroupAvatar] = React.useState(propsGroupAvatar);
  const [groupDescription, setGroupDescription] = React.useState(
    propsGroupDescription
  );
  const [groupMemberCount, setGroupMemberCount] = React.useState(0);
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          im.getGroupInfoFromServer({
            groupId,
            onResult: (value) => {
              ownerId;
              const { isOk } = value;
              if (isOk === true && value.value) {
                setGroupDescription(value.value?.description);
                setGroupName(value.value?.groupName);
                setGroupAvatar(value.value.groupAvatar);
                setGroupMemberCount(value.value.memberCount ?? 0);
                ownerIdRef.current = value.value.owner;
              }
            },
          });
        }
      },
      [im, groupId, ownerId]
    )
  );
  const onDoNotDisturb = (value: boolean) => {
    im.setConversationSilentMode({
      convId: groupId,
      convType: ChatConversationType.GroupChat,
      doNotDisturb: value,
    })
      .then(() => {
        setDoNotDisturb(value);
      })
      .catch((e) => {
        im.sendError({ error: e });
      });
  };
  const onClearChat = () => {
    if (propsOnClearChat) {
      propsOnClearChat();
      return;
    }
    alertRef.current.alertWithInit({
      title: tr('clear_chat'),
      message: tr('clear_chat_confirm'),
      buttons: [
        {
          text: tr('Cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('Confirm'),
          isPreferred: true,
          onPress: () => {
            alertRef.current.close();
            im.removeConversation({ convId: groupId })
              .then(() => {})
              .catch((e) => {
                im.sendError({ error: e });
              });
          },
        },
      ],
    });
  };
  const onGroupName = () => {
    if (propsOnGroupName) {
      propsOnGroupName(groupId);
      return;
    }
    alertRef.current.alertWithInit({
      title: tr('group_name'),
      message: tr('group_name_confirm'),
      supportInput: true,
      supportInputStatistics: true,
      inputMaxCount: 200,
      buttons: [
        {
          text: tr('Cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('Confirm'),
          isPreferred: true,
          onPress: (text) => {
            alertRef.current.close();
            if (text) {
              im.setGroupName({
                groupId,
                groupNewName: text,
                onResult: () => {
                  setGroupName(text);
                },
              });
            }
          },
        },
      ],
    });
  };
  const onGroupAvatar = (newGroupAvatar: string) => {
    if (propsOnGroupName) {
      propsOnGroupName(groupId);
      return;
    }
    im.getGroupInfo({
      groupId,
      onResult: (value) => {
        let ext = value.value?.options?.ext;
        try {
          if (ext) {
            ext = JSON.parse(ext);
          }
        } catch (error) {}
        im.setGroupAvatar({
          groupId,
          groupAvatar: newGroupAvatar,
          ext: typeof ext === 'object' ? ext : {},
          onResult: () => {
            setGroupAvatar(newGroupAvatar);
          },
        });
      },
    });
  };
  const onGroupDescription = () => {
    if (propsOnGroupDescription) {
      propsOnGroupDescription(groupId);
      return;
    }
    alertRef.current.alertWithInit({
      title: tr('group_description'),
      message: tr('group_description_confirm'),
      supportInput: true,
      supportInputStatistics: true,
      inputMaxCount: 200,
      buttons: [
        {
          text: tr('Cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('Confirm'),
          isPreferred: true,
          onPress: (text) => {
            alertRef.current.close();
            if (text) {
              im.setGroupDescription({
                groupId,
                groupDescription: text,
                onResult: () => {
                  setGroupDescription(text);
                },
              });
            }
          },
        },
      ],
    });
  };
  const onGroupMyRemark = () => {
    if (propsOnGroupMyRemark) {
      propsOnGroupMyRemark(groupId);
      return;
    }
    alertRef.current.alertWithInit({
      title: tr('my_remark'),
      message: tr('my_remark_confirm'),
      supportInput: true,
      supportInputStatistics: true,
      inputMaxCount: 200,
      // isSaveInput: true,
      buttons: [
        {
          text: tr('Cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('Confirm'),
          isPreferred: true,
          onPress: (text) => {
            alertRef.current.close();
            if (text) {
              if (text.trim().length === 0) {
                return;
              }
              if (im.userId === undefined) {
                return;
              }
              im.setGroupMyRemark({
                groupId,
                memberId: im.userId,
                groupMyRemark: text,
                onResult: () => {
                  onGroupUpdateMyRemark?.(groupId);
                },
              });
            }
          },
        },
      ],
    });
  };

  const onCopyId = () => {
    if (propsOnCopyId) {
      propsOnCopyId(groupId);
      return;
    }
    Services.cbs.setString(groupId);
    toastRef.current.show({
      message: tr('copy_success'),
    });
  };

  const onParticipant = () => {
    if (propsOnParticipant) {
      propsOnParticipant(groupId);
      return;
    }
  };

  const onRequestModalClose = () => {
    menuRef.current?.startHide?.();
  };

  const onMoreMenu = () => {
    if (im.userId !== ownerIdRef.current) {
      menuRef.current.startShowWithProps({
        onRequestModalClose: onRequestModalClose,
        hasCancel: true,
        layoutType: 'center',
        initItems: [
          {
            name: tr('quit_group'),
            isHigh: true,
            onClicked: () => {
              menuRef.current.startHide(() => {
                alertRef.current.alertWithInit({
                  title: tr('quit_group'),
                  message: tr('quit_group_confirm'),
                  buttons: [
                    {
                      text: tr('cancel'),
                      onPress: () => {
                        alertRef.current.close();
                      },
                    },
                    {
                      text: tr('Quit'),
                      isPreferred: true,
                      onPress: () => {
                        alertRef.current.close();
                        im.quitGroup({
                          groupId,
                          onResult: () => {
                            onGroupQuit?.(groupId);
                          },
                        });
                      },
                    },
                  ],
                });
              });
            },
          },
        ],
      });
    } else {
      menuRef.current.startShowWithProps({
        onRequestModalClose: onRequestModalClose,
        hasCancel: true,
        layoutType: 'center',
        initItems: [
          {
            name: tr('change_group_owner'),
            isHigh: false,
            onClicked: () => {
              menuRef.current.startHide(() => {
                onClickedChangeGroupOwner?.(groupId, ownerIdRef.current);
              });
            },
          },
          {
            name: tr('destroy_group'),
            isHigh: true,
            onClicked: () => {
              menuRef.current.startHide(() => {
                alertRef.current.alertWithInit({
                  title: tr('confirm destroy group?'),
                  message: tr('confirm group and remove message'),
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
                        im.destroyGroup({
                          groupId,
                          onResult: () => {
                            onGroupDestroy?.(groupId);
                          },
                        });
                      },
                    },
                  ],
                });
              });
            },
          },
        ],
      });
    }
  };

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    groupName,
    onGroupName,
    groupAvatar,
    onGroupAvatar,
    groupDescription,
    onGroupDescription,
    onGroupMyRemark,
    alertRef,
    toastRef,
    onCopyId,
    onParticipant,
    onRequestModalClose,
    menuRef,
    onMore: onMoreMenu,
    groupMemberCount,
  };
}
