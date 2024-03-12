import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// https://www.figma.com/file/W2Ob8RurYwIlHXmNOQ5wo0/%E8%B7%A8%E5%B9%B3%E5%8F%B0Demo-ACD?node-id=1%3A535&t=g4AesECH1Y0mjk7w-0
const DESIGNED_DEVICE_WIDTH = 375;

export function createAppScaleFactor(deviceWidth = DESIGNED_DEVICE_WIDTH) {
  let ratio = Math.min(width, height) / deviceWidth;
  ratio = 1;
  return {
    scaleFactor: (dp: number) => PixelRatio.roundToNearestPixel(dp * ratio),
    ratio: ratio,
  };
}
