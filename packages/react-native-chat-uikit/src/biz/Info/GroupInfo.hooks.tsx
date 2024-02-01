import * as React from 'react';
import {
  ChatConversationType,
  ChatMultiDeviceEvent,
} from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  UIConversationListListener,
  UIGroupListListener,
  UIGroupParticipantListListener,
  UIListenerType,
  useChatContext,
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
    onDoNotDisturb: propsOnDoNotDisturb,
    onClearChat: propsOnClearChat,
    onGroupName: propsOnGroupName,
    onGroupMyRemark: propsOnGroupMyRemark,
    onGroupDescription: propsOnGroupDescription,
    onCopyId: propsOnCopyId,
    onParticipant: propsOnParticipant,
    onClickedChangeGroupOwner,
    onGroupDestroy,
    onGroupQuit,
    onInitMenu,
    onGroupKicked,
    onSendMessage: propsOnSendMessage,
    onAudioCall: propsOnAudioCall,
    onVideoCall: propsOnVideoCall,
    onClickedNavigationBarButton,
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

  const init = React.useCallback(() => {
    im.getGroupInfoFromServer({
      groupId,
      onResult: (value) => {
        ownerId;
        const { isOk } = value;
        if (isOk === true && value.value) {
          // todo: useReducer
          ownerIdRef.current = value.value.owner;
          setGroupDescription(value.value?.description);
          setGroupName(value.value?.groupName);
          setGroupAvatar(value.value.groupAvatar);
          setGroupMemberCount(value.value.memberCount ?? 0);
          setGroupMyRemark(value.value?.myRemark);
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
          setDoNotDisturb(result.doNotDisturb ?? false);
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
  }, [groupId, im, ownerId]);

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          init();
        }
      },
      [init]
    )
  );

  const quitGroup = React.useCallback(() => {
    im.quitGroup({ groupId });
  }, [groupId, im]);
  const destroyGroup = React.useCallback(() => {
    im.destroyGroup({ groupId });
  }, [groupId, im]);

  const { onShowGroupInfoActions } = useGroupInfoActions({
    menuRef,
    alertRef,
    onQuitGroup: quitGroup,
    onDestroyGroup: destroyGroup,
    onClickedChangeGroupOwner,
    onInit: onInitMenu,
  });

  const doNotDisturbCallback = (value: boolean) => {
    if (propsOnDoNotDisturb) {
      propsOnDoNotDisturb(value);
      return;
    }
    im.setConversationSilentMode({
      convId: groupId,
      convType: ChatConversationType.GroupChat,
      doNotDisturb: value,
    });
  };
  const onClearConversation = () => {
    if (propsOnClearChat) {
      propsOnClearChat();
      return;
    }
    alertRef.current.alertWithInit({
      title: tr('_uikit_info_alert_clear_chat_title'),
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
            alertRef.current.close(() => {
              im.removeConversationAllMessages({
                convId: groupId,
                convType: 1,
              });
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
            alertRef.current.close(() => {
              if (text) {
                im.setGroupName({
                  groupId,
                  groupNewName: text,
                });
              }
            });
          },
        },
      ],
    });
  };
  const onGroupAvatar = (_newGroupAvatar: string) => {
    if (propsOnGroupName) {
      propsOnGroupName(groupId, groupAvatar);
      return;
    }
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
            alertRef.current.close(() => {
              if (text) {
                im.setGroupDescription({
                  groupId,
                  groupDescription: text,
                });
              }
            });
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
            alertRef.current.close(() => {
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
                });
              }
            });
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

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onMoreMenu = () => {
    if (onClickedNavigationBarButton) {
      onClickedNavigationBarButton();
    } else {
      onShowGroupInfoActions(im.userId ?? '', ownerIdRef.current, groupId);
    }
  };

  const onSendMessage = () => {
    if (propsOnSendMessage) {
      propsOnSendMessage(groupId);
    }
  };

  const onAudioCall = () => {
    if (propsOnAudioCall) {
      propsOnAudioCall(groupId);
    }
  };

  const onVideoCall = () => {
    if (propsOnVideoCall) {
      propsOnVideoCall(groupId);
    }
  };

  React.useEffect(() => {
    const listener: ChatServiceListener = {
      onDestroyed: (params: {
        groupId: string;
        groupName?: string | undefined;
      }) => {
        onGroupDestroy?.(params.groupId);
      },
      onMemberExited: (params: { groupId: string; member: string }) => {
        if (params.member === im.userId) {
          onGroupQuit?.(params.groupId);
        } else {
          setGroupMemberCount((prev) => prev - 1);
        }
      },
      onMemberRemoved: (params: {
        groupId: string;
        groupName?: string | undefined;
      }) => {
        onGroupKicked?.(params.groupId);
      },
      onDetailChanged: (group): void => {
        if (group.groupId === groupId) {
          setGroupName((prev) => {
            if (prev === group.groupName) {
              return prev;
            }
            return group.groupName;
          });
          setGroupDescription((prev) => {
            if (prev === group.description) {
              return prev;
            }
            return group.description;
          });
        }
      },
      onOwnerChanged: (params: {
        groupId: string;
        newOwner: string;
        oldOwner: string;
      }) => {
        if (params.groupId === groupId) {
          if (im.userId === params.newOwner) {
            ownerIdRef.current = params.newOwner;
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        }
      },
      onGroupEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        _usernames?: Array<string>
      ): void => {
        if (event === ChatMultiDeviceEvent.GROUP_ASSIGN_OWNER) {
          if (target === groupId) {
            if (im.userId === target) {
              ownerIdRef.current = target;
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          }
        }
      },
    };
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [groupId, im, init, onGroupDestroy, onGroupKicked, onGroupQuit]);

  React.useEffect(() => {
    const listener: UIConversationListListener = {
      onUpdatedEvent: (data) => {
        if (data.convId === groupId) {
          setDoNotDisturb(data.doNotDisturb ?? false);
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [groupId, im]);

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onUpdatedEvent: (data) => {
        if (data.groupId === groupId) {
          setGroupName((prev) => {
            if (prev === data.groupName) {
              return prev;
            }
            return data.groupName;
          });
          setGroupDescription((prev) => {
            if (prev === data.description) {
              return prev;
            }
            return data.description;
          });
          if (data.owner !== ownerIdRef.current) {
            ownerIdRef.current = data.owner;
            setIsOwner(im.userId === data.owner);
          }
        }
      },
      onDeletedEvent: (data) => {
        if (data.groupId === groupId) {
          onGroupQuit?.(data.groupId);
        }
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [groupId, im, onGroupQuit]);

  React.useEffect(() => {
    const uiListener: UIGroupParticipantListListener = {
      onUpdatedEvent: (_data) => {},
      onDeletedEvent: (_data) => {},
      onAddedEvent: (data) => {
        if (data.memberId === im.userId) {
          return;
        }
        setGroupMemberCount((prev) => prev + 1);
      },
      type: UIListenerType.GroupParticipant,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [groupId, im, onGroupQuit]);

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
          });
        },
        setGroupDescription: (groupId: string, desc?: string) => {
          if (desc === undefined || desc === groupDescription) {
            return;
          }
          im.setGroupDescription({
            groupId,
            groupDescription: desc,
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
          });
        },
      };
    },
    [groupDescription, groupMyRemark, groupName, im]
  );

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb: doNotDisturbCallback,
    onClearChat: onClearConversation,
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
    onRequestCloseMenu,
    menuRef,
    onMore: onMoreMenu,
    groupMemberCount,
    isOwner,
    tr,
    onAudioCall,
    onVideoCall,
    onSendMessage,
  };
}
