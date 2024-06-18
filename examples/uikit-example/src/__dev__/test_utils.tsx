import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Container,
  containsChinese,
  getPinyinFirsLetter,
  HighText,
  HighUrl,
  splitStringByUrl,
  splitStringWithDelimiter,
  useUrlPreview,
} from 'react-native-chat-uikit';
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
      <HighText
        numberOfLines={10}
        keyword={'https://github.com/easemob/emclient-android/pull/1446/files'}
        content={
          'sdfhttps://github.com/easemob/emclient-android/pull/1446/fileshttps://github.comhttps://github.com/easemob/emclient-android/pull/1446/filesfgh'
        }
        containerStyle={{ textDecorationLine: 'underline' }}
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

export function TestSplit2() {
  const arr =
    'sdfhttps://github.com/easemob/emclient-android/pull/1446/fileshttps://github.com/easemob/emclient-android/pull/1446/filesfgh';
  console.log(
    'test:zuoyu:TestSplit',
    splitStringWithDelimiter(
      arr,
      'https://github.com/easemob/emclient-android/pull/1446/files'
    )
  );
  return <></>;
}
export function TestUrlList() {
  const { getUrlListFromText } = useUrlPreview();
  const arr =
    'sdf https://www.github.com/easemob/emclient-android/pull/1446/files https://github.com/ poi https://www.github.com/easemob/emclient-android/pull/1446/files';
  console.log('test:zuoyu:TestUrlList', getUrlListFromText(arr));
  return <></>;
}
export function TestSplit3() {
  const arr =
    'sdf https://github.com/easemob/emclient-android/pull/1446/files https://github.com https://github.com/easemob/emclient-android/pull/1446/files fgh';
  console.log('test:zuoyu:TestSplit2', splitStringByUrl(arr));
  return <></>;
}
export function TestSplit4() {
  const { getUrlFromText } = useUrlPreview();
  const arr =
    'sdf https://www.github.com/easemob/emclient-android/pull/1446/files poi https://www.github.com/easemob/emclient-android/pull/1446/files';
  console.log('test:zuoyu:TestSplit4', getUrlFromText(arr));
  return <></>;
}
export function TestHighUrl() {
  const arr =
    'sdf_https://www.github.com/easemob/emclient-android/pull/1446/files https://github.com/ poi https://www.github.com/easemob/emclient-android/pull/1446/files fds';
  return (
    <HighUrl
      content={arr}
      onClicked={(url) => {
        console.log('test:zuoyu:click', url);
      }}
    />
  );
}

export function TestSplit5() {
  const arr =
    'sdf https://www.github.com/easemob/emclient-android/pull/1446/files https://github.com/ poi https://www.github.com/easemob/emclient-android/pull/1446/files fds';
  console.log('test:zuoyu:TestSplit5', splitStringByUrl(arr));
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
      <View style={{ height: 100 }} />
      <TestHighUrl />
    </Container>
  );
}
