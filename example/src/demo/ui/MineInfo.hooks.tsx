import * as React from 'react';

import type { ChatPresence } from '../../rename.uikit';
import {
  type AlertRef,
  type BottomSheetNameMenuRef,
  type ChatServiceListener,
  PresenceUtil,
  Services,
  type SimpleToastRef,
  useChatContext,
  useChatListener,
  useConfigContext,
  useI18nContext,
  useLifecycle,
  useMineInfoActions,
  useThemeContext,
} from '../../rename.uikit';
import { RestApi } from '../common/rest.api';
import { useAutoLogin } from '../hooks';
import type { CommonInfoProps, MineInfoProps, UserState } from './types';

export function useMineInfo(props: MineInfoProps) {
  const {
    userId,
    userName: propsUserName,
    userAvatar: propsUserAvatar,
    doNotDisturb: propsDoNotDisturb,
    onClearChat: propsOnClearChat,
    onClickedLogout: propsOnClickedLogout,
    onClickedCommon: propsOnClickedCommon,
    onClickedMessageNotification: propsOnClickedMessageNotification,
    onClickedPrivacy: propsOnClickedPrivacy,
    onClickedPersonInfo: propsOnClickedPersonInfo,
    onClickedAbout: propsOnClickedAbout,
    // onDestroyAccount: propsOnDestroyAccount,
  } = props;
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, setUserName] = React.useState(
    propsUserName && propsUserName.length > 0 ? propsUserName : undefined
  );
  const [userAvatar, setUserAvatar] = React.useState(propsUserAvatar);
  const [userState, setUserState] = React.useState<UserState>('offline');
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { onShowMineInfoActions } = useMineInfoActions({ menuRef, alertRef });
  const { enablePresence } = useConfigContext();
  const { style } = useThemeContext();
  const { currentLanguage } = useI18nContext();
  const [value, onValueChange] = React.useState(
    style === 'light' ? false : true
  );
  const [language, setLanguage] = React.useState<boolean>(
    currentLanguage() === 'en' ? true : false
  );
  const im = useChatContext();
  const { tr } = useI18nContext();
  const { getSelfInfo } = useAutoLogin();

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          if (im.userId) {
            im.getUserInfo({
              userId: im.userId,
              onResult: (res) => {
                if (res.isOk && res.value) {
                  im.setUser({ users: [res.value] });
                  setUserName(
                    res.value.userName && res.value.userName.length > 0
                      ? res.value.userName
                      : undefined
                  );
                  setUserAvatar(res.value.avatarURL);

                  im.fetchPresence({
                    userIds: [res.value.userId],
                    onResult: (res) => {
                      if (res.isOk && res.value) {
                        setUserState(res.value.get(im.userId!) ?? 'offline');
                      }
                    },
                  });
                }
              },
            });
          }
        }
      },
      [im]
    )
  );
  const onDoNotDisturb = (value: boolean) => {
    im.setConversationSilentMode({
      convId: userId,
      convType: 0,
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
    im.removeConversation({ convId: userId })
      .then(() => {
        propsOnClearChat?.();
      })
      .catch((e) => {
        im.sendError({ error: e });
      });
  };

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onClickedState = React.useCallback(() => {
    onShowMineInfoActions();
  }, [onShowMineInfoActions]);

  const onClickedLogout = React.useCallback(() => {
    propsOnClickedLogout?.();
  }, [propsOnClickedLogout]);

  const onClickedCommon = React.useCallback(() => {
    propsOnClickedCommon?.();
  }, [propsOnClickedCommon]);

  const onClickedMessageNotification = React.useCallback(() => {
    propsOnClickedMessageNotification?.();
  }, [propsOnClickedMessageNotification]);

  const onClickedPrivacy = React.useCallback(() => {
    propsOnClickedPrivacy?.();
  }, [propsOnClickedPrivacy]);

  const onClickedPersonInfo = React.useCallback(() => {
    propsOnClickedPersonInfo?.();
  }, [propsOnClickedPersonInfo]);

  const onClickedAbout = React.useCallback(() => {
    propsOnClickedAbout?.();
  }, [propsOnClickedAbout]);

  const onClickedDestroyAccount = React.useCallback(() => {
    getSelfInfo().then(async (res) => {
      if (res?.id && res.token) {
        const ret = await RestApi.requestDestroyAccount({
          phone: res.phone,
          userToken: res.token,
        });
        if (ret.isOk) {
          // propsOnDestroyAccount?.();
        }
      }
    });
  }, [getSelfInfo]);

  const onCopyId = React.useCallback(() => {
    Services.cbs.setString(userId);
    toastRef.current.show({
      message: tr('copy_success'),
    });
  }, [tr, userId]);

  const listener = React.useMemo(() => {
    return {
      onPresenceStatusChanged: (list: ChatPresence[]) => {
        if (list && list.length > 0) {
          const presence = list[0];
          if (presence?.publisher === userId) {
            setUserState(PresenceUtil.convertFromProtocol(presence));
          }
        }
      },
      onFinished: (params) => {
        if (params.event === 'updateSelfInfo') {
          const ret = im.user(im.userId);
          if (ret && ret.avatarURL && ret.avatarURL.length > 0) {
            setUserAvatar(ret.avatarURL);
          }
          if (ret && ret.userName && ret.userName.length > 0) {
            setUserName(ret.userName);
          }
        }
      },
    } as ChatServiceListener;
  }, [im, userId]);
  useChatListener(listener);

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    userName,
    userAvatar,
    userId,
    menuRef,
    onRequestCloseMenu,
    alertRef,
    toastRef,
    onClickedState,
    onClickedLogout,
    onClickedCommon,
    onClickedMessageNotification,
    onClickedPrivacy,
    userState,
    value,
    onValueChange,
    language,
    setLanguage,
    onClickedPersonInfo,
    onClickedAbout,
    enablePresence,
    onCopyId,
    onClickedDestroyAccount,
  };
}

export function useCommonInfo(props: CommonInfoProps) {
  const {} = props;
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { style } = useThemeContext();
  const { currentLanguage } = useI18nContext();
  const [stateValue, onStateValueChange] = React.useState(false);
  const [groupValue, onGroupValueChange] = React.useState(false);
  const [themeValue, onThemeValueChange] = React.useState(
    style === 'light' ? false : true
  );
  const [languageValue, onLanguageValueChange] = React.useState(
    currentLanguage() === 'en' ? true : false
  );
  const onClickedInputState = React.useCallback(() => {}, []);
  const onRequestCloseMenu = React.useCallback(() => {
    menuRef.current?.startHide?.();
  }, []);
  const onClickedAutoAcceptGroupInvite = React.useCallback(() => {}, []);
  const onClickedTheme = React.useCallback(() => {
    // todo: change theme
  }, []);

  const onClickedLanguage = React.useCallback(() => {
    // todo: change language
  }, []);
  return {
    menuRef,
    alertRef,
    toastRef,
    onClickedInputState,
    stateValue,
    onStateValueChange,
    onRequestCloseMenu,
    onClickedAutoAcceptGroupInvite,
    groupValue,
    onGroupValueChange,
    onClickedTheme,
    onClickedLanguage,
    themeValue,
    onThemeValueChange,
    languageValue,
    onLanguageValueChange,
  };
}
