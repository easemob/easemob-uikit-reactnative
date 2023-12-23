import * as React from 'react';

import { ContactList, ContactListProps } from '../ContactList';

export type ShareContactProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch' | 'onBack'
>;
export function ShareContact(props: ShareContactProps) {
  return <ContactList contactType={'share-contact'} {...props} />;
}
