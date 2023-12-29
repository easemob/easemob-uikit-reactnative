import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  GroupModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useGroupInfoActions } from '../hooks/useGroupInfoActions';
import type { GroupInfoProps, GroupInfoRef } from './types';

export function useGroupInfo(
  props: GroupInfoProps,
  ref?: React.ForwardedRef<GroupInfoRef>
) {
  const {
    groupId,
    ownerId,
    groupName: propsGroupName,
    groupAvatar: propsGroupAvatar,
    groupDescription: propsGroupDescription,
    groupMyRemark: propsGroupMyRemark,
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
  const [groupMyRemark, setGroupMyRemark] = React.useState(propsGroupMyRemark);
  const [groupMemberCount, setGroupMemberCount] = React.useState(0);
  const [isOwner, setIsOwner] = React.useState(false);
  const { onShowGroupInfoActions } = useGroupInfoActions({
    menuRef,
    alertRef,
    onGroupQuit,
    onClickedChangeGroupOwner,
    onGroupDestroy,
  });
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
                setGroupMyRemark(value.value?.myRemark);
                ownerIdRef.current = value.value.owner;
                setIsOwner(im.userId === value.value.owner);
              }
            },
          });
          im.getConversation({
            convId: groupId,
            convType: ChatConversationType.GroupChat,
            createIfNotExist: true,
            fromNative: true,
          })
            .then((result) => {
              if (result) {
                setDoNotDisturb(result.doNotDisturb);
              }
            })
            .catch();
          if (im.userId) {
            im.getGroupMyRemark({
              groupId,
              memberId: im.userId,
              onResult: (value) => {
                if (value.isOk && value.value) {
                  setGroupMyRemark(value.value);
                }
              },
            });
          }
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
      message: tr('_uikit_info_alert_clear_chat_title'),
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('confirm'),
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
      propsOnGroupName(groupId, groupName);
      return;
    }
    alertRef.current.alertWithInit({
      message: tr('_uikit_info_alert_modify_group_name'),
      supportInput: true,
      supportInputStatistics: true,
      inputMaxCount: 200,
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('confirm'),
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
      propsOnGroupName(groupId, groupAvatar);
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
      propsOnGroupDescription(groupId, groupDescription);
      return;
    }
    alertRef.current.alertWithInit({
      message: tr('_uikit_info_alert_modify_group_desc'),
      supportInput: true,
      supportInputStatistics: true,
      inputMaxCount: 200,
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('confirm'),
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
      propsOnGroupMyRemark(groupId, groupMyRemark);
      return;
    }
    alertRef.current.alertWithInit({
      message: tr('_uikit_info_alert_modify_group_remark'),
      supportInput: true,
      supportInputStatistics: true,
      inputMaxCount: 200,
      // isSaveInput: true,
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('confirm'),
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
                  // todo:
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
    onShowGroupInfoActions(im.userId ?? '', ownerIdRef.current, groupId);
  };

  const listener = React.useMemo(() => {
    return {
      onGroupInfoChanged: (group: GroupModel) => {
        if (group.groupId === groupId) {
          setGroupName(group.groupName);
          setGroupAvatar(group.groupAvatar);
          setGroupDescription(group.description);
          setGroupMemberCount(group.memberCount ?? 0);
        }
      },
    } as ChatServiceListener;
  }, [groupId]);
  useChatListener(listener);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        setGroupName: (groupId: string, groupNewName?: string) => {
          if (groupNewName === undefined || groupName === groupNewName) {
            return;
          }
          im.setGroupName({
            groupId,
            groupNewName: groupNewName,
            onResult: () => {},
          });
        },
        setGroupDescription: (groupId: string, desc?: string) => {
          if (desc === undefined || desc === groupDescription) {
            return;
          }
          im.setGroupDescription({
            groupId,
            groupDescription: desc,
            onResult: () => {},
          });
        },
        setGroupMyRemark: (groupId: string, remark?: string) => {
          if (remark === undefined || remark === groupMyRemark) {
            return;
          }
          im.setGroupMyRemark({
            groupId,
            memberId: im.userId ?? '',
            groupMyRemark: remark,
            onResult: () => {},
          });
        },
      };
    },
    [groupDescription, groupMyRemark, groupName, im]
  );

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
    isOwner,
    tr,
  };
}
