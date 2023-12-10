import React from 'react';
import {
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GlobalContainer,
  ListIndex,
  useDelayExecTask,
} from 'react-native-chat-uikit';

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
  {
    title: 'Eesserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
  {
    title: 'Fesserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
  {
    title: 'Zesserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

export const IndexList = ({
  sections,
  onIndexSelect,
}: {
  sections: typeof DATA;
  onIndexSelect: (index: number) => void;
}) => (
  <View style={{ position: 'absolute', right: 10, top: 100 }}>
    {sections.map((section, index: number) => (
      <TouchableOpacity key={index} onPress={() => onIndexSelect(index)}>
        <Text>{section.title[0]}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const IndexList2 = ({
  sections,
  onIndexSelect,
}: {
  sections: typeof DATA;
  onIndexSelect: (index: number) => void;
}) => {
  const offsetRef = React.useRef(0);
  const maxIndex = sections.length - 1;
  const [currentIndex, setCurrentIndex] = React.useState<number | undefined>();
  const [currentTitle, setCurrentTitle] = React.useState<string | undefined>();
  const _onIndexSelect = (index: number) => {
    let _index = index;
    if (index < 0) {
      _index = 0;
    } else if (index > maxIndex) {
      _index = maxIndex;
    }
    setCurrentIndex(_index);
    setCurrentTitle(sections[_index]?.title[0]);
    onIndexSelect(_index);
  };
  const { delayExecTask } = useDelayExecTask(500, () => {
    setCurrentIndex(undefined);
    setCurrentTitle(undefined);
  });
  return (
    <>
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: 100,
        }}
        onLayout={(e) => {
          console.log('test:zuoyu:onLayout', e.nativeEvent.layout);
          offsetRef.current = e.nativeEvent.layout.y;
        }}
        onTouchMove={(e) => {
          console.log(
            'test:zuoyu:onTouchMove',
            e.nativeEvent.touches[0]?.pageY
          );
          const y = e.nativeEvent.pageY;
          const index = Math.floor((y - offsetRef.current) / 20); // assuming each child view is 20px tall
          _onIndexSelect(index);
        }}
        onMoveShouldSetResponder={() => {
          console.log('test:zuoyu:onMoveShouldSetResponder');
          return true;
        }}
        onTouchEnd={(e) => {
          const y = e.nativeEvent.pageY;
          const index = Math.floor((y - offsetRef.current) / 20); // assuming each child view is 20px tall
          console.log(
            'test:zuoyu:onTouchEnd',
            e.nativeEvent.touches[0]?.pageY,
            y,
            offsetRef.current,
            index
          );
          _onIndexSelect(index);
          delayExecTask();
        }}
      >
        {sections.map((section, index: number) => (
          <View
            key={index}
            style={{
              height: 20,
              width: 20,
              backgroundColor: currentIndex === index ? 'red' : 'blue',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
            onLayout={(e) => {
              console.log('test:zuoyu:onLayout:2:', e.nativeEvent.layout);
            }}
          >
            <Text>{section.title[0]}</Text>
          </View>
        ))}
      </View>
      {currentTitle ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          pointerEvents={'none'}
        >
          <View style={{ backgroundColor: 'red', height: 100, width: 100 }}>
            <Text>{currentTitle}</Text>
          </View>
        </View>
      ) : null}
    </>
  );
};

const SL = () => {
  const sectionListRef = React.useRef<SectionList>({} as any);
  const onIndexSelect = (index: number) => {
    console.log('test:zuoyu:', index, sectionListRef.current === undefined);
    sectionListRef.current?.scrollToLocation?.({
      sectionIndex: index,
      itemIndex: 1,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        ref={sectionListRef}
        sections={DATA}
        keyExtractor={(item, index) => {
          // console.log('test:zuoyu: key', item, index);
          return item + index;
        }}
        renderItem={(info) => {
          // console.log('test:zuoyu: item', info.index, info.item, info.section);
          return (
            <View style={[styles.item, { height: 80 }]}>
              <Text style={styles.title}>{info.item}</Text>
            </View>
          );
        }}
        renderSectionHeader={(info) => {
          // console.log('test:zuoyu: header', info);
          return (
            <Text style={[styles.header, { height: 40 }]}>
              {info.section.title}
            </Text>
          );
        }}
      />
      {/* <IndexList2 sections={DATA} onIndexSelect={onIndexSelect} /> */}
      <ListIndex
        indexTitles={DATA.map((v) => {
          return v.title;
        })}
        onIndexSelected={(index: number) => {
          onIndexSelect(index);
        }}
        indexContainerStyle={{ top: 100 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});

export default function TestSectionListRn() {
  return (
    <GlobalContainer appKey={''}>
      <SL />
    </GlobalContainer>
  );
}
