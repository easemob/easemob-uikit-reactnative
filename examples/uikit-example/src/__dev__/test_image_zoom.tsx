import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Container } from 'react-native-chat-uikit';

import { ImageZoom } from '../../../../packages/react-native-chat-uikit/src/ui/ImagePreview/__private__/image-zoom.component';

export function Test1() {
  return (
    <View>
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={200}
        imageHeight={200}
      >
        <Image
          style={{ width: 200, height: 200 }}
          source={{
            // uri: 'https://i.pravatar.cc/300',
            uri: 'https://cdn2.iconfinder.com/data/icons/packyuuyake/Firefox.png',
          }}
        />
      </ImageZoom>
    </View>
  );
}

export default function TestImageZoom() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <Test1 />
    </Container>
  );
}
