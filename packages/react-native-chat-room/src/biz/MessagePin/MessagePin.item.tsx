import * as React from 'react';
import { Pressable, View } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { DefaultIconImage } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { IndentedText } from '../Common';
import {
  MESSAGE_PIN_EXTENSION_BUTTON,
  MESSAGE_PIN_PADDING_HORIZONTAL,
  MESSAGE_PIN_PADDING_VERTICAL,
} from './MessagePin.const';
import { useMessagePinItem } from './MessagePin.hook';
import { MessagePinItemProps } from './types';

export function MessagePinItem(props: MessagePinItemProps) {
  const {
    onLongPress,
    onClicked,
    onRealContentWidth,
    onIndentedText,
    maxWidth,
    containerStyle,
    tag,
    avatar,
    nickname,
    emitSync,
    fontFamily,
    fonts,
    getColor,
    isVisibleAvatar,
    isVisibleName,
    isVisibleTag,
    headerWidth,
    width,
    numberOfLines,
    maxHeight,
    showExtensionButton,
    msg,
    rawContent,
    isTruncated,
    menuRef,
  } = useMessagePinItem(props);

  if (!msg) {
    return null;
  }

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          maxHeight: maxHeight,
          alignSelf: 'flex-start',

          borderRadius: 8,
          backgroundColor: getColor('backgroundColor'),
          overflow: 'hidden',
        },
        containerStyle,
      ]}
      onLongPress={onLongPress}
      onPress={onClicked}
    >
      <IndentedText
        containerOnLayout={(e) => {
          width.current = e.nativeEvent.layout.width;
          emitSync(
            `_$IndentedText.name`,
            msg?.msgId ?? '',
            width.current,
            headerWidth.current
          );
        }}
        containerStyle={{
          flexDirection: 'row',
          maxWidth: maxWidth,
          paddingHorizontal: MESSAGE_PIN_PADDING_HORIZONTAL,
          alignSelf: 'flex-start',
        }}
        outContainerStyle={{
          flexDirection: 'row',
          maxHeight: maxHeight,
          maxWidth: maxWidth,
          paddingVertical: MESSAGE_PIN_PADDING_VERTICAL,
          alignSelf: 'flex-start',
        }}
        headerOnLayout={(e) => {
          headerWidth.current =
            e.nativeEvent.layout.width > MESSAGE_PIN_PADDING_HORIZONTAL
              ? e.nativeEvent.layout.width - MESSAGE_PIN_PADDING_HORIZONTAL
              : e.nativeEvent.layout.width;
          emitSync(
            `_$IndentedText.name`,
            msg?.msgId ?? '',
            width.current,
            headerWidth.current
          );
        }}
        headerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          position: 'absolute',
          paddingLeft: MESSAGE_PIN_PADDING_HORIZONTAL,
        }}
        headerChildren={
          <>
            {isVisibleTag === true ? (
              tag ? (
                <View
                  style={{
                    marginRight: 4,
                  }}
                >
                  <DefaultIconImage
                    size={18}
                    borderRadius={0}
                    localIcon={(ICON_ASSETS as any)[tag]('3x')}
                  />
                </View>
              ) : null
            ) : null}

            {isVisibleAvatar === true ? (
              <View
                style={{
                  marginRight: 4,
                }}
              >
                <Avatar url={avatar} size={18} />
              </View>
            ) : null}

            {isVisibleName === true ? (
              <View
                style={{
                  marginRight: 4,
                }}
              >
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  style={{
                    color: getColor('time'),
                  }}
                >
                  {nickname}
                </Text>
              </View>
            ) : null}
          </>
        }
        textProps={{ style: { ...fonts.body.medium, fontFamily } }}
        onRealContentWidth={onRealContentWidth}
        id={msg?.msgId ?? ''}
        content={rawContent}
        numberOfLines={numberOfLines}
        onTextLayout={onIndentedText}
        textStyle={{ maxWidth: maxWidth }}
        enableScroll={showExtensionButton === true && isTruncated === false}
        onLongPress={onLongPress}
        onPress={onClicked}
        scrollStyle={{ alignSelf: 'flex-start' }}
      />

      {showExtensionButton === true ? (
        isTruncated === true ? (
          <ExtensionButton name={'chevron_down_small'} />
        ) : (
          <ExtensionButton name={'chevron_up_small'} />
        )
      ) : null}

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
        initItems={[]}
      />
    </Pressable>
  );
}

const ExtensionButton = React.memo((props: { name: string }) => {
  const { name } = props;
  const { getColor } = useMessagePinItem({} as any);
  return (
    <View
      style={{
        width: MESSAGE_PIN_EXTENSION_BUTTON,
        minHeight: MESSAGE_PIN_EXTENSION_BUTTON,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <DefaultIconImage
        size={18}
        borderRadius={0}
        localIcon={(ICON_ASSETS as any)[name]('3x')}
        style={{ tintColor: getColor('content') }}
      />
    </View>
  );
});
