import type { ContactModel, GroupModel, ResultCallback } from '../../chat';
import type { ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onClickedSearch' | 'onBack'
> & {
  selectedData?: ContactModel[];
  onCreateGroupResult?: ResultCallback<GroupModel>;
};
