import * as React from 'react';
import { DeviceEventEmitter, Pressable, View } from 'react-native';
import {
  Alert,
  BottomSheetNameMenu,
  CommonSwitch,
  IconButton,
  LanguageCode,
  ListItem,
  SimpleToast,
  Text,
  TopNavigationBar,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';

import { useCommonInfo } from './MineInfo.hooks';
import type { CommonInfoProps } from './types';

export function CommonInfo(props: CommonInfoProps) {
  const { containerStyle, onBack } = props;
  const {
    alertRef,
    menuRef,
    toastRef,
    onRequestCloseMenu,
    onClickedInputState,
    stateValue,
    onStateValueChange,
    onClickedAutoAcceptGroupInvite,
    groupValue,
    onGroupValueChange,
    onClickedTheme,
    themeValue,
    onThemeValueChange,
    onClickedLanguage,
    languageValue,
    onLanguageValueChange,
  } = useCommonInfo(props);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    t3: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });

  return (
    <View
      style={[
        {
          flexGrow: 1,
          backgroundColor: getColor('bg'),
          // backgroundColor: 'red',
        },
        containerStyle,
      ]}
    >
      <TopNavigationBar
        Left={
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
            }}
            onPress={onBack}
          >
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24, tintColor: getColor('icon') }}
            />
            <Text
              paletteType={'title'}
              textType={'medium'}
              style={{ color: getColor('text') }}
            >
              {tr('_demo_navigation_common_setting_back')}
            </Text>
          </Pressable>
        }
      />

      <ListItem
        onClicked={onClickedInputState}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_info_input_state')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ justifyContent: 'center' }}>
            <CommonSwitch
              height={31}
              width={51}
              value={stateValue}
              onValueChange={(v) => {
                onStateValueChange(v);
              }}
            />
          </View>
        }
        tail={
          <View
            style={{
              paddingHorizontal: 16,
              height: 26,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('t3') }}
            >
              {tr('_demo_info_input_state_tail')}
            </Text>
          </View>
        }
      />

      <ListItem
        onClicked={onClickedAutoAcceptGroupInvite}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_info_auto_accept_group_invite')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ justifyContent: 'center' }}>
            <CommonSwitch
              height={31}
              width={51}
              value={groupValue}
              onValueChange={(v) => {
                onGroupValueChange(v);
              }}
            />
          </View>
        }
        tail={
          <View
            style={{
              paddingHorizontal: 16,
              height: 26,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('t3') }}
            >
              {tr('_demo_info_auto_accept_group_invite_tail')}
            </Text>
          </View>
        }
      />

      <ListItem
        onClicked={onClickedTheme}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_info_theme')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ justifyContent: 'center' }}>
            <CommonSwitch
              height={31}
              width={51}
              value={themeValue}
              onValueChange={(v) => {
                onThemeValueChange(v);
                DeviceEventEmitter.emit(
                  'example_change_theme',
                  themeValue === true ? 'light' : 'dark'
                );
              }}
            />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedLanguage}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_info_language')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ justifyContent: 'center' }}>
            <CommonSwitch
              height={31}
              width={51}
              value={languageValue}
              onValueChange={(v) => {
                onLanguageValueChange(v);
                DeviceEventEmitter.emit(
                  'example_change_language',
                  languageValue === false
                    ? ('en' as LanguageCode)
                    : ('zh-Hans' as LanguageCode)
                );
              }}
            />
          </View>
        }
      />

      <Alert ref={alertRef} />
      <BottomSheetNameMenu
        onRequestModalClose={onRequestCloseMenu}
        ref={menuRef}
      />
      <SimpleToast propsRef={toastRef} />
    </View>
  );
}
