import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import {
  Alert,
  Avatar,
  BottomSheetNameMenu,
  CommonSwitch,
  Icon,
  LanguageCode,
  ListItem,
  SimpleToast,
  Text,
  Text1Button,
  UIKIT_VERSION,
  useColors,
  usePaletteContext,
  useThemeContext,
} from 'react-native-chat-uikit';

import { useMineInfo } from './MineInfo.hooks';
import type { MineInfoProps } from './types';

export function MineInfo(props: MineInfoProps) {
  const { containerStyle } = props;
  const {
    userId,
    userName,
    userAvatar,
    alertRef,
    menuRef,
    toastRef,
    onRequestCloseMenu,
    userSign,
    onClickedState,
    onClickedLogout,
    onClickedLanguage,
    onClickedTheme,
    value,
    onValueChange,
    language,
    setLanguage,
    tr,
  } = useMineInfo(props);
  const { cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
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
      <View style={{ alignItems: 'center', paddingTop: 64 }}>
        <Avatar size={100} url={userAvatar} />
        <View style={{ height: 12 }} />
        <Text
          textType={'large'}
          paletteType={'headline'}
          style={{ color: getColor('fg') }}
        >
          {userName ?? userId}
        </Text>
        <View style={{ height: 4 }} />
        <Text
          textType={'medium'}
          paletteType={'label'}
          style={{ color: getColor('t3') }}
        >
          {userSign}
        </Text>
        <View style={{ height: 4 }} />
        <Text
          textType={'small'}
          paletteType={'label'}
          style={{ color: getColor('t3') }}
        >
          {userId}
        </Text>
      </View>

      <View style={{ height: 10 }} />
      <ListItem
        header={
          <View
            style={{
              paddingHorizontal: 16,
              height: 26,
              justifyContent: 'center',
            }}
          >
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('t3') }}
            >
              {tr('set')}
            </Text>
          </View>
        }
        onClicked={onClickedState}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row' }}>
            <Icon name={'link'} style={{ height: 28, width: 28 }} />
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('online_state')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('t3') }}
            >
              {tr('set')}
            </Text>
            <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedState}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row' }}>
            <Icon name={'link'} style={{ height: 28, width: 28 }} />
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('about')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('t3') }}
            >
              {`Easemob UIKit v${UIKIT_VERSION}`}
            </Text>
            <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedTheme}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row' }}>
            <Icon name={'link'} style={{ height: 28, width: 28 }} />
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('theme')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ justifyContent: 'center' }}>
            <CommonSwitch
              height={31}
              width={51}
              value={value}
              onValueChange={(v) => {
                onValueChange(v);
                DeviceEventEmitter.emit(
                  'example_change_theme',
                  value === true ? 'light' : 'dark'
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
          <View style={{ flexDirection: 'row' }}>
            <Icon name={'link'} style={{ height: 28, width: 28 }} />
            <View style={{ width: 8 }} />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('language')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ justifyContent: 'center' }}>
            <CommonSwitch
              height={31}
              width={51}
              value={language}
              onValueChange={(v) => {
                setLanguage(v);
                DeviceEventEmitter.emit(
                  'example_change_language',
                  language === false
                    ? ('en' as LanguageCode)
                    : ('zh-Hans' as LanguageCode)
                );
              }}
            />
          </View>
        }
      />

      <ListItem
        header={
          <View
            style={{
              paddingHorizontal: 16,
              height: 26,
              justifyContent: 'center',
            }}
          >
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('t3') }}
            >
              {tr('login')}
            </Text>
          </View>
        }
        onClicked={onClickedState}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text1Button
              sizesType={'middle'}
              radiusType={input}
              contentType={'only-text'}
              text={tr('logout')}
              onPress={onClickedLogout}
            />
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', justifyContent: 'center' }} />
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