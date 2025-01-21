import * as React from 'react';
import { ImageLoadEventData, NativeSyntheticEvent, View } from 'react-native';

import {
  DefaultImage,
  DefaultImage2,
  Icon,
  ICON_ASSETS,
  Image,
} from '../rename.room';

export default function test_image() {
  return <ImageComponent3 />;
}

/**
 * Simulation failed to load images.
 * @returns
 */
export function ImageComponent(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
        <Image
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'green',
          }}
          source={{
            uri: 'https://cdn4.iconfinder.com/data/icons/multimedia-75/512/multimedia-01-1024sssssss2.png',
            // uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
          failedSource={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          onLoad={(event: NativeSyntheticEvent<ImageLoadEventData>) => {
            console.log('test:onLoad:event:', event.nativeEvent.source);
          }}
        />
      </View>
    </View>
  );
}

/**
 * Simulation failed to load local images.
 * @returns
 */
export function ImageComponent2(): JSX.Element {
  const s = ICON_ASSETS.airplane('');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
        <Image
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'green',
            tintColor: 'orange',
          }}
          source={s}
          failedSource={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          onLoad={(event: NativeSyntheticEvent<ImageLoadEventData>) => {
            console.log('test:onLoad:event:', event.nativeEvent.source);
          }}
        />
      </View>
    </View>
  );
}

/**
 * Load default image.
 * @returns
 */
export function ImageComponent3(): JSX.Element {
  const d = ICON_ASSETS.airplane('');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
        <DefaultImage
          style={{
            height: 100,
            width: 100,
            // backgroundColor: 'green',
            tintColor: 'orange',
          }}
          source={{
            uri: 'https://cdn4.iconfinder.com.test/data/icons/multimedia-75/512/multimedia-01-1024.png',
          }}
          onLoad={(event: NativeSyntheticEvent<ImageLoadEventData>) => {
            console.log('test:onLoad:event:', event.nativeEvent.source);
          }}
          defaultSource={d}
        />
      </View>
    </View>
  );
}

/**
 * Load default image.
 * @returns
 */
export function ImageComponent4(): JSX.Element {
  const d = ICON_ASSETS.airplane('');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
        <DefaultImage2
          style={{
            height: 100,
            width: 100,
            // backgroundColor: 'green',
            tintColor: 'orange',
          }}
          source={{
            uri: 'https://cdn4.iconfinder.com.test/data/icons/multimedia-75/512/multimedia-01-1024.png',
            cache: 'reload',
          }}
          onLoad={(event: NativeSyntheticEvent<ImageLoadEventData>) => {
            console.log('test:onLoad:event:', event.nativeEvent.source);
          }}
          defaultSource={d}
        />
      </View>
    </View>
  );
}

export function IconComponent(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
        <Icon
          style={{
            height: 100,
            width: 100,
            // backgroundColor: 'green',
            tintColor: 'orange',
          }}
          name={'star_fill'}
        />
      </View>
    </View>
  );
}
