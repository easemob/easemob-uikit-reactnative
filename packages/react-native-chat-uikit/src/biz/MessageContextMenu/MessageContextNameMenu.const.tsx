import { Dimensions } from 'react-native';

let screenWidth = Dimensions.get('window').width;
export const MESSAGE_CONTEXT_NAME_MENU_MAX_WIDTH =
  screenWidth >= 392 ? screenWidth - 42 : screenWidth - 32;
