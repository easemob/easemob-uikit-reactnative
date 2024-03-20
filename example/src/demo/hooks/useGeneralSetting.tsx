import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  AsyncStorageBasic,
  getReleaseArea,
  presetPaletteColors,
  SingletonObjects,
} from 'react-native-chat-uikit';

import { appKey as gAppKey } from '../common/const';

export function useGeneralSetting() {
  const [appTheme, setAppTheme] = React.useState<boolean | undefined>(
    undefined
  );
  const [appStyle, setAppStyle] = React.useState<string>('classic');
  const [appPrimaryColor, setAppPrimaryColor] = React.useState<number>(
    presetPaletteColors.primary
  );
  const [appSecondColor, setAppSecondColor] = React.useState<number>(
    presetPaletteColors.secondary
  );
  const [appErrorColor, setAppErrorColor] = React.useState<number>(
    presetPaletteColors.error
  );
  const [appNeutralColor, setAppNeutralColor] = React.useState<number>(
    presetPaletteColors.neutral
  );
  const [appNeutralSColor, setAppNeutralSColor] = React.useState<number>(
    presetPaletteColors.neutralSpecial
  );
  const [appLanguage, setAppLanguage] = React.useState<string>('zh-Hans');
  const [appTranslate, setAppTranslate] = React.useState<boolean | undefined>(
    undefined
  );
  const [appThread, setAppThread] = React.useState<boolean | undefined>(
    undefined
  );
  const [appReaction, setAppReaction] = React.useState<boolean | undefined>(
    undefined
  );
  const [appPresence, setAppPresence] = React.useState<boolean | undefined>(
    undefined
  );
  const [appAv, setAppAv] = React.useState<boolean | undefined>(undefined);

  const onSetAppTheme = React.useCallback((value: boolean) => {
    setAppTheme(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'theme', value: value ? 'dark' : 'light' });
    DeviceEventEmitter.emit('_demo_emit_app_theme', value ? 'dark' : 'light');
  }, []);

  const onSetAppTranslate = React.useCallback((value: boolean) => {
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

  const onSetAppThread = React.useCallback((value: boolean) => {
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

  const onSetAppAv = React.useCallback((value: boolean) => {
    setAppAv(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'av', value: value ? 'enable' : 'disable' });
    DeviceEventEmitter.emit('_demo_emit_app_av', value ? 'enable' : 'disable');
  }, []);

  const onSetAppStyle = React.useCallback((value: string) => {
    setAppStyle(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'style', value });
    DeviceEventEmitter.emit('_demo_emit_app_style', value);
  }, []);

  const onSetAppPrimaryColor = React.useCallback((value: number) => {
    setAppPrimaryColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'primaryColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_primary_color', value);
  }, []);

  const onSetAppSecondColor = React.useCallback((value: number) => {
    setAppSecondColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'secondColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_second_color', value);
  }, []);

  const onSetAppErrorColor = React.useCallback((value: number) => {
    setAppErrorColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'errorColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_error_color', value);
  }, []);

  const onSetAppNeutralColor = React.useCallback((value: number) => {
    setAppNeutralColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'neutralColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_neutral_color', value);
  }, []);

  const onSetAppNeutralSColor = React.useCallback((value: number) => {
    setAppNeutralSColor(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'neutralSColor', value: value.toString() });
    DeviceEventEmitter.emit('_demo_emit_app_neutral_s_color', value);
  }, []);

  const onSetAppLanguage = React.useCallback((value: string) => {
    setAppLanguage(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'language', value });
    DeviceEventEmitter.emit('_demo_emit_app_language', value);
  }, []);

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
    const releaseArea = getReleaseArea();
    return {
      appTheme: res.value ? res.value !== 'light' : false,
      appTranslate: res10.value ? res10.value === 'enable' : false,
      appThread: res11.value ? res11.value === 'enable' : false,
      appReaction: res12.value ? res12.value === 'enable' : false,
      appPresence: res13.value ? res13.value === 'enable' : false,
      appAv: res14.value ? res14.value === 'enable' : false,
      appStyle: res2.value ?? (releaseArea === 'china' ? 'classic' : 'modern'),
      appLanguage: res4.value ?? 'zh-Hans',
      appPrimaryColor: res5.value ? +res5.value : presetPaletteColors.primary,
      appSecondColor: res6.value ? +res6.value : presetPaletteColors.secondary,
      appErrorColor: res7.value ? +res7.value : presetPaletteColors.error,
      appNeutralColor: res8.value ? +res8.value : presetPaletteColors.neutral,
      appNeutralSColor: res9.value
        ? +res9.value
        : presetPaletteColors.neutralSpecial,
    };
  }, []);

  const updater = React.useCallback(() => {
    initParams()
      .then((res) => {
        setAppTheme(res.appTheme);
        setAppStyle(res.appStyle);
        setAppLanguage(res.appLanguage);
        setAppPrimaryColor(res.appPrimaryColor);
        setAppSecondColor(res.appSecondColor);
        setAppErrorColor(res.appErrorColor);
        setAppNeutralColor(res.appNeutralColor);
        setAppNeutralSColor(res.appNeutralSColor);
        setAppTranslate(res.appTranslate);
        setAppThread(res.appThread);
        setAppReaction(res.appReaction);
        setAppPresence(res.appPresence);
        setAppAv(res.appAv);
      })
      .catch((e) => {
        console.warn('dev:initParams:', e);
      });
  }, [initParams]);

  React.useEffect(() => {
    updater();
  }, [updater]);

  return {
    appTheme,
    onSetAppTheme,
    appStyle,
    onSetAppStyle,
    appLanguage,
    onSetAppLanguage,
    initParams,
    updater,
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
  };
}
