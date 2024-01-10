import type { ContactModel, GroupModel, ResultCallback } from '../../chat';
import type { ContactListProps } from '../ContactList';

export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClickedItem' | 'onClickedSearch' | 'onBack'
> & {
  selectedData?: ContactModel[];
  onCreateGroupResult?: ResultCallback<GroupModel>;
  onGetGroupName?: (params: { selected: ContactModel[] }) => string;
};
