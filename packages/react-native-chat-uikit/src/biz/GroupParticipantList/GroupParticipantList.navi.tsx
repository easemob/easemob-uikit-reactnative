import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useChatContext } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { TopNavigationBar } from '../TopNavigationBar';
import type { GroupParticipantListNavigationBarProps } from './types';

type _GroupParticipantListNavigationBarProps =
  GroupParticipantListNavigationBarProps & {
    groupId: string;
    ownerId?: string;
    onDelParticipant?: () => void;
    onSelectParticipant?: () => void;
    selectedCount?: number;
    participantCount?: number;
  };
export const GroupParticipantListNavigationBar = (
  props: _GroupParticipantListNavigationBarProps
) => {
  const {
    participantType,
    onBack,
    onDelParticipant,
    onSelectParticipant,
    selectedCount,
    participantCount,
    onClickedAddParticipant,
    onClickedDelParticipant,
    customNavigationBar,
    ownerId,
  } = props;
  const { tr } = useI18nContext();
  const im = useChatContext();
  const isOwner = ownerId === im.userId;
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
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    p: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  if (customNavigationBar) {
    return <>{customNavigationBar}</>;
  }

  if (participantType === 'delete') {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}
            onPress={onBack}
          >
            <Icon
              name={'chevron_left'}
              style={{ width: 24, height: 24, tintColor: getColor('icon') }}
            />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_group_del_member_title')}
            </Text>
          </Pressable>
        }
        Right={
          isOwner === true ? (
            <Pressable
              style={{ flexDirection: 'row' }}
              onPress={onDelParticipant}
            >
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    selectedCount === 0 ? 'text_disable' : 'text_enable'
                  ),
                }}
              >
                {tr('_uikit_group_del_member_button', selectedCount)}
              </Text>
            </Pressable>
          ) : null
        }
      />
    );
  } else if (participantType === 'change-owner') {
    return (
      <TopNavigationBar
        Left={
          isOwner === true ? (
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}
              onPress={onBack}
            >
              <Icon
                name={'chevron_left'}
                style={{ width: 24, height: 24, tintColor: getColor('icon') }}
              />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('text') }}
              >
                {tr('_uikit_group_change_owner_title')}
              </Text>
            </Pressable>
          ) : null
        }
        Right={<View style={{ width: 1, height: 1 }} />}
      />
    );
  } else if (participantType === 'mention') {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}
            onPress={onBack}
          >
            <Icon
              name={'chevron_left'}
              style={{ width: 24, height: 24, tintColor: getColor('icon') }}
            />
            <Text
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('text') }}
            >{`@ mention`}</Text>
          </Pressable>
        }
        Right={<View style={{ width: 1, height: 1 }} />}
      />
    );
  } else if (participantType === 'av-meeting') {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}
            onPress={onBack}
          >
            <Icon
              name={'chevron_left'}
              style={{ width: 24, height: 24, tintColor: getColor('icon') }}
            />
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_group_av_meeting')}
            </Text>
          </Pressable>
        }
        Right={
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={onSelectParticipant}
          >
            <SingleLineText
              textType={'medium'}
              paletteType={'label'}
              style={{
                color: getColor(
                  selectedCount && selectedCount > 0 ? 'p' : 'text_disable'
                ),
              }}
            >
              {tr('_uikit_group_av_button', selectedCount ?? 0)}
            </SingleLineText>
          </Pressable>
        }
      />
    );
  } else {
    return (
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}
            onPress={onBack}
          >
            <Icon
              name={'chevron_left'}
              style={{ width: 24, height: 24, tintColor: getColor('icon') }}
            />
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_group_member_list_title', participantCount)}
            </SingleLineText>
          </Pressable>
        }
        Right={
          isOwner === true ? (
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={{ padding: 6 }}>
                <IconButton
                  iconName={'person_add'}
                  style={{ width: 24, height: 24 }}
                  onPress={onClickedAddParticipant}
                />
              </Pressable>
              <View style={{ width: 4 }} />
              <Pressable style={{ padding: 6 }}>
                <IconButton
                  iconName={'person_minus'}
                  style={{ width: 24, height: 24, padding: 6 }}
                  onPress={onClickedDelParticipant}
                />
              </Pressable>
            </View>
          ) : null
        }
      />
    );
  }
};
