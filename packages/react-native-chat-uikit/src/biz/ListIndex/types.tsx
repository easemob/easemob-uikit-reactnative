import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Index Component model.
 */
export type IndexModel = { indexTitle: string };
/**
 * Index Component properties.
 */
export type ListIndexProps = {
  /**
   * Index data. The index data is sorted in ascending order.
   *
   * For example: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
   */
  indexTitles: ReadonlyArray<string>;
  /**
   * Callback notification when the index is selected.
   */
  onIndexSelected?: (index: number) => void;
  /**
   * Container style for the index component.
   */
  indexContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Container style for the font component.
   */
  fontContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Whether to display the selected index letter.
   */
  isVisibleLetter?: boolean;
};
