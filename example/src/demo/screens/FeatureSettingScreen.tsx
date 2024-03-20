import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Icon,
  ListItem,
  SingleLineText,
  Switch,
  Text,
  TopNavigationBar,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralSetting } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function FeatureSettingScreen(props: Props) {
  const { navigation } = props;
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
    t1: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
  });
  const {
    appTranslate,
    appThread,
    appReaction,
    appPresence,
    appAv,
    onSetAppTranslate,
    onSetAppReaction,
    onSetAppThread,
    onSetAppPresence,
    onSetAppAv,
  } = useGeneralSetting();

  const onBack = () => {
    navigation.goBack();
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
                {tr('_demo_feature_setting_navi_title')}
              </Text>
            </Pressable>
          }
          Right={<View />}
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_feature_setting_translate')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {appTranslate !== undefined ? (
                <Switch
                  value={appTranslate}
                  onValueChange={onSetAppTranslate}
                  style={{ height: 31, width: 51 }}
                />
              ) : null}
            </View>
          }
          tail={
            <View
              style={{
                height: 26,
                paddingHorizontal: 16,
                backgroundColor: getColor('bg2'),
                justifyContent: 'center',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'body'}
                style={{ color: getColor('t1') }}
              >
                {tr('_demo_feature_setting_translate_tip')}
              </SingleLineText>
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_feature_setting_thread')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {appThread !== undefined ? (
                <Switch
                  value={appThread}
                  onValueChange={onSetAppThread}
                  style={{ height: 31, width: 51 }}
                />
              ) : null}
            </View>
          }
          tail={
            <View
              style={{
                height: 26,
                paddingHorizontal: 16,
                backgroundColor: getColor('bg2'),
                justifyContent: 'center',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'body'}
                style={{ color: getColor('t1') }}
              >
                {tr('_demo_feature_setting_thread_tip')}
              </SingleLineText>
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_feature_setting_reaction')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {appReaction !== undefined ? (
                <Switch
                  value={appReaction}
                  onValueChange={onSetAppReaction}
                  style={{ height: 31, width: 51 }}
                />
              ) : null}
            </View>
          }
          tail={
            <View
              style={{
                height: 26,
                paddingHorizontal: 16,
                backgroundColor: getColor('bg2'),
                justifyContent: 'center',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'body'}
                style={{ color: getColor('t1') }}
              >
                {tr('_demo_feature_setting_reaction_tip')}
              </SingleLineText>
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_feature_setting_presence')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {appPresence !== undefined ? (
                <Switch
                  value={appPresence}
                  onValueChange={onSetAppPresence}
                  style={{ height: 31, width: 51 }}
                />
              ) : null}
            </View>
          }
          tail={
            <View
              style={{
                height: 26,
                paddingHorizontal: 16,
                backgroundColor: getColor('bg2'),
                justifyContent: 'center',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'body'}
                style={{ color: getColor('t1') }}
              >
                {tr('_demo_feature_setting_presence_tip')}
              </SingleLineText>
            </View>
          }
        />

        <ListItem
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_feature_setting_av')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {appAv !== undefined ? (
                <Switch
                  value={appAv}
                  onValueChange={onSetAppAv}
                  style={{ height: 31, width: 51 }}
                />
              ) : null}
            </View>
          }
          tail={
            <View
              style={{
                height: 26,
                paddingHorizontal: 16,
                backgroundColor: getColor('bg2'),
                justifyContent: 'center',
              }}
            >
              <SingleLineText
                textType={'small'}
                paletteType={'body'}
                style={{ color: getColor('t1') }}
              >
                {tr('_demo_feature_setting_av_tip')}
              </SingleLineText>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
