import * as React from 'react';

import { ContactModel, useChatContext } from '../../chat';
import { ContactList, ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch'
> & {
  selectedData?: ContactModel[];
};
export function CreateGroup(props: CreateGroupProps) {
  const im = useChatContext();
  const onCreateGroup = React.useCallback(
    (data?: ContactModel[]) => {
      if (data && data.length > 0) {
        im.CreateGroup({
          groupName: 'New Group',
          inviteMembers: data.map((item) => item.userId),
          onResult: (result) => {
            console.log('CreateGroup', result);
            // todo:
          },
        });
      }
    },
    [im]
  );
  return (
    <ContactList
      contactType={'create-group'}
      choiceType={'multiple'}
      onCreateGroup={onCreateGroup}
      {...props}
    />
  );
}
