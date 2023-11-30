import * as React from 'react';

import type { ContactModel } from '../../chat';
import { ContactList, ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch'
> & {
  selectedData?: ContactModel[];
};
export function CreateGroup(props: CreateGroupProps) {
  return (
    <ContactList
      contactType={'create-group'}
      choiceType={'multiple'}
      {...props}
    />
  );
}
