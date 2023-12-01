import * as React from 'react';

import { ContactList, ContactListProps } from '../ContactList';

export type NewConversationProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch'
>;
export function NewConversation(props: NewConversationProps) {
  return <ContactList contactType={'new-conversation'} {...props} />;
}
