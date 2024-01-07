import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import type { ContactListNavigationBarProps } from './types';

type _ContactListNavigationBarProps = ContactListNavigationBarProps & {
  selectedCount?: number;
  selectedMemberCount?: number;
  avatarUrl?: string;
  onClickedAddGroupParticipant?: () => void;
  onClickedCreateGroup?: () => void;
};
export const ContactListNavigationBar = (
  props: _ContactListNavigationBarProps
) => {
  const {
    contactType,
    avatarUrl,
    onClickedNewContact,
    onBack,
    onClickedCreateGroup,
    selectedCount,
    onClickedAddGroupParticipant,
    selectedMemberCount,
    customNavigationBar,
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
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  if (customNavigationBar) {
    return <>{customNavigationBar}</>;
  }

  if (contactType === 'contact-list') {
    return (
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row' }}>
            <Avatar url={avatarUrl} size={32} />
          </View>
        }
        Right={TopNavigationBarRight}
        RightProps={{
          onClicked: onClickedNewContact,
          iconName: 'person_add',
        }}
        Title={TopNavigationBarTitle({ text: 'Contacts' })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else if (contactType === 'new-conversation') {
    return (
      <TopNavigationBar
        Left={
          <Pressable style={{ flexDirection: 'row' }} onPress={onBack}>
            <Text paletteType={'label'} textType={'medium'}>
              {tr('cancel')}
            </Text>
          </Pressable>
        }
        Right={<View style={{ width: 32, height: 32 }} />}
        Title={TopNavigationBarTitle({ text: tr('_uikit_new_conv_title') })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else if (contactType === 'create-group') {
    return (
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24 }}
              onPress={onBack}
            />
            <Text
              paletteType={'title'}
              textType={'medium'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_create_group_title')}
            </Text>
          </View>
        }
        Right={
          <Pressable onPress={onClickedCreateGroup}>
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{ color: getColor('text_enable') }}
            >
              {tr('_uikit_create_group_button', selectedCount)}
            </Text>
          </Pressable>
        }
        Title={TopNavigationBarTitle({ text: '' })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else if (contactType === 'add-group-member') {
    return (
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24 }}
              onPress={onBack}
            />
            <Text
              paletteType={'title'}
              textType={'medium'}
              style={{ color: getColor('text') }}
            >
              {tr('_uikit_add_group_member_title')}
            </Text>
          </View>
        }
        Right={
          <Pressable onPress={onClickedAddGroupParticipant}>
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{ color: getColor('text_enable') }}
            >
              {tr('_uikit_add_group_member_button', selectedMemberCount)}
            </Text>
          </Pressable>
        }
        Title={TopNavigationBarTitle({ text: '' })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else if (contactType === 'share-contact') {
    return (
      <TopNavigationBar
        Left={
          <Pressable style={{ flexDirection: 'row' }} onPress={onBack}>
            <Text paletteType={'label'} textType={'medium'}>
              {tr('cancel')}
            </Text>
          </Pressable>
        }
        Right={<View style={{ width: 32, height: 32 }} />}
        Title={TopNavigationBarTitle({ text: tr('_uikit_share_card_title') })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  } else {
    return null;
  }
};
