import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';

import {
  AsyncStorageBasic,
  MessageContextMenuStyle,
  MessageInputBarExtensionStyle,
  presetPaletteColors,
  SingletonObjects,
  useForceUpdate,
} from '../../rename.uikit';
import { accountType, appKey as gAppKey } from '../common/const';

export function useGeneralSetting() {
  const {} = useForceUpdate();
  const [appTheme, setAppTheme] = React.useState<boolean | undefined>(
    undefined
  );
  const appThemeRef = React.useRef<boolean | undefined>(undefined);
  const appStyleRef = React.useRef(
    accountType === 'agora' ? 'modern' : 'classic'
  );
  const [appStyle, setAppStyle] = React.useState<string>(appStyleRef.current);
  const [appPrimaryColor, setAppPrimaryColor] = React.useState<number>(
    presetPaletteColors.primary
  );
  const appPrimaryColorRef = React.useRef<number>(presetPaletteColors.primary);
  const [appSecondColor, setAppSecondColor] = React.useState<number>(
    presetPaletteColors.secondary
  );
  const appSecondColorRef = React.useRef<number>(presetPaletteColors.secondary);
  const [appErrorColor, setAppErrorColor] = React.useState<number>(
    presetPaletteColors.error
  );
  const appErrorColorRef = React.useRef<number>(presetPaletteColors.error);
  const [appNeutralColor, setAppNeutralColor] = React.useState<number>(
    presetPaletteColors.neutral
  );
  const appNeutralColorRef = React.useRef<number>(presetPaletteColors.neutral);
  const [appNeutralSColor, setAppNeutralSColor] = React.useState<number>(
    presetPaletteColors.neutralSpecial
  );
  const appNeutralSColorRef = React.useRef<number>(
    presetPaletteColors.neutralSpecial
  );
  const appLanguageRef = React.useRef<string>(
    accountType === 'agora' ? 'en' : 'zh-Hans'
  );
  const [appLanguage, setAppLanguage] = React.useState<string>(
    appLanguageRef.current
  );
  const [appTranslate, setAppTranslate] = React.useState<boolean | undefined>(
    undefined
  );
  const appTranslateRef = React.useRef<boolean | undefined>(undefined);
  const appTranslateLanguageRef = React.useRef<string>(
    accountType === 'agora' ? 'en' : 'zh-Hans'
  );
  const [appTranslateLanguage, setAppTranslateLanguage] =
    React.useState<string>(appTranslateLanguageRef.current);
  const [appThread, setAppThread] = React.useState<boolean | undefined>(
    undefined
  );
  const appThreadRef = React.useRef<boolean | undefined>(undefined);
  const [appReaction, setAppReaction] = React.useState<boolean | undefined>(
    undefined
  );
  const appReactionRef = React.useRef<boolean | undefined>(undefined);
  const [appPresence, setAppPresence] = React.useState<boolean | undefined>(
    undefined
  );
  const appPresenceRef = React.useRef<boolean | undefined>(undefined);
  const [appAv, setAppAv] = React.useState<boolean | undefined>(undefined);
  const appAvRef = React.useRef<boolean | undefined>(undefined);
  const [appNotification, setAppNotification] = React.useState<
    boolean | undefined
  >(undefined);
  const appNotificationRef = React.useRef<boolean | undefined>(undefined);

  const appTypingRef = React.useRef<boolean | undefined>(undefined);
  const [appTyping, setAppTyping] = React.useState<boolean | undefined>(
    undefined
  );

  const appBlockRef = React.useRef<boolean | undefined>(undefined);
  const [appBlock, setAppBlock] = React.useState<boolean | undefined>(
    undefined
  );

  const appMessageContextMenuStyleRef = React.useRef<
    MessageContextMenuStyle | undefined
  >('bottom-sheet');
  const [appMessageContextMenuStyle, setAppMessageContextMenuStyle] =
    React.useState<MessageContextMenuStyle>('bottom-sheet');

  const appMessageInputBarExtensionStyleRef = React.useRef<
    MessageInputBarExtensionStyle | undefined
  >('bottom-sheet');
  const [
    appMessageInputBarExtensionStyle,
    setAppMessageInputBarExtensionStyle,
  ] = React.useState<MessageInputBarExtensionStyle>('bottom-sheet');

  const onSetAppTheme = React.useCallback((value: boolean) => {
    appThemeRef.current = value;
    setAppTheme(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'theme', value: value ? 'dark' : 'light' });
    DeviceEventEmitter.emit('_demo_emit_app_theme', value ? 'dark' : 'light');
  }, []);

  const onSetAppTranslate = React.useCallback((value: boolean) => {
    appTranslateRef.current = value;
    setAppTranslate(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'translate', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit(
      '_demo_emit_app_translate',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppTranslateLanguage = React.useCallback((value: string) => {
    appTranslateLanguageRef.current = value;
    setAppTranslateLanguage(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'translateLanguage', value });
    DeviceEventEmitter.emit('_demo_emit_app_translate_language', value);
  }, []);

  const onSetAppThread = React.useCallback((value: boolean) => {
    appThreadRef.current = value;
    setAppThread(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'thread', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit(
      '_demo_emit_app_thread',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppReaction = React.useCallback((value: boolean) => {
    appReactionRef.current = value;
    setAppReaction(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'reaction', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit(
      '_demo_emit_app_reaction',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppPresence = React.useCallback((value: boolean) => {
    appPresenceRef.current = value;
    setAppPresence(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'presence', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit(
      '_demo_emit_app_presence',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppTyping = React.useCallback((value: boolean) => {
    appTypingRef.current = value;
    setAppTyping(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'typing', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit(
      '_demo_emit_app_typing',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppBlock = React.useCallback((value: boolean) => {
    appBlockRef.current = value;
    setAppBlock(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'block', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit(
      '_demo_emit_app_block',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppAv = React.useCallback((value: boolean) => {
    appAvRef.current = value;
    setAppAv(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'av', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit('_demo_emit_app_av', value ? 'enable' : 'disable');
  }, []);

  const onSetAppNotification = React.useCallback((value: boolean) => {
    appNotificationRef.current = value;
    setAppNotification(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({
      key: 'notification',
      value: value ? 'enable' : 'disable',
    });
    DeviceEventEmitter.emit(
      '_demo_emit_app_notification',
      value ? 'enable' : 'disable'
    );
  }, []);

  const onSetAppStyle = React.useCallback((value: string) => {
    appStyleRef.current = value;
    setAppStyle(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'style', value });
    DeviceEventEmitter.emit('_demo_emit_app_style', value);
  }, []);

  const onSetAppPrimaryColor = React.useCallback((value: number) => {
    appPrimaryColorRef.current = value;
    setAppPrimaryColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'primaryColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_primary_color', value);
  }, []);

  const onSetAppSecondColor = React.useCallback((value: number) => {
    appSecondColorRef.current = value;
    setAppSecondColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'secondColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_second_color', value);
  }, []);

  const onSetAppErrorColor = React.useCallback((value: number) => {
    appErrorColorRef.current = value;
    setAppErrorColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'errorColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_error_color', value);
  }, []);

  const onSetAppNeutralColor = React.useCallback((value: number) => {
    appNeutralColorRef.current = value;
    setAppNeutralColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'neutralColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_neutral_color', value);
  }, []);

  const onSetAppNeutralSColor = React.useCallback((value: number) => {
    appNeutralSColorRef.current = value;
    setAppNeutralSColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'neutralSColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_neutral_s_color', value);
  }, []);

  const onSetAppLanguage = React.useCallback((value: string) => {
    appLanguageRef.current = value;
    setAppLanguage(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'language', value });
    DeviceEventEmitter.emit('_demo_emit_app_language', value);
  }, []);

  const onSetAppMessageContextMenuStyle = React.useCallback(
    (value: MessageContextMenuStyle) => {
      appMessageContextMenuStyleRef.current = value;
      setAppMessageContextMenuStyle(value);
      const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
        appKey: `${gAppKey}/uikit/demo`,
      });
      s.setData({ key: 'messageContextMenuStyle', value });
      DeviceEventEmitter.emit(
        '_demo_emit_app_message_context_menu_style',
        value
      );
    },
    []
  );

  const onSetAppMessageInputBarExtensionStyle = React.useCallback(
    (value: MessageInputBarExtensionStyle) => {
      appMessageInputBarExtensionStyleRef.current = value;
      setAppMessageInputBarExtensionStyle(value);
      const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
        appKey: `${gAppKey}/uikit/demo`,
      });
      s.setData({ key: 'messageInputBarExtensionStyle', value });
      DeviceEventEmitter.emit(
        '_demo_emit_app_message_input_bar_extension_style',
        value
      );
    },
    []
  );

  const initParams = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    const res = await s.getData({ key: 'theme' });
    const res2 = await s.getData({ key: 'style' });
    const res4 = await s.getData({ key: 'language' });
    const res5 = await s.getData({ key: 'primaryColor' });
    const res6 = await s.getData({ key: 'secondColor' });
    const res7 = await s.getData({ key: 'errorColor' });
    const res8 = await s.getData({ key: 'neutralColor' });
    const res9 = await s.getData({ key: 'neutralSColor' });
    const res10 = await s.getData({ key: 'translate' });
    const res11 = await s.getData({ key: 'thread' });
    const res12 = await s.getData({ key: 'reaction' });
    const res13 = await s.getData({ key: 'presence' });
    const res14 = await s.getData({ key: 'av' });
    const res15 = await s.getData({ key: 'notification' });
    const res16 = await s.getData({ key: 'translateLanguage' });
    const res17 = await s.getData({ key: 'typing' });
    const res18 = await s.getData({ key: 'block' });
    const res19 = await s.getData({ key: 'messageContextMenuStyle' });
    const res20 = await s.getData({ key: 'messageInputBarExtensionStyle' });
    return {
      appTheme: res.value ? res.value !== 'light' : false,
      appTranslate: res10.value ? res10.value === 'enable' : true,
      appThread: res11.value ? res11.value === 'enable' : true,
      appReaction: res12.value ? res12.value === 'enable' : true,
      appPresence: res13.value ? res13.value === 'enable' : true,
      appAv: res14.value ? res14.value === 'enable' : true,
      appNotification: res15.value ? res15.value === 'enable' : false,
      appTyping: res17.value ? res17.value === 'enable' : true,
      appBlock: res18.value ? res18.value === 'enable' : true,
      appStyle: res2.value ?? (accountType === 'agora' ? 'modern' : 'classic'),
      appLanguage: res4.value ?? (accountType === 'agora' ? 'en' : 'zh-Hans'),
      appTranslateLanguage:
        res16.value ?? (accountType === 'agora' ? 'en' : 'zh-Hans'),
      appPrimaryColor: res5.value ? +res5.value : presetPaletteColors.primary,
      appSecondColor: res6.value ? +res6.value : presetPaletteColors.secondary,
      appErrorColor: res7.value ? +res7.value : presetPaletteColors.error,
      appNeutralColor: res8.value ? +res8.value : presetPaletteColors.neutral,
      appNeutralSColor: res9.value
        ? +res9.value
        : presetPaletteColors.neutralSpecial,
      appMessageContextMenuStyle: res19.value ? res19.value : 'bottom-sheet',
      appMessageInputBarExtensionStyle: res20.value
        ? res20.value
        : 'bottom-sheet',
    };
  }, []);

  const init = React.useCallback(() => {
    initParams()
      .then((res) => {
        setAppTheme(res.appTheme);
        appThemeRef.current = res.appTheme;
        setAppStyle(res.appStyle);
        appStyleRef.current = res.appStyle;
        setAppLanguage(res.appLanguage);
        appLanguageRef.current = res.appLanguage;
        setAppPrimaryColor(res.appPrimaryColor);
        appPrimaryColorRef.current = res.appPrimaryColor;
        setAppSecondColor(res.appSecondColor);
        appSecondColorRef.current = res.appSecondColor;
        setAppErrorColor(res.appErrorColor);
        appErrorColorRef.current = res.appErrorColor;
        setAppNeutralColor(res.appNeutralColor);
        appNeutralColorRef.current = res.appNeutralColor;
        setAppNeutralSColor(res.appNeutralSColor);
        appNeutralSColorRef.current = res.appNeutralSColor;
        setAppTranslate(res.appTranslate);
        appTranslateRef.current = res.appTranslate;
        setAppTranslateLanguage(res.appTranslateLanguage);
        appTranslateLanguageRef.current = res.appTranslateLanguage;
        setAppThread(res.appThread);
        appThreadRef.current = res.appThread;
        setAppReaction(res.appReaction);
        appReactionRef.current = res.appReaction;
        setAppPresence(res.appPresence);
        appPresenceRef.current = res.appPresence;
        setAppAv(res.appAv);
        appAvRef.current = res.appAv;
        setAppNotification(res.appNotification);
        appNotificationRef.current = res.appNotification;
        setAppTyping(res.appTyping);
        appTypingRef.current = res.appTyping;
        setAppBlock(res.appBlock);
        appBlockRef.current = res.appBlock;
        setAppMessageContextMenuStyle(
          res.appMessageContextMenuStyle as MessageContextMenuStyle
        );
        appMessageContextMenuStyleRef.current =
          res.appMessageContextMenuStyle as MessageContextMenuStyle;
        setAppMessageInputBarExtensionStyle(
          res.appMessageInputBarExtensionStyle as MessageInputBarExtensionStyle
        );
        appMessageInputBarExtensionStyleRef.current =
          res.appMessageInputBarExtensionStyle as MessageInputBarExtensionStyle;
        // updater();
      })
      .catch((e) => {
        console.warn('dev:initParams:', e);
      });
  }, [initParams]);

  React.useEffect(() => {
    init();
  }, [init]);

  return {
    appTheme,
    onSetAppTheme,
    appStyle,
    onSetAppStyle,
    appLanguage,
    onSetAppLanguage,
    initParams,
    updater: init,
    appPrimaryColor,
    onSetAppPrimaryColor,
    appSecondColor,
    onSetAppSecondColor,
    appErrorColor,
    onSetAppErrorColor,
    appNeutralColor,
    onSetAppNeutralColor,
    appNeutralSColor,
    onSetAppNeutralSColor,
    appTranslate,
    onSetAppTranslate,
    appThread,
    onSetAppThread,
    appReaction,
    onSetAppReaction,
    appPresence,
    onSetAppPresence,
    appAv,
    onSetAppAv,
    appNotification,
    onSetAppNotification,
    appTranslateLanguage,
    onSetAppTranslateLanguage,
    appTyping,
    onSetAppTyping,
    appBlock,
    onSetAppBlock,
    appMessageContextMenuStyle,
    onSetAppMessageContextMenuStyle,
    appMessageInputBarExtensionStyle,
    onSetAppMessageInputBarExtensionStyle,
  };
}
