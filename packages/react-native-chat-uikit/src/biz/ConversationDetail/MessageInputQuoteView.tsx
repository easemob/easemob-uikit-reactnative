import * as React from 'react';
import { Dimensions, View } from 'react-native';
import {
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVideoMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButtonMemo } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { ThumbImage } from '../Avatar';

export type MessageInputQuoteViewProps = {
  showQuote: boolean;
  onDel: () => void;
  msg?: ChatMessage;
};
export const MessageInputQuoteView = (props: MessageInputQuoteViewProps) => {
  const { showQuote, onDel, msg: propsMsg } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    quote: {
      light: colors.neutral[9],
      dark: colors.neutral[3],
    },
    quote_del: {
      light: colors.neutral[3],
      dark: colors.neutral[7],
    },
    t1: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });

  if (showQuote !== true || propsMsg === undefined) {
    return null;
  }

  const getContent = (msg: ChatMessage) => {
    let maxWidth = Dimensions.get('window').width;
    if (msg.body.type === ChatMessageType.TXT) {
      maxWidth = maxWidth * 0.9;
      const body = msg.body as ChatTextMessageBody;
      const content = body.content;
      return (
        <SingleLineText
          textType={'small'}
          paletteType={'label'}
          style={{
            color: getColor('t2'),
            maxWidth: maxWidth,
          }}
        >
          {content}
        </SingleLineText>
      );
    } else if (msg.body.type === ChatMessageType.FILE) {
      maxWidth = maxWidth * 0.6;
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'doc'}
            style={{ width: 16, height: 16, tintColor: getColor('t2') }}
          />
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr('attachment ')}
          </SingleLineText>
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr('file name')}
          </SingleLineText>
        </View>
      );
    } else if (msg.body.type === ChatMessageType.IMAGE) {
      maxWidth = maxWidth * 0.6;
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'img'}
            style={{ width: 16, height: 16, tintColor: getColor('t2') }}
          />
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr('picture')}
          </SingleLineText>
        </View>
      );
    } else if (msg.body.type === ChatMessageType.VIDEO) {
      maxWidth = maxWidth * 0.6;
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'triangle_in_rectangle'}
            style={{ width: 16, height: 16, tintColor: getColor('t2') }}
          />
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr('video')}
          </SingleLineText>
        </View>
      );
    } else if (msg.body.type === ChatMessageType.VOICE) {
      maxWidth = maxWidth * 0.6;
      const body = msg.body as ChatVoiceMessageBody;
      const second = Math.floor((body.duration ?? 0) / 1000);
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'3th_frame_lft_lgt_sdy'}
            style={{ width: 16, height: 16, tintColor: getColor('t2') }}
          />
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr('voice')}
          </SingleLineText>
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr(` ${second}"`)}
          </SingleLineText>
        </View>
      );
    }
    return null;
  };

  const getContentThumb = (msg: ChatMessage) => {
    if (msg.body.type === ChatMessageType.IMAGE) {
      const body = msg.body as ChatImageMessageBody;
      return body.thumbnailLocalPath;
    } else if (msg.body.type === ChatMessageType.VIDEO) {
      const body = msg.body as ChatVideoMessageBody;
      return body.thumbnailLocalPath;
    }
    return null;
  };

  return (
    <View
      style={{
        height: 52,
        backgroundColor: getColor('quote'),
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
      }}
    >
      <View style={{ flexGrow: 1 }}>
        <SingleLineText
          textType={'small'}
          paletteType={'label'}
          style={{
            color: getColor('t1'),
            maxWidth: '70%',
          }}
        >
          {tr('you are quote a message')}
        </SingleLineText>
        {getContent(propsMsg)}
      </View>

      {getContentThumb(propsMsg) !== null ? (
        <View
          style={{ padding: 6, justifyContent: 'center', alignItems: 'center' }}
        >
          <ThumbImage size={24} url={getContentThumb(propsMsg)!} />
        </View>
      ) : null}
      <IconButtonMemo
        iconName={'xmark_in_circle_fill'}
        style={{
          width: 20,
          height: 20,
          tintColor: getColor('quote_del'),
        }}
        onPress={onDel}
      />
    </View>
  );
};
