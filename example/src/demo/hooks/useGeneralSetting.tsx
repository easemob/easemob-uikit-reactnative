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

  const onSetAppTheme = React.useCallback((value: boolean) => {
    setAppTheme(value);
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    s.setData({ key: 'theme', value: value ? 'dark' : 'light' });
    DeviceEventEmitter.emit('_demo_emit_app_theme', value ? 'dark' : 'light');
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
    const releaseArea = getReleaseArea();
    return {
      appTheme: res.value ? res.value !== 'light' : false,
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
  };
}
