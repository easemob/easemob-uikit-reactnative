import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import constants from 'expo-constants';
import * as React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CHAT_VERSION,
  Icon,
  Image,
  ListItem,
  SingleLineText,
  Text,
  TopNavigationBar,
  TopNavigationBarLeft,
  UIKIT_VERSION,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { about_logo } from '../common/assets';
import { accountType } from '../common/const';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function EasemobAboutSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
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
    // enable: {
    //   light: colors.primary[5],
    //   dark: colors.primary[6],
    // },
    // disable: {
    //   light: colors.neutral[5],
    //   dark: colors.neutral[6],
    // },
    right: {
      light: colors.neutral[3],
      dark: colors.neutral[5],
    },
  });

  const onBack = () => {
    navi.goBack();
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
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_about_setting_navi_title')}
          />
        }
        Right={<View />}
      />

      <Pressable style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={about_logo} style={{ width: 72, height: 72 }} />
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
          {tr(`Version ${constants.manifest?.version}`)}
        </SingleLineText>
        <SingleLineText
          textType={'medium'}
          paletteType={'label'}
          style={{ color: getColor('disable') }}
        >
          {tr(`SDK Version ${CHAT_VERSION}`)}
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
        onClicked={onClickedOfficeSite}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
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
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_about_setting_site_url')}
            </Text>
          </View>
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
        onClicked={onClickedPhone}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
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
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_about_setting_phone_number')}
            </Text>
          </View>
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
        onClicked={onClickedPartner}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
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
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_about_setting_partner_email')}
            </Text>
          </View>
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
        onClicked={onClickedChannel}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
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
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_about_setting_channel_email')}
            </Text>
          </View>
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
        onClicked={onClickedAdvise}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
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
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_about_setting_advise_email')}
            </Text>
          </View>
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
        onClicked={() => {}}
        LeftName={
          <Text
            textType={'medium'}
            paletteType={'title'}
            style={{ color: getColor('fg') }}
          >
            {tr('_demo_about_setting_privacy')}
          </Text>
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
  );
}

export function AgoraAboutSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
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
    // enable: {
    //   light: colors.primary[5],
    //   dark: colors.primary[6],
    // },
    // disable: {
    //   light: colors.neutral[5],
    //   dark: colors.neutral[6],
    // },
    right: {
      light: colors.neutral[3],
      dark: colors.neutral[5],
    },
  });

  const onBack = () => {
    navi.goBack();
  };

  const onClickedDocsSite = () => {
    Linking.openURL(
      'https://docs.agora.io/en/agora-chat/overview/product-overview'
    );
  };
  const onClickedContactSite = () => {
    Linking.openURL('https://www.agora.io/en/talk-to-us/');
  };
  const onClickedGithubSite = () => {
    Linking.openURL('https://github.com/AgoraIO/Agora-Chat-API-Examples');
  };
  const onClickedMoreSite = () => {
    Linking.openURL('https://agora.io');
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_about_setting_navi_title')}
          />
        }
        Right={<View />}
      />

      <Pressable style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={about_logo} style={{ width: 72, height: 72 }} />
        <SingleLineText
          textType={'medium'}
          paletteType={'title'}
          style={{ color: getColor('t1'), padding: 4 }}
        >
          {tr('_demo_about_title')}
        </SingleLineText>
        {/* <SingleLineText
          textType={'medium'}
          paletteType={'label'}
          style={{ color: getColor('disable') }}
        >
          {tr(`Version ${constants.manifest?.version}`)}
        </SingleLineText> */}
        <SingleLineText
          textType={'medium'}
          paletteType={'label'}
          style={{ color: getColor('disable') }}
        >
          {tr(`SDK Version ${CHAT_VERSION}`)}
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
        onClicked={onClickedDocsSite}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_agora_about_setting_docs_site')}
            </Text>
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_agora_about_setting_docs_site_url')}
            </Text>
          </View>
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
        onClicked={onClickedContactSite}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_agora_about_setting_contact_site')}
            </Text>
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_agora_about_setting_contact_site_url')}
            </Text>
          </View>
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
        onClicked={onClickedGithubSite}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_agora_about_setting_github_site')}
            </Text>
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_agora_about_setting_github_site_url')}
            </Text>
          </View>
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
        onClicked={onClickedMoreSite}
        LeftName={
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_agora_about_setting_more_site')}
            </Text>
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{ color: getColor('enable') }}
            >
              {tr('_demo_agora_about_setting_more_site_url')}
            </Text>
          </View>
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
  );
}

export const AboutSettingScreen =
  accountType === 'agora' ? AgoraAboutSettingScreen : EasemobAboutSettingScreen;
