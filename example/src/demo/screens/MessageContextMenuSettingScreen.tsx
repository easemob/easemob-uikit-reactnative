import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Dimensions, Image as RNImage, Pressable, View } from 'react-native';

import {
  Icon,
  Image,
  ListItem,
  SingleLineText,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from '../../rename.uikit';
import {
  msg_menu_style1_ondark,
  msg_menu_style1_onlight,
  msg_menu_style2_ondark,
  msg_menu_style2_onlight,
} from '../common/assets';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import { useGeneralSetting } from '../hooks/useGeneralSetting';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageContextMenuSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { style: themeStyle } = useThemeContext();
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
    appMessageContextMenuStyle,
    onSetAppMessageContextMenuStyle,
    updateParams,
  } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState(
    appMessageContextMenuStyle
  );
  console.log('currentStyle', appMessageContextMenuStyle, currentStyle);
  const image =
    themeStyle === 'dark'
      ? currentStyle !== 'bottom-sheet'
        ? msg_menu_style1_ondark
        : msg_menu_style2_ondark
      : currentStyle !== 'bottom-sheet'
      ? msg_menu_style1_onlight
      : msg_menu_style2_onlight;
  const screenWidth = Dimensions.get('window').width;
  const imageSize = RNImage.resolveAssetSource(image);
  const imageWidth = screenWidth - 32;
  const imageHeight = Math.round(
    imageWidth * (imageSize.height / imageSize.width)
  );

  const onBack = () => {
    navi.goBack();
  };
  const onSave = () => {
    onSetAppMessageContextMenuStyle(currentStyle);
    navi.navigate({ to: 'CommonSetting' });
  };
  const onChanged = (index: number) => {
    setCurrentStyle(index === 0 ? 'bottom-sheet' : 'context');
    setChanged(true);
  };

  React.useEffect(() => {
    updateParams(({ appMessageContextMenuStyle }) => {
      setCurrentStyle(appMessageContextMenuStyle);
    });
  }, [updateParams]);

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_message_context_menu_setting_navi_title')}
          />
        }
        Right={
          <Pressable
            onPress={onSave}
            style={{ paddingHorizontal: 8 }}
            disabled={changed ? false : true}
          >
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{
                color: getColor(changed ? 'enable' : 'disable'),
              }}
            >
              {tr('_demo_message_context_menu_setting_navi_confim')}
            </SingleLineText>
          </Pressable>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        onClicked={() => onChanged(1)}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_message_context_menu_setting_style1')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onChanged(1)}
          >
            <Icon
              name={
                currentStyle === 'context'
                  ? 'radio_rectangle'
                  : 'unchecked_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentStyle === 'context' ? 'enable' : 'disable'
                ),
              }}
            />
          </Pressable>
        }
      />

      <ListItem
        containerStyle={{ paddingHorizontal: 16 }}
        onClicked={() => onChanged(0)}
        LeftName={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_demo_message_context_menu_setting_style2')}
            </SingleLineText>
          </View>
        }
        RightIcon={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onChanged(0)}
          >
            <Icon
              name={
                currentStyle === 'bottom-sheet'
                  ? 'radio_rectangle'
                  : 'unchecked_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentStyle === 'bottom-sheet' ? 'enable' : 'disable'
                ),
              }}
            />
          </Pressable>
        }
      />

      <View style={{ flex: 1 }} />
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={image}
          style={{ width: imageWidth, height: imageHeight }}
        />
      </View>
    </SafeAreaViewFragment>
  );
}
