import * as React from 'react';
import { Image as RNImage, ImageSourcePropType } from 'react-native';

import type { ImageProps } from './types';

type ClassImageState = {
  _source: ImageSourcePropType;
};

export class ClassImage extends React.PureComponent<
  ImageProps,
  ClassImageState
> {
  ref: React.RefObject<React.ComponentRef<typeof RNImage> | null>;
  constructor(props: ImageProps) {
    super(props);
    this.ref = React.createRef<React.ComponentRef<typeof RNImage>>();
    this.state = {
      _source: props.source,
    };
  }
  render(): React.ReactNode {
    const { onError, failedSource, style, source, ...others } = this.props;
    source; // !!! ignore
    return (
      <RNImage
        ref={this.ref}
        style={[style]}
        source={this.state._source}
        onError={(event) => {
          if (onError) {
            onError(event);
          }
          if (failedSource) {
            this.setState({ _source: failedSource });
          }
        }}
        {...others}
      />
    );
  }
}
