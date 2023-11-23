import type { StyleProp, ViewStyle } from 'react-native';

export type IndexModel = { indexTitle: string };
export type ListIndexProps = {
  indexTitles: ReadonlyArray<string>;
  onIndexSelected?: (index: number) => void;
  indexContainerStyle?: StyleProp<ViewStyle>;
  fontContainerStyle?: StyleProp<ViewStyle>;
};
