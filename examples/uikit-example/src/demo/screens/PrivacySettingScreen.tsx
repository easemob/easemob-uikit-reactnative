import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import {
  Icon,
  ListItem,
  SingleLineText,
  TopNavigationBar,
  TopNavigationBarLeft,
  useColors,
  useConfigContext,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function PrivacySettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { enableBlock } = useConfigContext();
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

  const onBack = () => {
    navi.goBack();
  };

  const onClickedBlock = () => {
    navi.push({ to: 'BlockList' });
  };

  return (
    <SafeAreaViewFragment>
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_privacy_setting_navi_title')}
          />
        }
        Right={<View />}
      />

      {enableBlock === true ? (
        <ListItem
          onClicked={onClickedBlock}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SingleLineText
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_privacy_setting_block_list')}
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
                {tr('')}
              </SingleLineText>
              <Icon
                name={'chevron_right'}
                style={{ height: 20, width: 20, tintColor: getColor('right') }}
              />
            </View>
          }
        />
      ) : null}
    </SafeAreaViewFragment>
  );
}
