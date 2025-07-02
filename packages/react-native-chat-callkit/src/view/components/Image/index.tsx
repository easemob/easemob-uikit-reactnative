import type { ImageProps as RNImageProps } from 'react-native';

export type ImageProps = Omit<RNImageProps, 'onLoad' | 'onError'> & {
  onLoad?: (event: { width: number; height: number }) => void;
  onError?: (event: { error?: unknown }) => void;
  tintColor?: string;
};

export type ImageComponent = (props: ImageProps) => JSX.Element;

function getImageComponent(): ImageComponent {
  return require('./Image').default;
}

export default getImageComponent();
