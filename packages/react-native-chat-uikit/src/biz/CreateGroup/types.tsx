import type { ContactModel, GroupModel, ResultCallback } from '../../chat';
import type { ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onSearch' | 'onBack'
> & {
  selectedData?: ContactModel[];
  onCreateGroupResult?: ResultCallback<GroupModel>;
};
