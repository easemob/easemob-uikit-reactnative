import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Container,
  containsChinese,
  ConversationStorage,
  getPinyinFirsLetter,
  HighText,
  SingletonObjects,
  UIKitError,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Split() {
  const keyword = '张三';
  const list = '张三我知道张三的秘密,张三也知道张三'.split(keyword);
  console.log('test:zuoyu:Utils', list);
  const List = () => {
    return list.map((item, index) => {
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

export function UnitList() {
  const list = [1, 2, 1, 3, 5, 1, 2];
  const ret = list.filter((item, index, self) => {
    if (index === self.findIndex((t) => t === item)) {
      return true;
    } else {
      return false;
    }
  });
  console.log('test:zuoyu:UnitList', ret);
  return <></>;
}

export function CalcuCount() {
  const text = '中国人imin';
  console.log('test:zuoyu:UnitList', text.length);
  return <></>;
}

function generateRandomChineseName() {
  const familyNames = '赵钱孙李周吴郑王';
  const givenNames = '伟芳娜秀英敏静亮强磊冰洋勇艳娟涛春花飞跃平刚桂英';

  const randomFamilyName =
    familyNames[Math.floor(Math.random() * familyNames.length)];
  const randomGivenName1 =
    givenNames[Math.floor(Math.random() * givenNames.length)];
  const randomGivenName2 =
    givenNames[Math.floor(Math.random() * givenNames.length)];

  return randomFamilyName! + randomGivenName1! + randomGivenName2;
}

function generateRandomChineseNames(n: number) {
  const names = [];
  for (let i = 0; i < n; i++) {
    names.push(generateRandomChineseName());
  }
  return names;
}

export function TestPinyin() {
  const text = '汉字';
  const text2 = 'h汉字';
  const text3 = 'english';
  console.log(
    'test:zuoyu:TestPinyin',
    text,
    text2,
    getPinyinFirsLetter(text).at(0),
    getPinyinFirsLetter(text2).at(0),
    text.at(0),
    text.toLocaleLowerCase().at(0),
    containsChinese(text),
    containsChinese(text2),
    containsChinese(text3)
  );
  console.log('test:zuoyu:names:', generateRandomChineseNames(10));
  return <></>;
}

export function TestSingleton() {
  const c = SingletonObjects.getInstanceWithParams(ConversationStorage, {
    appKey: 'your-app-key',
  });
  const d = SingletonObjects.getInstanceWithParams(ConversationStorage, {
    appKey: 'your-app-key-2',
  });
  console.log('testSingle:', c === d);
  return <></>;
}

export function TestErrorType() {
  const e = new UIKitError({ code: 10000, desc: 'test', tag: 'hh' });
  const isError = e instanceof UIKitError;
  console.log('test:zuoyu:isError:', isError);
  const e2 = { code: 1, desc: 'test', tag: 'hh' };
  const isError2 = e2 instanceof UIKitError;
  console.log('test:zuoyu:isError2:', isError2);
  return <></>;
}

export default function TestUtils() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <TestErrorType />
    </Container>
  );
}
