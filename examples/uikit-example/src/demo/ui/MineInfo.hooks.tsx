import * as React from 'react';
import type { ChatPresence } from 'react-native-chat-sdk';
import {
  type AlertRef,
  type BottomSheetNameMenuRef,
  type ChatServiceListener,
  PresenceUtil,
  type SimpleToastRef,
  useChatContext,
  useChatListener,
  useI18nContext,
  useLifecycle,
  useMineInfoActions,
  useThemeContext,
} from 'react-native-chat-uikit';

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
  } = props;
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, setUserName] = React.useState(propsUserName);
  const [userAvatar, setUserAvatar] = React.useState(propsUserAvatar);
  const [userSign, setUserSign] = React.useState<string>();
  const [userState, setUserState] = React.useState<UserState>('offline');
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { onShowMineInfoActions } = useMineInfoActions({ menuRef, alertRef });
  const { style } = useThemeContext();
  const { currentLanguage } = useI18nContext();
  const [value, onValueChange] = React.useState(
    style === 'light' ? false : true
  );
  const [language, setLanguage] = React.useState<boolean>(
    currentLanguage() === 'en' ? true : false
  );
  const im = useChatContext();

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          const self = im.user(userId);
          if (self) {
            setUserName(self.userName);
            setUserSign('self.sign');
            setUserAvatar(self.avatarURL);
          }
        }
      },
      [im, userId]
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
    } as ChatServiceListener;
  }, [userId]);
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
    userSign,
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
