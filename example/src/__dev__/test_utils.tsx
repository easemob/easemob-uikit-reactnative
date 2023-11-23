import * as React from 'react';
import { Text, View } from 'react-native';
import { Container, HighText } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Split() {
  const keyword = '张三';
  const list = '张三我知道张三的秘密,张三也知道张三'.split(keyword);
  console.log('test:zuoyu:Utils', list);
  const List = () => {
    return list.map((item, index) => {
      console.log('test:zuoyu:', item, index, list.length);
      if (item.length === 0) {
        if (index !== list.length - 1) {
          return (
            <Text key={index} style={{ color: 'red' }}>
              {keyword}
            </Text>
          );
        } else {
          return <View key={index} />;
        }
      } else {
        return (
          <View key={index} style={{ flexDirection: 'row' }}>
            <Text key={index * 10 + 1} style={{ color: 'orange' }}>
              {item}
            </Text>
            <Text key={index * 10 + 2} style={{ color: 'red' }}>
              {keyword}
            </Text>
          </View>
        );
      }
    });
  };
  return (
    <SafeAreaView>
      <View
        style={{
          width: '100%',
          height: 100,
          // backgroundColor: 'red',
          flexDirection: 'row',
        }}
      >
        {List()}
      </View>
      <View style={{ width: 100 }}>
        <Text
          numberOfLines={1}
          onTextLayout={(e) => {
            console.log(
              'test:zuoyu:Utils',
              e.nativeEvent.lines,
              e.nativeEvent.target
            );
          }}
        >
          {'我要省略号我要省略号我要省略号我要省略号我要省略号我要省略号'}
        </Text>
      </View>
      <HighText
        keyword={'张三'}
        content={'张三我知道张三的秘密,张三也知道张三'}
      />
    </SafeAreaView>
  );
}

export default function TestUtils() {
  return (
    <Container appKey={''}>
      <Split />
    </Container>
  );
}
