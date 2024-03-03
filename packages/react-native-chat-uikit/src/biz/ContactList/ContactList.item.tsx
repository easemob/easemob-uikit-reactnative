import * as React from 'react';
import { Pressable, SectionListData, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton, Text2Button } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { IndexModel } from '../ListIndex';
import { ListItem } from '../ListItem';
import type { ContactItemProps, ContactListItemProps } from './types';

/**
 * Contact list item component.
 */
export function ContactListItem(props: ContactListItemProps) {
  const {
    section,
    onClicked,
    onCheckClicked,
    onLongPressed,
    contactType,
    onForwardClicked,
  } = props;
  const { checked, disable, forwarded } = section;
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
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
    disable: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    btn_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
  });

  const _onForwardClicked = React.useCallback(() => {
    if (contactType === 'forward-message' && forwarded !== true) {
      onForwardClicked?.(section);
    }
  }, [contactType, forwarded, onForwardClicked, section]);

  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
      }}
    >
      <Pressable
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
        onPress={() => {
          if (contactType === 'forward-message') {
            return;
          }
          if (checked !== undefined) {
            if (disable !== true) {
              onCheckClicked?.(section);
            }
          } else {
            onClicked?.(section);
          }
        }}
        onLongPress={() => {
          if (contactType === 'forward-message') {
            return;
          }
          onLongPressed?.(section);
        }}
      >
        {checked !== undefined ? (
          <View style={{ marginRight: 12 }}>
            <IconButton
              iconName={
                checked !== false ? 'checked_rectangle' : 'unchecked_rectangle'
              }
              style={{
                height: 28,
                width: 28,
                tintColor: getColor(
                  checked !== false && disable !== true ? 'enable' : 'disable'
                ),
              }}
              onPress={() => {
                if (disable !== true) {
                  onCheckClicked?.(section);
                }
              }}
            />
          </View>
        ) : null}
        <Avatar url={section.userAvatar} size={40} />
        <View
          style={{
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: checked !== undefined ? '70%' : '80%',
          }}
        >
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{ color: getColor('t1') }}
          >
            {section.userName ?? section.userId}
          </SingleLineText>
        </View>

        {contactType === 'forward-message' ? (
          <>
            <View style={{ flexGrow: 1 }} />
            <Text2Button
              sizesType={'small'}
              radiusType={'extraSmall'}
              contentType={'only-text'}
              text={tr(forwarded === true ? 'forwarded' : 'forward')}
              style={{
                backgroundColor: getColor('btn_bg'),
              }}
              textStyle={{
                color: getColor(forwarded === true ? 'disable' : 't1'),
              }}
              onPress={_onForwardClicked}
            />
          </>
        ) : null}
      </Pressable>
      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 68,
        }}
      />
    </View>
  );
}
export const ContactListItemMemo = React.memo(ContactListItem);

/**
 * Contact list item header component.
 */
export function ContactListItemHeader(
  props: SectionListData<ContactListItemProps, IndexModel>
) {
  const { indexTitle } = props;
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
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });
  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
        },
      ]}
    >
      <View
        style={[
          {
            height: 32,
            justifyContent: 'center',
            paddingLeft: 16,
          },
        ]}
      >
        <SingleLineText
          paletteType={'title'}
          textType={'small'}
          style={{
            color: getColor('t2'),
          }}
        >
          {indexTitle}
        </SingleLineText>
      </View>
    </View>
  );
}
export const ContactListItemHeaderMemo = React.memo(ContactListItemHeader);

/**
 * Contact list item header component.
 */
export function ContactItem(props: ContactItemProps) {
  const { icon, name, count, hasArrow, onClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    icon: {
      light: colors.neutral[6],
      dark: colors.neutral[5],
    },
  });
  return (
    <ListItem
      LeftName={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {icon ? (
            <>
              <Icon name={icon} style={{ height: 18, width: 18 }} />
              <View style={{ width: 13 }} />
            </>
          ) : null}

          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{
              color: getColor('bg'),
            }}
          >
            {name}
          </SingleLineText>
        </View>
      }
      RightText={count}
      RightIcon={
        hasArrow ? (
          <Icon
            name={'chevron_right'}
            style={{
              height: 20,
              width: 20,
              tintColor: getColor('icon'),
            }}
          />
        ) : undefined
      }
      onClicked={onClicked}
      containerStyle={{
        marginHorizontal: 16,
      }}
    />
  );
}
