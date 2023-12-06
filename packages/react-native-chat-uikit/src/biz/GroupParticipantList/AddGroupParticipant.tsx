import * as React from 'react';

import type { GroupParticipantModel } from '../../chat';
import { ContactModel, ResultCallback, useChatContext } from '../../chat';
import { ContactList, ContactListProps } from '../ContactList';

export type AddGroupParticipantProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch' | 'groupId' | 'selectedData'
> & {
  onAddedResult?: ResultCallback<void>;
};
export function AddGroupParticipant(props: AddGroupParticipantProps) {
  const { groupId, onAddedResult } = props;
  const im = useChatContext();
  const onAddGroupParticipantResult = React.useCallback(
    (added: ContactModel[]) => {
      if (added && added.length > 0 && groupId) {
        console.log('test:zuoyu:AddGroupParticipant', added);
        im.addGroupMembers({
          groupId,
          members: added.map((item) => {
            return {
              id: item.userId,
              name: item.nickName,
              avatar: item.avatar,
            } as GroupParticipantModel;
          }),
          welcomeMessage: 'Welcome to the group',
          onResult: (result) => {
            onAddedResult?.(result);
          },
        });
      }
    },
    [groupId, im, onAddedResult]
  );
  return (
    <ContactList
      contactType={'add-group-member'}
      onAddGroupParticipantResult={onAddGroupParticipantResult}
      {...props}
    />
  );
}
