import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorybookView } from './storybook.requires';

const StorybookUIRoot = StorybookView.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
}) as unknown as React.ComponentType;

export default StorybookUIRoot;
