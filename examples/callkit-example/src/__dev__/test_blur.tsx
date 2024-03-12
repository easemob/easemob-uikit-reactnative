import { BlurView } from '@react-native-community/blur';
import * as React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';

export default function TestBlur(): JSX.Element {
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
      }}
    >
      <Image
        style={{ flex: 1 }}
        source={{
          uri: 'https://ts1.cn.mm.bing.net/th/id/R-C.6028a0ac0bf455164b2c2ccadc975bfc?rik=MZ8sFhylGh08Dw&riu=http%3a%2f%2fyesofcorsa.com%2fwp-content%2fuploads%2f2017%2f09%2fAustralian-Cattle-Dog-Photo1.jpg&ehk=9okoAHKb3Dmy1wXu57qLnq5E2E7UbasO2Zjkqh%2faEpo%3d&risl=&pid=ImgRaw&r=0',
        }}
      />
      <BlurView
        style={{ position: 'absolute', flex: 1, height, width }}
        blurType="light" // Values = dark, light, xlight .
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
    </View>
  );
}
