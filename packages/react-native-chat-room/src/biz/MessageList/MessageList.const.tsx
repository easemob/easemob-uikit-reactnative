import { Dimensions } from 'react-native';

export const gAspectRatio = 296 / 164;
export const gMessageListMarginLeft = 16;
export const gMessageListMarginRight = 78;
export const gMessageListWidth =
  Dimensions.get('window').width -
  gMessageListMarginLeft -
  gMessageListMarginRight;
export const gMessageListHeight = gMessageListWidth / gAspectRatio;
export const gMessageListMarginBottom = 4;
export const gIdleTimeout = 3000;
export const gMaxMessageCount = 1000;
export const gGiftIconWidth = 18;
export const gEllipsizeWidth = 12;
