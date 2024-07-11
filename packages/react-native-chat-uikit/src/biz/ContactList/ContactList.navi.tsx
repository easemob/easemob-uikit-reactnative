import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { StatusAvatar } from '../Avatar';
import {
  TopNavigationBar,
  TopNavigationBarLeft,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import type { ContactListNavigationBarProps } from './types';

type _ContactListNavigationBarProps = ContactListNavigationBarProps & {
  userId?: string;
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
    userId,
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
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
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
            <StatusAvatar url={avatarUrl} size={32} userId={userId} />
          </View>
        }
        Right={TopNavigationBarRight}
        RightProps={{
          onClicked: onClickedNewContact,
          iconName: 'person_add',
        }}
        Title={TopNavigationBarTitle({ text: tr('_uikit_navi_title_contact') })}
      />
    );
  } else if (contactType === 'new-conversation') {
    return (
      <TopNavigationBar
        Left={
          <Pressable style={{ flexDirection: 'row' }} onPress={onBack}>
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{ color: getColor('icon') }}
            >
              {tr('cancel')}
            </Text>
          </Pressable>
        }
        Right={<View style={{ width: 32, height: 32 }} />}
        Title={TopNavigationBarTitle({ text: tr('_uikit_new_conv_title') })}
      />
    );
  } else if (contactType === 'create-group') {
    return (
      <TopNavigationBar
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_uikit_create_group_title')}
          />
        }
        Right={
          <Pressable
            onPress={onClickedCreateGroup}
            disabled={selectedCount && selectedCount > 0 ? false : true}
          >
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{
                color: getColor(
                  selectedCount === 0 ? 'text_disable' : 'enable'
                ),
              }}
            >
              {tr('_uikit_create_group_button', selectedCount)}
            </Text>
          </Pressable>
        }
        Title={TopNavigationBarTitle({ text: '' })}
      />
    );
  } else if (contactType === 'add-group-member') {
    return (
      <TopNavigationBar
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_uikit_add_group_member_title')}
          />
        }
        Right={
          <Pressable
            onPress={onClickedAddGroupParticipant}
            disabled={
              selectedMemberCount && selectedMemberCount > 0 ? false : true
            }
          >
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{
                color: getColor(
                  selectedMemberCount === 0 ? 'text_disable' : 'enable'
                ),
              }}
            >
              {tr('_uikit_add_group_member_button', selectedMemberCount)}
            </Text>
          </Pressable>
        }
        Title={TopNavigationBarTitle({ text: '' })}
      />
    );
  } else if (contactType === 'share-contact') {
    return (
      <TopNavigationBar
        Left={
          <Pressable style={{ flexDirection: 'row' }} onPress={onBack}>
            <Text
              paletteType={'label'}
              textType={'medium'}
              style={{ color: getColor('icon') }}
            >
              {tr('cancel')}
            </Text>
          </Pressable>
        }
        Right={<View style={{ width: 32, height: 32 }} />}
        Title={TopNavigationBarTitle({ text: tr('_uikit_share_card_title') })}
      />
    );
  } else {
    return null;
  }
};
