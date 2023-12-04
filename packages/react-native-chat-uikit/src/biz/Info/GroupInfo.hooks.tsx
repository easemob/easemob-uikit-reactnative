import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { GroupInfoProps } from './types';

export function useGroupInfo(props: GroupInfoProps) {
  const {
    groupId,
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
  } = props;
  console.log('test:zuoyu:groupinfo:', props);
  const im = useChatContext();
  const { tr } = useI18nContext();
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [groupName, setGroupName] = React.useState(propsGroupName);
  const [groupAvatar, setGroupAvatar] = React.useState(propsGroupAvatar);
  const [groupDescription, setGroupDescription] = React.useState(
    propsGroupDescription
  );
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          im.getGroupInfo({
            groupId,
            onResult: (value) => {
              const { isOk } = value;
              console.log('test:zuoyu:groupinfo:', value);
              if (isOk === true) {
                setGroupDescription(value.value?.description);
                setGroupName(value.value?.groupName);
                let ext = value.value?.options?.ext;
                try {
                  if (ext) {
                    ext = JSON.parse(ext);
                    setGroupAvatar((ext as any)?.groupAvatar);
                  }
                } catch (error) {}
              }
            },
          });
        }
      },
      [im, groupId]
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
              im.getGroupInfo({
                groupId,
                onResult: (value) => {
                  let ext = value.value?.options?.ext;
                  try {
                    if (ext) {
                      ext = JSON.parse(ext);
                    }
                  } catch (error) {}
                  im.setGroupMyRemark({
                    groupId,
                    groupMyRemark: text,
                    ext: typeof ext === 'object' ? ext : {},
                    onResult: () => {
                      // todo:
                    },
                  });
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
    Clipboard.setString(groupId);
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
    // todo: quit or destroy
    im.getGroupInfo({
      groupId,
      onResult: (value) => {
        if (value.isOk === true && value) {
          if (value.value?.owner === im.userId) {
          }
        }
      },
    });
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
                      // todo: quit or destroy
                      im.quitGroup({ groupId, onResult: () => {} });
                    },
                  },
                ],
              });
            });
          },
        },
      ],
    });
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
  };
}
