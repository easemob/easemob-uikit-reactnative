import * as React from 'react';

import {
  ContactServiceListener,
  UIContactListListener,
  UIConversationListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useContactInfoActions } from '../hooks/useContactInfoActions';
import type { ContactInfoProps, ContactInfoRef } from './types';

export function useContactInfo(
  props: ContactInfoProps,
  ref?: React.ForwardedRef<ContactInfoRef>
) {
  const {
    userId,
    userName: propsUserName,
    userAvatar: propsUserAvatar,
    doNotDisturb: propsDoNotDisturb,
    onDoNotDisturb: propsOnDoNotDisturb,
    onClearChat: propsOnClearChat,
    isContact: propsIsContact,
    onInitMenu,
    onSendMessage: propsOnSendMessage,
    onAudioCall: propsOnAudioCall,
    onVideoCall: propsOnVideoCall,
    onSearch: propsOnSearch,
    onClickedNavigationBarButton,
    onAddContact: propsOnAddContact,
    onCopyId: propsOnCopyId,
    onClickedContactRemark,
    onRequestData,
  } = props;
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, setUserName] = React.useState(propsUserName);
  const [userRemark, setUserRemark] = React.useState(propsUserName);
  const [userAvatar, setUserAvatar] = React.useState(propsUserAvatar);
  const [isContact, setIsContact] = React.useState(propsIsContact);
  const [isSelf, setIsSelf] = React.useState(false);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { onShowContactInfoActions } = useContactInfoActions({
    menuRef,
    alertRef,
    onInit: onInitMenu,
    onRemoveContact: () => {
      im.removeContact({ userId });
      im.removeConversation({ convId: userId });
    },
  });

  const im = useChatContext();
  const { tr } = useI18nContext();

  const addContact = React.useCallback(
    (userId: string) => {
      im.addNewContact({
        userId: userId,
        reason: 'add contact',
      });
    },
    [im]
  );

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          setIsContact(im.isContact({ userId }));
          setIsSelf(im.userId === userId);

          if (im.userId !== userId) {
            im.getConversation({
              convId: userId,
              convType: 0,
              createIfNotExist: true,
            })
              .then((value) => {
                setDoNotDisturb(value?.doNotDisturb ?? false);
              })
              .catch((e) => {
                im.sendError({ error: e });
              });

            if (onRequestData) {
              const ret = onRequestData?.(userId);
              if (ret) {
                if (ret instanceof Promise) {
                  ret
                    .then((res) => {
                      if (res.userName) setUserName(res.userName);
                      if (res.userAvatar) setUserAvatar(res.userAvatar);
                      if (res.remark) setUserRemark(res.remark);
                    })
                    .catch((e) => {
                      console.warn('dev:onRequestData:e:', e);
                    });
                } else {
                  if (ret.userName) setUserName(ret.userName);
                  if (ret.userAvatar) setUserAvatar(ret.userAvatar);
                  if (ret.remark) setUserRemark(ret.remark);
                }
              }
            } else {
              im.getUserInfo({
                userId: userId,
                onResult: (res) => {
                  if (res.isOk === true && res.value) {
                    if (res.value.avatarURL) setUserAvatar(res.value.avatarURL);
                    if (res.value.userName) setUserName(res.value.userName);
                  }
                  im.getContact({
                    userId: userId,
                    onResult: (value) => {
                      if (value) {
                        if (res.value?.avatarURL === undefined) {
                          setUserAvatar(value.value?.userAvatar);
                        }
                        if (res.value?.userName === undefined) {
                          setUserName(value.value?.userName);
                        }
                        setUserRemark(value.value?.remark);
                      }
                    },
                  });
                },
              });
            }
          } else {
            const user = im.user(im.userId);
            setUserAvatar(user?.avatarURL);
            setUserName(user?.userName);
          }
        }
      },
      [im, onRequestData, userId]
    )
  );

  const onDoNotDisturb = (value: boolean) => {
    if (propsOnDoNotDisturb) {
      propsOnDoNotDisturb(value);
      return;
    }
    im.setConversationSilentMode({
      convId: userId,
      convType: 0,
      doNotDisturb: value,
    });
  };
  const onClearChat = () => {
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
              im.removeConversationAllMessages({ convId: userId, convType: 0 });
            });
          },
        },
      ],
    });
  };

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onMoreMenu = () => {
    if (onClickedNavigationBarButton) {
      onClickedNavigationBarButton();
      return;
    }
    onShowContactInfoActions(userId, userName);
  };

  const onSendMessage = () => {
    if (propsOnSendMessage) {
      propsOnSendMessage(userId);
    }
  };

  const onAudioCall = () => {
    if (propsOnAudioCall) {
      propsOnAudioCall?.(userId);
    }
  };

  const onVideoCall = () => {
    if (propsOnVideoCall) {
      propsOnVideoCall?.(userId);
    }
  };

  const onSearch = () => {
    if (propsOnSearch) {
      propsOnSearch?.(userId);
    }
  };

  const onAddContact = () => {
    if (propsOnAddContact) {
      propsOnAddContact(userId);
      return;
    }
    addContact(userId);
  };

  const onCopyId = () => {
    if (propsOnCopyId) {
      propsOnCopyId(userId);
      return;
    }
    Services.cbs.setString(userId);
    toastRef.current.show({
      message: tr('copy_success'),
    });
  };

  const onClickedRemark = () => {
    im.getContact({
      userId,
      onResult: (res) => {
        if (res.isOk === true) {
          onClickedContactRemark?.(userId, res.value?.remark);
        }
      },
    });
  };

  const getNickName = React.useCallback(() => {
    if (userRemark && userRemark.length > 0) {
      return userRemark;
    } else if (userName && userName.length > 0) {
      return userName;
    } else {
      return userId;
    }
  }, [userId, userName, userRemark]);

  React.useEffect(() => {
    const listener: UIConversationListListener = {
      onUpdatedEvent: (data) => {
        if (data.convId === userId) {
          setDoNotDisturb(data.doNotDisturb ?? false);
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [im, userId]);

  React.useEffect(() => {
    const listener: UIContactListListener = {
      onAddedEvent: (data) => {
        if (data.userId === userId) {
          setIsContact(true);
        }
      },
      onDeletedEvent: (data) => {
        if (data.userId === userId) {
          setIsContact(false);
        }
      },
      onUpdatedEvent: (data) => {
        if (data.userId === userId) {
          setUserAvatar(data.userAvatar);
          setUserName(data.userName);
          setUserRemark(data.remark);
        }
      },
      type: UIListenerType.Contact,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [im, userId]);

  React.useEffect(() => {
    const listener: ContactServiceListener = {
      onContactAdded: async (_userId: string) => {
        if (userId === _userId) {
          setIsContact(true);
        }
      },
      onContactDeleted: async (_userId: string) => {
        if (userId === _userId) {
          setIsContact(false);
        }
      },
    };
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im, userId]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        setContactRemark: (userId, remark) => {
          if (remark) im.setContactRemark({ userId, remark });
        },
      };
    },
    [im]
  );

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    userName,
    userRemark,
    userAvatar,
    userId,
    isContact,
    menuRef,
    onRequestCloseMenu,
    onMore: onMoreMenu,
    alertRef,
    toastRef,
    tr,
    isSelf,
    onSendMessage,
    onAudioCall,
    onVideoCall,
    onAddContact,
    onCopyId,
    onClickedRemark,
    getNickName,
    onSearch,
  };
}
