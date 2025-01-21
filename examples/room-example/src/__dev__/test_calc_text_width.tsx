import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

export function CalcTextWidth() {
  const content =
    'For several generations, stories from Africa have traditionally been passed down by word of mouth. Often, after a hard day’s work, the adults would gather the children together by moonlight, around a village fire and tell stories. This was traditionally called Tales by Moonlight. Usually, the stories are meant to prepare young people for life, and so each story taught a lesson or moral. ';
  const textRef = React.useRef<Text>({} as any);
  return (
    <View style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <View>
        <Text>{content}</Text>
      </View>
      <View
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          width: 1,
          opacity: 0,
        }}
      >
        <ScrollView horizontal={true}>
          <Text
            ref={textRef}
            style={{ height: 20 }}
            onTextLayout={(e) => {
              console.log('test:onTextLayout:', e.nativeEvent);
            }}
            onLayout={(e) => {
              console.log('test:onLayout:', e.nativeEvent);
              if (textRef.current) {
                textRef.current.measure((x, y, width, height, px, py) => {
                  console.log(
                    'test:onLayout:measure:',
                    x,
                    y,
                    width,
                    height,
                    px,
                    py
                  );
                });
              }
            }}
          >
            {content}
          </Text>
        </ScrollView>
      </View>

      <View style={{ flex: 1 }} />
    </View>
  );
}

export default function test_calc_text_width() {
  return <CalcTextWidth />;
}
