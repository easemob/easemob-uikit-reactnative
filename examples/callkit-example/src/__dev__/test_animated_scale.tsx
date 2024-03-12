// from: https://github.com/justcodejs/RN_Zero2Hero_Tutorial09/blob/master/src/screens/search/index.js
import * as React from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  View,
} from 'react-native';
import { Text1Button } from 'react-native-chat-uikit';

type Props = {};
type State = {
  loadingScale: Animated.Value;
  loadingOpacity: Animated.Value;
};
export default class TestAnimatedScale extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingScale: new Animated.Value(0),
      loadingOpacity: new Animated.Value(1),
    };
  }

  animateLoading = (toSmall: boolean) => {
    return Animated.parallel([
      Animated.timing(this.state.loadingScale, {
        toValue: toSmall === true ? 0 : 1,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(this.state.loadingOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]);
  };

  getLogoImageScale = () => {
    const { loadingScale } = this.state;

    return loadingScale.interpolate({
      inputRange: [0, 1],
      outputRange: ['50%', '100%'],
      extrapolate: 'clamp',
      // useNativeDriver: false,
    });
  };

  public render(): React.ReactNode {
    return (
      <View
        style={{ top: 44, flex: 1 }}
        onLayout={(event: LayoutChangeEvent) => {
          console.log('test:nativeEvent:', event.nativeEvent);
        }}
      >
        <Text1Button
          style={{ height: 40, width: 80 }}
          onPress={() => {
            this.animateLoading(true).start();
          }}
          text={'to small'}
        />
        <Text1Button
          style={{ height: 40, width: 80 }}
          onPress={() => {
            this.animateLoading(false).start();
          }}
          text={'to big'}
        />
        <Pressable
          onPress={() => {
            this.animateLoading(false).start();
          }}
        >
          <Animated.View
            style={{
              // height: this.state.loadingScale,
              height: this.getLogoImageScale(),
              width: this.getLogoImageScale(),
              backgroundColor: 'red',
              // opacity: this.state.loadingOpacity,
            }}
          />
        </Pressable>
      </View>
    );
  }
}
