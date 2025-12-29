import type {
  ImageProps as RNImageProps,
  ImageSourcePropType,
} from 'react-native';

export type IconResolutionType = '' | '2x' | '3x';
export type ImageProps = Omit<RNImageProps, 'source'> & {
  source: ImageSourcePropType;
  failedSource?: ImageSourcePropType;
};
