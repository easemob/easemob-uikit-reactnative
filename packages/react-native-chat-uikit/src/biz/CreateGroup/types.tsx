import type { ContactModel, GroupModel, ResultCallback } from '../../chat';
import type { ContactListProps } from '../ContactList';

/**
 * Create Group Component properties.
 */
export type CreateGroupProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClickedItem' | 'onClickedSearch' | 'onBack'
> & {
  /**
   * Selected contacts.
   */
  selectedData?: ContactModel[];
  /**
   * Create group result callback.
   */
  onCreateGroupResult?: ResultCallback<GroupModel>;
  /**
   * Set the callback notification of the group name when creating a group. If not set the default group name is used.
   */
  onGetGroupName?: (params: { selected: ContactModel[] }) => string;
};
