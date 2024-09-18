import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const screenWidth = 190; // 假设屏幕宽度为 125
const itemSize = 50; // 每个元素的宽度和高度都是 50
// const maxItemsPerRow = 5; // 每行最多放置 5 个元素

const EmojiList = () => {
  const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊']; // 示例数据

  return (
    <View style={styles.container}>
      {emojis.map((emoji, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth,
    backgroundColor: 'orange',
  },
  item: {
    width: itemSize,
    height: itemSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:
      (screenWidth - itemSize * Math.floor(screenWidth / itemSize)) /
      (Math.floor(screenWidth / itemSize) * 2),
  },
  emoji: {
    fontSize: 24,
  },
});

export default function test_flex_layout() {
  return (
    <View style={{ flex: 1, top: 100 }}>
      <EmojiList />
    </View>
  );
}
