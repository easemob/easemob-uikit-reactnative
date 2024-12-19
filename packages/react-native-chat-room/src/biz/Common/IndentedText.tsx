import * as React from 'react';
import { Animated, ScrollView, ScrollViewProps, View } from 'react-native';
import { Pressable } from 'react-native';

import { PresetCalcTextWidth } from '../../ui/Text';
import { useIndentedTextBody } from './hooks';
import { IndentedTextHeader } from './IndentedTextHeader';
import { IndentedTextProps } from './types';

export function useIndentedText(props: IndentedTextProps) {
  return props;
}
export function IndentedText(props: IndentedTextProps) {
  const {
    enableScroll,
    scrollStyle,
    onPress,
    onLongPress,
    containerStyle,
    outContainerStyle,
    containerOnLayout,
    headerChildren,
    headerOnLayout,
    headerStyle,
    textProps,
    onRealContentWidth,
  } = useIndentedText(props);
  const {
    numberOfLines,
    onTextLayout,
    textStyle,
    space,
    getColor,
    unitSpaceWidth,
    contentWidth,
    content,
  } = useIndentedTextBody(props);

  return (
    <View style={outContainerStyle}>
      <PresetCalcTextWidth
        content={space + content.trim()}
        textProps={textProps}
        onWidth={onRealContentWidth}
      />
      <PresetCalcTextWidth
        content={' '}
        textProps={textProps}
        onWidth={(width: number) => {
          unitSpaceWidth.current = width;
        }}
      />
      <PresetCalcTextWidth
        content={content.trim()}
        textProps={textProps}
        onWidth={(width: number) => {
          contentWidth.current = width;
        }}
      />
      <ScrollViewWrapper
        numberOfLines={numberOfLines}
        style={scrollStyle}
        scrollEnabled={enableScroll}
      >
        <Pressable onPress={onPress} onLongPress={onLongPress}>
          <View style={containerStyle} onLayout={containerOnLayout}>
            <IndentedTextHeader
              headerOnLayout={headerOnLayout}
              headerStyle={headerStyle}
              headerChildren={headerChildren}
            />

            <Animated.Text
              // textType={'medium'}
              // paletteType={'body'}
              style={[
                {
                  transform: [{ translateX: 0 }],
                },
                {
                  color: getColor('text'),
                  alignSelf: 'flex-start',
                },
                textProps.style,
                textStyle,
              ]}
              numberOfLines={numberOfLines}
              onTextLayout={onTextLayout}
            >
              {space + content.trim()}
            </Animated.Text>
          </View>
        </Pressable>
      </ScrollViewWrapper>
    </View>
  );
}

const ScrollViewWrapper = React.memo(
  (props: ScrollViewProps & { numberOfLines?: number | undefined }) => {
    const { numberOfLines, children, ...others } = props;
    if (typeof numberOfLines === 'number') {
      return <>{children}</>;
    } else {
      return <ScrollView {...others}>{children}</ScrollView>;
    }
  }
);
