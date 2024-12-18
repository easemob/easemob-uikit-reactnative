import * as React from 'react';
import { Animated, Text, View } from 'react-native';

import { PresetCalcTextWidth } from '../rename.room';

export function CalcTextWidth() {
  console.log('test:CalcTextWidth:');
  const [width, setWidth] = React.useState(200);
  const content =
    'For several generations, stories from Africa have traditionally been passed down by word of mouth. Often, after a hard day’s work, the adults would gather the children together by moonlight, around a village fire and tell stories. This was traditionally called Tales by Moonlight. Usually, the stories are meant to prepare young people for life, and so each story taught a lesson or moral. ';
  return (
    <View style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <PresetCalcTextWidth
        content={content}
        textProps={{ style: { lineHeight: 30, fontSize: 40 } }}
        onWidth={(width: number) => {
          console.log('test:width:', width);
          setWidth(width);
        }}
      />
      <View style={{ width: width }}>
        <Text style={{ lineHeight: 30, fontSize: 40 }}>{content}</Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

export function CalcTextWidth2() {
  console.log('test:CalcTextWidth2:');
  // const [width, setWidth] = React.useState(200);
  const width = React.useRef(new Animated.Value(0));
  const content = ' ';
  return (
    <View style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <PresetCalcTextWidth
        content={content}
        textProps={{ style: { lineHeight: 30, fontSize: 40 } }}
        onWidth={(w: number) => {
          console.log('test:width:', w);
          width.current.setValue(w);
        }}
      />
      <Animated.View style={{ width: width.current }}>
        <Text style={{ lineHeight: 30, fontSize: 40, backgroundColor: 'red' }}>
          {content}
        </Text>
      </Animated.View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

export default function test_calc_text_width() {
  return <CalcTextWidth2 />;
}
