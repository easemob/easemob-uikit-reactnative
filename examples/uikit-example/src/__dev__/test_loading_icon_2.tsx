import React, { useRef } from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  // 圆环旋转插值（0 → 1 映射为 0deg → 360deg）
  const ringRotation = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const startRingAnimation = () => {
    Animated.timing(ringRotate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const stopRingAnimation = () => {
    Animated.timing(ringRotate, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              // Bind opacity to animated value
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.fadingText}>Fading View!</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <Button title="Fade In View" onPress={fadeIn} />
          <Button title="Fade Out View" onPress={fadeOut} />
        </View>
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [{ rotateZ: ringRotation }],
            },
          ]}
        />
        <Button title="Start Ring Animation" onPress={startRingAnimation} />
        <Button title="Stop Ring Animation" onPress={stopRingAnimation} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
  // 圆环样式（使用边框实现圆环）
  ring: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#007AFF', // 蓝色边框
    borderTopColor: 'transparent', // 顶部透明，形成圆环
    borderRadius: 20, // 圆形
  },
});

export default App;
