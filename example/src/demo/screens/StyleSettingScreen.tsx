import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Icon,
  ListItem,
  Text,
  TopNavigationBar,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralSetting } from '../common/useGeneralSetting';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function StyleSettingScreen(props: Props) {
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
  });
  const { appStyle, onSetAppStyle } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState(appStyle);

  const onBack = () => {
    navigation.goBack();
  };
  const onSave = () => {
    onSetAppStyle(currentStyle);
    navigation.navigate('CommonSetting', {
      params: {
        from: 'StyleSetting',
        hash: Date.now(),
      },
    });
  };
  const onChanged = (index: number) => {
    setCurrentStyle(index === 0 ? 'classic' : 'modern');
    setChanged(true);
  };

  React.useEffect(() => {
    setCurrentStyle(appStyle);
  }, [appStyle]);

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
                {tr('_demo_style_setting_navi_title')}
              </Text>
            </Pressable>
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
                {tr('_demo_style_setting_navi_confim')}
              </Text>
            </Pressable>
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
                {tr('_demo_style_setting_language_classic')}
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
                  currentStyle === 'modern'
                    ? 'unchecked_rectangle'
                    : 'radio_rectangle'
                }
                style={{
                  width: 28,
                  height: 28,
                  tintColor: getColor(
                    currentStyle === 'modern' ? 'disable' : 'enable'
                  ),
                }}
              />
            </Pressable>
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
                {tr('_demo_style_setting_language_modern')}
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
                  currentStyle === 'classic'
                    ? 'unchecked_rectangle'
                    : 'radio_rectangle'
                }
                style={{
                  width: 28,
                  height: 28,
                  tintColor: getColor(
                    currentStyle === 'classic' ? 'disable' : 'enable'
                  ),
                }}
              />
            </Pressable>
          }
        />
      </SafeAreaView>
    </View>
  );
}
