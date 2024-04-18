import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Icon,
  ListItem,
  Text,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import { useGeneralSetting } from '../hooks/useGeneralSetting';
import type { RootParamsName, RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LanguageSettingScreen(props: Props) {
  const { route } = props;
  const name = route.name as RootParamsName;
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
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    disable: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const {
    appLanguage,
    onSetAppLanguage,
    appTranslateLanguage,
    onSetAppTranslateLanguage,
  } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState(appLanguage);

  const onBack = () => {
    navi.goBack();
  };
  const onSave = () => {
    if (name === 'LanguageSetting') {
      onSetAppLanguage(currentLanguage);
      navi.navigate({ to: 'CommonSetting' });
    } else if (name === 'TranslationLanguageSetting') {
      onSetAppTranslateLanguage(currentLanguage);
      navi.navigate({ to: 'CommonSetting' });
    }
  };
  const onChanged = (index: number) => {
    setCurrentLanguage(index === 0 ? 'zh-Hans' : 'en');
    setChanged(true);
  };

  React.useEffect(() => {
    if (name === 'LanguageSetting') {
      setCurrentLanguage(appLanguage);
    } else if (name === 'TranslationLanguageSetting') {
      setCurrentLanguage(appTranslateLanguage);
    }
  }, [appLanguage, appTranslateLanguage, name]);

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
            content={tr('_demo_language_setting_navi_title')}
          />
        }
        Right={
          <Pressable
            onPress={onSave}
            style={{ paddingHorizontal: 8 }}
            disabled={changed ? false : true}
          >
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{
                color: getColor(changed ? 'enable' : 'disable'),
              }}
            >
              {tr('_demo_language_setting_navi_confim')}
            </Text>
          </Pressable>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        onClicked={() => onChanged(0)}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_language_setting_language_cn')}
            </Text>
          </View>
        }
        RightIcon={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onChanged(0)}
          >
            <Icon
              name={
                currentLanguage === 'en'
                  ? 'unchecked_rectangle'
                  : 'radio_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentLanguage === 'en' ? 'disable' : 'enable'
                ),
              }}
            />
          </Pressable>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        onClicked={() => onChanged(1)}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_language_setting_language_en')}
            </Text>
          </View>
        }
        RightIcon={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onChanged(1)}
          >
            <Icon
              name={
                currentLanguage === 'zh-Hans'
                  ? 'unchecked_rectangle'
                  : 'radio_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentLanguage === 'zh-Hans' ? 'disable' : 'enable'
                ),
              }}
            />
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}
