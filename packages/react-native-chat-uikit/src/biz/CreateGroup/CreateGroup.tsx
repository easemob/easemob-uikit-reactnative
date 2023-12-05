import * as React from 'react';

import {
  ContactModel,
  GroupModel,
  ResultCallback,
  useChatContext,
} from '../../chat';
import { ContactList, ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch'
> & {
  selectedData?: ContactModel[];
  onCreateGroupResult?: ResultCallback<GroupModel>;
};
export function CreateGroup(props: CreateGroupProps) {
  const { onCreateGroupResult } = props;
  const im = useChatContext();
  const onCreateGroup = React.useCallback(
    (data?: ContactModel[]) => {
      if (data && data.length > 0) {
        im.CreateGroup({
          groupName: 'New Group',
          inviteMembers: data.map((item) => item.userId),
          onResult: (result) => {
            console.log('CreateGroup', result);
            onCreateGroupResult?.(result);
          },
        });
      }
    },
    [im, onCreateGroupResult]
  );
  return (
    <ContactList
      contactType={'create-group'}
      onCreateGroup={onCreateGroup}
      {...props}
    />
  );
}
