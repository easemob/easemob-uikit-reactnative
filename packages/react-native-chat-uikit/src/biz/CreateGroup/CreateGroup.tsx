import * as React from 'react';

import {
  ContactModel,
  GroupModel,
  ResultCallback,
  useChatContext,
} from '../../chat';
import { getCurTs } from '../../utils';
import { ContactList, ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch'
> & {
  selectedData?: ContactModel[];
  onCreateGroupResult?: ResultCallback<GroupModel>;
};
export function CreateGroup(props: CreateGroupProps) {
  const { onCreateGroupResult: propsOnCreateGroupResult } = props;
  const im = useChatContext();
  const onCreateGroupResultValue = React.useCallback(
    (data?: ContactModel[]) => {
      if (data && data.length > 0) {
        im.CreateGroup({
          groupName: getCurTs().toString(),
          inviteMembers: data.map((item) => item.userId),
          onResult: (result) => {
            console.log('CreateGroup', result);
            propsOnCreateGroupResult?.(result);
          },
        });
      }
    },
    [im, propsOnCreateGroupResult]
  );
  return (
    <ContactList
      contactType={'create-group'}
      onCreateGroupResultValue={onCreateGroupResultValue}
      {...props}
    />
  );
}
