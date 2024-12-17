import * as React from 'react';
import { SafeAreaView as RNSafeAreaView, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export function SafeAreaComponent(): JSX.Element {
  const insets = useSafeAreaInsets();
  console.log('test:SafeAreaComponent', insets);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
    </SafeAreaView>
  );
}

export function SafeAreaComponent3(): JSX.Element {
  const insets = useSafeAreaInsets();
  console.log('test:SafeAreaComponent', insets);
  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
    </RNSafeAreaView>
  );
}

export function SafeAreaComponent2(): JSX.Element {
  const insets = useSafeAreaInsets();
  console.log('test:SafeAreaComponent', insets);
  return <View style={{ flex: 1, backgroundColor: 'blue' }} />;
}

export default function test_area() {
  return (
    <SafeAreaProvider>
      <SafeAreaComponent3 />
    </SafeAreaProvider>
  );
}
