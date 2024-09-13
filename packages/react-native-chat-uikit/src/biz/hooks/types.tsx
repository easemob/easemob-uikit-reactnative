import type { AlertRef } from '../../ui/Alert';
import type { MessageNameMenuRef } from '../types';
import type { InitMenuItemsType } from '../types';

export type BasicActionsProps = {
  /**
   * menu reference.
   */
  menuRef: React.RefObject<MessageNameMenuRef>;
  /**
   * alert reference.
   */
  alertRef: React.RefObject<AlertRef>;
  /**
   * Registrar. If you need to customize menu items, you can implement this method and return the custom menu items based on the default menu items.
   */
  onInit?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};
