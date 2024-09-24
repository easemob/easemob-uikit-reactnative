import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import {
  Icon,
  ListItem,
  SingleLineText,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import { useGeneralSetting } from '../hooks/useGeneralSetting';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageInputBarMenuSettingScreen(props: Props) {
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
    appMessageInputBarExtensionStyle,
    onSetAppMessageInputBarExtensionStyle,
  } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState(
    appMessageInputBarExtensionStyle
  );

  const onBack = () => {
    navi.goBack();
  };
  const onSave = () => {
    onSetAppMessageInputBarExtensionStyle(currentStyle);
    navi.navigate({ to: 'CommonSetting' });
  };
  const onChanged = (index: number) => {
    setCurrentStyle(index === 0 ? 'bottom-sheet' : 'extension');
    setChanged(true);
  };

  React.useEffect(() => {
    setCurrentStyle(appMessageInputBarExtensionStyle);
  }, [appMessageInputBarExtensionStyle]);

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_message_input_bar_menu_setting_navi_title')}
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
              {tr('_demo_message_input_bar_menu_setting_navi_confim')}
            </SingleLineText>
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
              {tr('_demo_message_input_bar_menu_setting_style1')}
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
              {tr('_demo_message_input_bar_menu_setting_style2')}
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
                currentStyle === 'extension'
                  ? 'radio_rectangle'
                  : 'unchecked_rectangle'
              }
              style={{
                width: 28,
                height: 28,
                tintColor: getColor(
                  currentStyle === 'extension' ? 'enable' : 'disable'
                ),
              }}
            />
          </Pressable>
        }
      />
    </SafeAreaViewFragment>
  );
}
