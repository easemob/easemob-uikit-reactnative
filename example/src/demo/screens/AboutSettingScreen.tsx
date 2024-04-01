import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Linking, Pressable, View } from 'react-native';
import {
  Avatar,
  Icon,
  ListItem,
  SingleLineText,
  Text,
  TopNavigationBar,
  UIKIT_VERSION,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { logo } from '../common/assets';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AboutSettingScreen(props: Props) {
  const { navigation } = props;
  // todo: save to user info.
  //   const remark = ((route.params as any)?.params as any)?.remark;
  //   const avatar = ((route.params as any)?.params as any)?.avatar;
  //   const from = ((route.params as any)?.params as any)?.from;
  //   const hash = ((route.params as any)?.params as any)?.hash;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    disable: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    right: {
      light: colors.neutral[3],
      dark: colors.neutral[5],
    },
  });

  const onBack = () => {
    navigation.goBack();
  };

  const onClickedOfficeSite = () => {
    Linking.openURL('https://www.huanxin.com');
  };
  const onClickedPhone = () => {
    Linking.openURL('tel:400-622-1776');
  };
  const onClickedEmail = (email: string) => {
    Linking.openURL(`mailto: ${email}`);
  };
  const onClickedPartner = () => {
    onClickedEmail('bd@easemob.com');
  };
  const onClickedChannel = () => {
    onClickedEmail('qudao@easemob.com');
  };
  const onClickedAdvise = () => {
    onClickedEmail('issues@easemob.com');
  };

  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          // backgroundColor: getColor('bg'),
          flex: 1,
        }}
      >
        <TopNavigationBar
          containerStyle={{ backgroundColor: undefined }}
          Left={
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 44,
              }}
              onPress={onBack}
            >
              <Icon
                name={'chevron_left'}
                style={{ width: 24, height: 24, tintColor: getColor('icon') }}
              />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{
                  color: getColor('t1'),
                }}
              >
                {tr('_demo_about_setting_navi_title')}
              </Text>
            </Pressable>
          }
          Right={<View />}
        />

        <Pressable style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Avatar
            size={72}
            localIcon={logo}
            style={{ width: 72, height: 72 }}
          />
          <SingleLineText
            textType={'medium'}
            paletteType={'title'}
            style={{ color: getColor('t1'), padding: 4 }}
          >
            {tr('_demo_about_title')}
          </SingleLineText>
          <SingleLineText
            textType={'medium'}
            paletteType={'label'}
            style={{ color: getColor('disable') }}
          >
            {tr('Version 1.0.0')}
          </SingleLineText>
          <SingleLineText
            textType={'medium'}
            paletteType={'label'}
            style={{ color: getColor('disable') }}
          >
            {tr(`UIKit Version ${UIKIT_VERSION}`)}
          </SingleLineText>
        </Pressable>

        <View style={{ height: 54 }} />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <Pressable
              style={{ flexDirection: 'column', justifyContent: 'center' }}
              onPress={onClickedOfficeSite}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_about_setting_site')}
              </Text>
              <Text
                textType={'small'}
                paletteType={'title'}
                style={{ color: getColor('disable') }}
              >
                {tr('_demo_about_setting_site_url')}
              </Text>
            </Pressable>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={'chevron_right'}
                style={{ height: 20, width: 20, tintColor: getColor('right') }}
              />
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <Pressable
              style={{ flexDirection: 'column', justifyContent: 'center' }}
              onPress={onClickedPhone}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_about_setting_phone')}
              </Text>
              <Text
                textType={'small'}
                paletteType={'title'}
                style={{ color: getColor('disable') }}
              >
                {tr('_demo_about_setting_phone_number')}
              </Text>
            </Pressable>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={'chevron_right'}
                style={{ height: 20, width: 20, tintColor: getColor('right') }}
              />
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <Pressable
              style={{ flexDirection: 'column', justifyContent: 'center' }}
              onPress={onClickedPartner}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_about_setting_partner')}
              </Text>
              <Text
                textType={'small'}
                paletteType={'title'}
                style={{ color: getColor('disable') }}
              >
                {tr('_demo_about_setting_partner_email')}
              </Text>
            </Pressable>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={'chevron_right'}
                style={{ height: 20, width: 20, tintColor: getColor('right') }}
              />
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <Pressable
              style={{ flexDirection: 'column', justifyContent: 'center' }}
              onPress={onClickedChannel}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_about_setting_channel')}
              </Text>
              <Text
                textType={'small'}
                paletteType={'title'}
                style={{ color: getColor('disable') }}
              >
                {tr('_demo_about_setting_channel_email')}
              </Text>
            </Pressable>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={'chevron_right'}
                style={{ height: 20, width: 20, tintColor: getColor('right') }}
              />
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <Pressable
              style={{ flexDirection: 'column', justifyContent: 'center' }}
              onPress={onClickedAdvise}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_about_setting_advise')}
              </Text>
              <Text
                textType={'small'}
                paletteType={'title'}
                style={{ color: getColor('disable') }}
              >
                {tr('_demo_about_setting_advise_email')}
              </Text>
            </Pressable>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={'chevron_right'}
                style={{ height: 20, width: 20, tintColor: getColor('right') }}
              />
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
