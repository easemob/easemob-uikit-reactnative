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

import { useStackScreenRoute } from '../hooks';
import { useGeneralSetting } from '../hooks/useGeneralSetting';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GeneralSettingScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right: {
      light: colors.neutral[3],
      dark: colors.neutral[5],
    },
  });
  const { appLanguage, appStyle, appTheme, onSetAppTheme, updater } =
    useGeneralSetting();

  const onBack = () => {
    navi.goBack();
  };
  // const onClickedTheme = () => {};
  const onClickedStyle = () => {
    navi.push({ to: 'StyleSetting' });
  };
  const onClickedColor = () => {
    navi.push({ to: 'ColorSetting' });
  };
  const onClickedFeature = () => {
    navi.push({ to: 'FeatureSetting' });
  };
  const onClickedLanguage = () => {
    navi.push({ to: 'LanguageSetting' });
  };

  React.useEffect(() => {
    if (from === 'LanguageSetting' && hash) {
      updater();
    } else if (from === 'ColorSetting' && hash) {
      updater();
    } else if (from === 'StyleSetting' && hash) {
      updater();
    }
  }, [from, hash, updater]);

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
              {tr('_demo_general_setting_navi_title')}
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
              {tr('_demo_general_setting_theme')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {appTheme !== undefined ? (
              <Switch
                value={appTheme}
                onValueChange={onSetAppTheme}
                height={31}
                width={51}
              />
            ) : null}
          </View>
        }
      />

      <ListItem
        onClicked={onClickedStyle}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_style')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              paletteType={'label'}
              textType={'large'}
              style={{
                color: getColor('t1'),
              }}
            >
              {tr(appStyle)}
            </SingleLineText>
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedColor}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_color')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <SingleLineText
                paletteType={'label'}
                textType={'large'}
                style={{
                  color: getColor('t1'),
                }}
              >
                {appPrimaryColor}
              </SingleLineText> */}
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedFeature}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_feature')}
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
        onClicked={onClickedLanguage}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_language')}
            </Text>
          </View>
        }
        RightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              paletteType={'label'}
              textType={'large'}
              style={{
                color: getColor('t1'),
              }}
            >
              {appLanguage === 'en' ? tr('en') : tr('zh-Hans')}
            </SingleLineText>
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
