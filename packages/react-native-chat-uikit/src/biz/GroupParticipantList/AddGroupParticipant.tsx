import * as React from 'react';

import type { GroupParticipantModel } from '../../chat';
import { ContactModel, ResultCallback, useChatContext } from '../../chat';
import { ContactList, ContactListProps } from '../ContactList';

/**
 * Add Group Participant Component properties.
 */
export type AddGroupParticipantProps = Pick<
  ContactListProps,
  | 'containerStyle'
  | 'onClickedItem'
  | 'onClickedSearch'
  | 'selectedData'
  | 'onBack'
> & {
  /**
   * Add group participant result callback.
   */
  onAddedResult?: ResultCallback<void>;
  /**
   * Group ID.
   */
  groupId: string;
};

/**
 * Add Group Participant Component.
 */
export function AddGroupParticipant(props: AddGroupParticipantProps) {
  const { groupId, onAddedResult } = props;
  const im = useChatContext();
  const onAddGroupParticipantResult = React.useCallback(
    (added: ContactModel[]) => {
      if (added && added.length > 0 && groupId) {
        im.addGroupMembers({
          groupId,
          members: added.map((item) => {
            return {
              memberId: item.userId,
              memberName: item.userName,
              memberAvatar: item.userAvatar,
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
