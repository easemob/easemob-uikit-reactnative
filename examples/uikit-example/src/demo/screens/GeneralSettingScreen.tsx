import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import {
  Icon,
  ListItem,
  SingleLineText,
  Switch,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { accountType } from '../common/const';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
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
  const {
    appLanguage,
    appTranslateLanguage,
    appMessageContextMenuStyle,
    appMessageInputBarExtensionStyle,
    appStyle,
    appTheme,
    onSetAppTheme,
    updateParams,
  } = useGeneralSetting();
  console.log('test:zuoyu:123:', appMessageContextMenuStyle);

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
  const onClickedTranslationLanguage = () => {
    navi.push({ to: 'TranslationLanguageSetting' });
  };
  const onClickedMessageMenu = () => {
    navi.push({ to: 'MessageContextMenuSetting' });
  };
  const onClickedMessageInputBar = () => {
    navi.push({ to: 'MessageInputBarMenuSetting' });
  };

  React.useEffect(() => {
    if (from === 'LanguageSetting' && hash) {
      updateParams();
    } else if (from === 'TranslationLanguageSetting' && hash) {
      updateParams();
    } else if (from === 'ColorSetting' && hash) {
      updateParams();
    } else if (from === 'StyleSetting' && hash) {
      updateParams();
    } else if (from === 'MessageContextMenuSetting' && hash) {
      updateParams();
    } else if (from === 'MessageInputBarMenuSetting' && hash) {
      updateParams();
    }
  }, [from, hash, updateParams]);

  React.useEffect(() => {
    updateParams();
  }, [updateParams]);

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_general_setting_navi_title')}
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
              {tr('_demo_general_setting_theme')}
            </SingleLineText>
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
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_style')}
            </SingleLineText>
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
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_color')}
            </SingleLineText>
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
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_feature')}
            </SingleLineText>
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

      {accountType === 'agora' ? null : (
        <ListItem
          onClicked={onClickedLanguage}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SingleLineText
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_general_setting_language')}
              </SingleLineText>
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
      )}

      <ListItem
        onClicked={onClickedTranslationLanguage}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_translation_language')}
            </SingleLineText>
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
              {appTranslateLanguage === 'en' ? tr('en') : tr('zh-Hans')}
            </SingleLineText>
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedMessageMenu}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_message_menu')}
            </SingleLineText>
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
              {appMessageContextMenuStyle === 'bottom-sheet'
                ? tr('style2')
                : tr('style1')}
            </SingleLineText>
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
          </View>
        }
      />

      <ListItem
        onClicked={onClickedMessageInputBar}
        containerStyle={{ paddingHorizontal: 16 }}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_general_setting_message_input_menu')}
            </SingleLineText>
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
              {appMessageInputBarExtensionStyle === 'bottom-sheet'
                ? tr('style2')
                : tr('style1')}
            </SingleLineText>
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
          </View>
        }
      />
    </SafeAreaViewFragment>
  );
}
