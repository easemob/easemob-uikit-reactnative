import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import {
  ListItem,
  SingleLineText,
  Switch,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useGeneralSetting, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function FeatureSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
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
    appTyping,
    appBlock,
    onSetAppTranslate,
    onSetAppReaction,
    onSetAppThread,
    onSetAppPresence,
    onSetAppTyping,
    onSetAppBlock,
  } = useGeneralSetting();

  const onBack = () => {
    navi.goBack();
  };

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_feature_setting_navi_title')}
          />
        }
        Right={<View />}
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_translate')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appTranslate !== undefined ? (
              <Switch
                value={appTranslate}
                onValueChange={onSetAppTranslate}
                height={31}
                width={51}
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
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_thread')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appThread !== undefined ? (
              <Switch
                value={appThread}
                onValueChange={onSetAppThread}
                height={31}
                width={51}
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
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_reaction')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appReaction !== undefined ? (
              <Switch
                value={appReaction}
                onValueChange={onSetAppReaction}
                height={31}
                width={51}
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
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_presence')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appPresence !== undefined ? (
              <Switch
                value={appPresence}
                onValueChange={onSetAppPresence}
                height={31}
                width={51}
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

      {/* <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_av')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appAv !== undefined ? (
              <Switch
                value={appAv}
                onValueChange={onSetAppAv}
                height={31}
                width={51}
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
      /> */}

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_typing')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appTyping !== undefined ? (
              <Switch
                value={appTyping}
                onValueChange={onSetAppTyping}
                height={31}
                width={51}
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
              {tr('_demo_feature_setting_typing_tip')}
            </SingleLineText>
          </View>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_feature_setting_block')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appBlock !== undefined ? (
              <Switch
                value={appBlock}
                onValueChange={onSetAppBlock}
                height={31}
                width={51}
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
              {tr('_demo_feature_setting_block_tip')}
            </SingleLineText>
          </View>
        }
      />
    </SafeAreaViewFragment>
  );
}
