import * as React from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export function LongPressTextSelection({
  text,
  onPress,
}: {
  text: string;
  onPress: (selectedText: string) => void;
}) {
  const [, setSelectedText] = React.useState('');
  const [selectionRange, setSelectionRange] = React.useState({
    start: 0,
    end: 0,
  });
  const textRef = React.useRef(null);

  const handleLongPress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const textLayout = textRef.current;

    if (textLayout) {
      textLayout.measure((x, y, width, height, pageX, pageY) => {
        console.log('test:measure:', x, y, width, height, pageX, pageY);
        const relativeX = locationX - pageX;
        const charWidth = width / text.length;
        let start = Math.floor(relativeX / charWidth);
        let end = start + 1; // Assuming single character selection for simplicity
        start = 0;
        end = text.length;

        setSelectionRange({ start, end });
        setSelectedText(text.slice(start, end));

        setTimeout(() => {
          setSelectedText('');
          setSelectionRange({ start: 0, end: 0 });
          onPress(text.slice(start, end));
        }, 2000);

        console.log('test:selection:', text.slice(start, end));
      });
    }
  };

  const renderTextWithHighlight = () => {
    const { start, end } = selectionRange;
    return (
      <>
        <Text>{text.slice(0, start)}</Text>
        <Text style={styles.highlight}>{text.slice(start, end)}</Text>
        <Text>{text.slice(end)}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress}>
      <View ref={textRef} style={styles.textContainer}>
        {renderTextWithHighlight()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlight: {
    backgroundColor: 'yellow',
  },
});

function Split(props: { style: ViewStyle | undefined; dotSize?: number }) {
  const { style, dotSize = 16 } = props;
  const { backgroundColor } = style;
  return (
    <View style={style}>
      <View
        style={{
          position: 'absolute',
          height: dotSize,
          width: dotSize,
          borderRadius: dotSize,
          left: -dotSize / 2,
          top: -dotSize / 2,
          backgroundColor: backgroundColor,
        }}
      />
    </View>
  );
}

export function LongPressTextSelection2(props: { text: string }) {
  const { text } = props;
  const [bg, setBg] = React.useState<string>(undefined);
  const [bg2, setBg2] = React.useState<string>(undefined);
  const [splitHeight, setSplitHeight] = React.useState<number>(undefined);

  const _onLongPress = React.useCallback((event: GestureResponderEvent) => {
    console.log(
      'test:LongPressTextSelection2:_onLongPress',
      event.nativeEvent.locationX
    );
    setBg('yellow');
    setBg2('blue');
    setTimeout(() => {
      setBg(undefined);
      setBg2(undefined);
    }, 2000);
  }, []);
  const _onTextLayout = React.useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      console.log(
        'test:LongPressTextSelection2:_onTextLayout',
        event.nativeEvent
      );
      setSplitHeight(event.nativeEvent.lines[0].height);
    },
    []
  );
  return (
    <View
      style={{
        flex: 1,
        marginLeft: 40,
        marginRight: 40,
        // flexShrink: 1,
        // flexGrow: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
      }}
    >
      <Text
        onTextLayout={_onTextLayout}
        style={{
          backgroundColor: bg,
          // flex: 1,
          // textDecorationColor: 'orange',
          alignSelf: 'flex-start',
        }}
        onLongPress={_onLongPress}
        // selectionColor={'green'}
        // selectable={true}
        suppressHighlighting={true}
      >
        {text}
      </Text>
      <Split
        style={{
          position: 'absolute',
          backgroundColor: bg2,
          width: 2,
          height: splitHeight,
          top: 0,
          left: -2,
        }}
        dotSize={8}
      />
      <Split
        style={{
          position: 'absolute',
          backgroundColor: bg2,
          width: 2,
          height: splitHeight,
          top: 0,
          right: 0,
        }}
        dotSize={8}
      />
    </View>
  );
}

export default function TestTextSelection() {
  return (
    <View style={{ flex: 1, top: 100 }}>
      <LongPressTextSelection
        text={'hello, world'}
        onPress={(t) => {
          console.log('test:selection:', t);
        }}
      />
      {/* <Text selectable={false} selectionColor="red">
        {'hahasdfsdfsdlfk'}
      </Text> */}

      <LongPressTextSelection2 text={'hello, super start.'} />
    </View>
  );
}
