import * as React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Container,
  ImagePreview,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test1() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        }}
        style={{ flex: 1 }}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(200, 100, 100, 0.5)',
            // opacity: 0,
          },
        ]}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(100, 100, 200, 0.5)',
            width: 200,
            height: 200,
            // opacity: 0,
          }}
        >
          <Image
            source={{
              uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            }}
            style={{ height: 100, width: 100 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export function Test2() {
  return (
    <ImageBackground
      source={{
        uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
      }}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.transparentCenter} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  transparentCenter: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // backgroundColor: 'red',
  },
});

export class Test3 extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'transparent',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -50 }, { translateY: -50 }],
          }}
        >
          <Text>Hello, world!</Text>
        </View>
      </View>
    );
  }
}

export function NineGrid() {
  return (
    <ImageBackground
      source={{
        uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
      }}
      style={styles.container}
    >
      <View style={styles2.container}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={i === 4 ? styles2.item5 : styles2.item} />
        ))}
      </View>
    </ImageBackground>
  );
}

const styles2 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // backgroundColor: 'red',
  },
  item: {
    width: '30%',
    height: '30%',
    aspectRatio: 1,
    margin: '1%',
    backgroundColor: 'skyblue',
  },
  item5: {
    width: '30%',
    height: '30%',
    aspectRatio: 1,
    margin: '1%',
    backgroundColor: 'transparent',
  },
});

export function Test4() {
  return (
    <ImageBackground
      source={{
        uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
      }}
      style={{ flex: 1 }}
    >
      <View
        onTouchEnd={() => {
          console.log('onTouchEnd');
        }}
        style={{ flex: 1 }}
      >
        <View style={styles3.mask} />
        <View style={styles3.container}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={i}
              style={
                i === 0 || i === 2 || i === 6 || i === 8
                  ? styles3.item
                  : i === 1 || i === 7
                  ? styles3.h
                  : i === 3 || i === 5
                  ? styles3.w
                  : styles3.item5
              }
              pointerEvents={i === 4 ? 'none' : 'auto'}
              onTouchEnd={() => {
                console.log('onTouchEnd', i);
              }}
            />
          ))}
        </View>
        <View style={styles3.mask} />
      </View>
    </ImageBackground>
  );
}

const unitWidth = 10;
const bigWidth = Dimensions.get('window').width;

const styles3 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-evenly',
    // backgroundColor: 'red',
  },
  item: {
    width: unitWidth,
    height: unitWidth,
    // aspectRatio: 1,
    // margin: '1%',
    backgroundColor: 'darkorchid',
  },
  h: {
    width: bigWidth - unitWidth * 2,
    height: unitWidth,
    // aspectRatio: 1,
    // margin: '1%',
    backgroundColor: 'darkorchid',
  },
  w: {
    height: bigWidth - unitWidth * 2,
    width: unitWidth,
    // aspectRatio: 1,
    // margin: '1%',
    backgroundColor: 'darkorchid',
  },
  item5: {
    width: bigWidth - unitWidth * 2,
    height: bigWidth - unitWidth * 2,
    // aspectRatio: 1,
    // margin: '1%',
    backgroundColor: 'transparent',
    // backgroundColor: 'red',
    // opacity: 0,
  },
  mask: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export function Test5() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // width: 300,
        // height: 300,
        // backgroundColor: 'red',
      }}
    >
      <ImagePreview
        source={{
          uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        }}
        imageStyle={{
          width: 300,
          height: 300,
        }}
        containerStyle={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <View
        // onTouchEnd={() => {
        //   console.log('onTouchEnd');
        // }}
        style={{ flex: 1, position: 'absolute' }}
        pointerEvents={'none'}
      >
        <View style={styles3.mask} />
        <View style={styles3.container}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={i}
              style={
                i === 0 || i === 2 || i === 6 || i === 8
                  ? styles3.item
                  : i === 1 || i === 7
                  ? styles3.h
                  : i === 3 || i === 5
                  ? styles3.w
                  : styles3.item5
              }
              pointerEvents={i === 4 ? 'none' : 'auto'}
              // onTouchEnd={() => {
              //   console.log('onTouchEnd', i);
              // }}
            />
          ))}
        </View>
        <View style={styles3.mask} />
      </View>
    </View>
  );
}

export default function TestImageMask() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test5 />
    </Container>
  );
}
