import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { TopNavigationBar } from '../TopNavigationBar';
import type { GroupParticipantListNavigationBarProps } from './types';

type _GroupParticipantListNavigationBarProps =
  GroupParticipantListNavigationBarProps & {
    onDelParticipant?: () => void;
    deleteCount?: number;
    participantCount?: number;
  };
export const _GroupParticipantListNavigationBar = (
  props: _GroupParticipantListNavigationBarProps
) => {
  const {
    participantType,
    onBack,
    onDelParticipant,
    deleteCount,
    participantCount,
    onClickedAddParticipant,
    onClickedDelParticipant,
    NavigationBar,
  } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.error[5],
      dark: colors.error[6],
    },
  });

  if (NavigationBar) {
    return <>{NavigationBar}</>;
  }

  if (participantType === 'delete') {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
          >
            <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_group_alert_del_member_title')}
            </Text>
          </Pressable>
        }
        Right={
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={onDelParticipant}
          >
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{
                color: getColor(
                  deleteCount === 0 ? 'text_disable' : 'text_enable'
                ),
              }}
            >
              {tr('_uikit_group_del_member_button', deleteCount)}
            </Text>
          </Pressable>
        }
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else if (participantType === 'change-owner') {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
          >
            <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_group_change_owner_title')}
            </Text>
          </Pressable>
        }
        Right={<View style={{ width: 1, height: 1 }} />}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else if (participantType === 'mention') {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
          >
            <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('text') }}
            >{`@ mention`}</Text>
          </Pressable>
        }
        Right={<View style={{ width: 1, height: 1 }} />}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
          >
            <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
            <Text>
              {tr('_uikit_group_member_list_title', participantCount)}
            </Text>
          </Pressable>
        }
        Right={
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              iconName={'person_add'}
              style={{ width: 24, height: 24, padding: 6 }}
              onPress={onClickedAddParticipant}
            />
            <View style={{ width: 4 }} />
            <IconButton
              iconName={'person_minus'}
              style={{ width: 24, height: 24, padding: 6 }}
              onPress={onClickedDelParticipant}
            />
          </View>
        }
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  }
};
