import * as React from 'react';
import { Animated, Pressable, View } from 'react-native';

import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { DefaultIconImage } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { formatTs } from '../../utils';
import { Avatar } from '../Avatar';
import { MessageListGiftItem } from './MessageList.item.gift';
import { MessageListTextItem } from './MessageList.item.text';
import { MessageListVoiceItem } from './MessageList.item.voice';
import type { MessageListItemProps } from './types';

// const AnimatedText = Animated.createAnimatedComponent(Text);

export function MessageListItem(props: MessageListItemProps) {
  const { emitSync } = useDispatchContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.barrage.onLight[2],
      dark: colors.barrage.onDark[2],
    },
    time: {
      light: colors.secondary[8],
      dark: colors.secondary[8],
    },
    name: {
      light: colors.primary[8],
      dark: colors.primary[8],
    },
  });
  const { roomOption } = useConfigContext();
  const {
    messageList: { isVisibleAvatar, isVisibleTag, isVisibleTime },
  } = roomOption;
  const headerWidth = React.useRef(0);
  const width = React.useRef(0);
  const { type, basic, action } = props;
  const sub = () => {
    switch (type) {
      case 'gift':
        return <MessageListGiftItem {...props} />;
      case 'text':
      case 'tip':
        return <MessageListTextItem {...props} />;
      case 'voice':
        return <MessageListVoiceItem {...props} />;
      default:
        throw new UIKitError({ code: ErrorCode.params });
    }
  };

  return (
    <View
      style={{
        flexDirection: 'column',
      }}
      onLayout={(e) => {
        width.current = e.nativeEvent.layout.width;
        if (type === 'text' || type === 'tip') {
          emitSync(
            `_$${MessageListTextItem.name}`,
            props.id,
            width.current,
            headerWidth.current
          );
        } else if (type === 'gift') {
          emitSync(
            `_$${MessageListGiftItem.name}`,
            props.id,
            width.current,
            headerWidth.current
          );
        }
      }}
    >
      <Pressable
        style={{ flexDirection: 'row', flex: 1 }}
        onLongPress={() => {
          action?.onLongPress?.(props);
        }}
        onPressIn={() => {
          action?.onStartPress?.(props);
        }}
      >
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              backgroundColor: getColor('backgroundColor'),
              flexShrink: 1,
              marginVertical: 2,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 10,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: type === 'text' ? 'center' : 'center',
              // backgroundColor: '#fff8dc',
              alignSelf: 'flex-start',
            }}
            onLayout={(e) => {
              headerWidth.current = e.nativeEvent.layout.width;
              if (type === 'text' || type === 'tip') {
                emitSync(
                  `_$${MessageListTextItem.name}`,
                  props.id,
                  width.current,
                  headerWidth.current
                );
              } else if (type === 'gift') {
                emitSync(
                  `_$${MessageListGiftItem.name}`,
                  props.id,
                  width.current,
                  headerWidth.current
                );
              }
            }}
          >
            {isVisibleTime === true ? (
              <View
                style={{
                  marginRight: 4,
                }}
              >
                <Text
                  textType={'medium'}
                  paletteType={'body'}
                  style={{
                    color: getColor('time'),
                  }}
                >
                  {formatTs(basic.timestamp)}
                </Text>
              </View>
            ) : null}

            {isVisibleTag === true ? (
              basic.tag ? (
                <View
                  style={{
                    marginRight: 4,
                  }}
                >
                  <DefaultIconImage
                    size={18}
                    borderRadius={0}
                    url={basic.tag}
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
                <Avatar url={basic.avatar} size={18} />
              </View>
            ) : null}

            <View
              style={{
                marginRight: 4,
              }}
            >
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('name') }}
              >
                {basic.nickname}
              </Text>
            </View>
          </View>

          {sub()}
        </Animated.View>
      </Pressable>
    </View>
  );
}

export const MessageListItemMemo = React.memo(MessageListItem);

export type MessageListItemComponent = typeof MessageListItem;
