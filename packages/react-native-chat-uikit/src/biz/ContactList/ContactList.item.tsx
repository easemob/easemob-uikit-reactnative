import * as React from 'react';
import { DefaultSectionT, SectionListData, View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { ListItemProps, ListItemRequestProps } from '../types';

export type ContactListItemProps<DataT> = ListItemProps &
  ListItemRequestProps<DataT> & {};
export function ContactListItem<DataT = any>(
  props: ContactListItemProps<DataT>
) {
  const {} = props;
  return (
    <View
      style={{
        width: '100%',
        height: 59.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        paddingRight: 16,
        borderColor: 'grey',
        borderBottomWidth: 0.5,
      }}
    >
      <Avatar url={g_not_existed_url} size={40} />
      <View style={{ flexGrow: 1, paddingLeft: 12 }}>
        <Text paletteType={'title'} textType={'medium'}>
          {'用户昵称'}
        </Text>
      </View>
    </View>
  );
}
export const ContactListItemMemo = React.memo(ContactListItem);

export function ContactListItemHeader<DataT = any>(
  props: SectionListData<ContactListItemProps<DataT>, DefaultSectionT>
) {
  const { indexTitle } = props;
  return (
    <View style={[{ height: 32, justifyContent: 'center', paddingLeft: 16 }]}>
      <Text paletteType={'title'} textType={'small'}>
        {indexTitle}
      </Text>
    </View>
  );
}
export const ContactListItemHeaderMemo = React.memo(ContactListItemHeader);

export type ContactItemProps = {
  name: string;
  count?: React.ReactElement;
  hasArrow?: boolean;
  onClicked?: () => void;
};
export function ContactItem(props: ContactItemProps) {
  const { name, count, hasArrow, onClicked } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        paddingRight: 16,
        height: 53.5,
        borderColor: 'grey',
        borderBottomWidth: 0.5,
      }}
      onTouchEnd={onClicked}
    >
      <Text paletteType={'title'} textType={'medium'}>
        {name}
      </Text>
      <View style={{ flexGrow: 1 }} />
      {count}
      {hasArrow ? (
        <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
      ) : null}
    </View>
  );
}
