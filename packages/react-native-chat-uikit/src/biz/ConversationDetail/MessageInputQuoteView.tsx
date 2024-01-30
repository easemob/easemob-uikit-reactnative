import * as React from 'react';
import { Dimensions, View } from 'react-native';
import {
  ChatCustomMessageBody,
  ChatFileMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import { gCustomMessageCardEventType } from '../../chat';
import { userInfoFromMessage } from '../../chat/utils';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButtonMemo } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { MessageDefaultImage } from './MessageListItem';
import { getImageThumbUrl, getVideoThumbUrl } from './MessageListItem.hooks';

/**
 * Message Input Quote View Component properties.
 */
export type MessageInputQuoteViewProps = {
  showQuote: boolean;
  onDel: () => void;
  msg?: ChatMessage;
};
/**
 * Message Input Quote View Component.
 */
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
  const bodyType = React.useRef<ChatMessageType | undefined>(
    propsMsg?.body.type
  ).current;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();

  const getContent = (msg: ChatMessage) => {
    let maxWidth = Dimensions.get('window').width;
    if (msg.body.type === ChatMessageType.TXT) {
      maxWidth = maxWidth * 0.9;
      const body = msg.body as ChatTextMessageBody;
      const content = body.content;
      return (
        <SingleLineText
          textType={'small'}
          paletteType={'body'}
          style={{
            color: getColor('t2'),
            maxWidth: maxWidth,
          }}
        >
          {content}
        </SingleLineText>
      );
    } else if (msg.body.type === ChatMessageType.FILE) {
      maxWidth = maxWidth * 0.8;
      const body = msg.body as ChatFileMessageBody;
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'doc'}
            style={{
              width: 16,
              height: 16,
              tintColor: getColor('t2'),
              marginRight: 2,
            }}
          />
          <SingleLineText
            textType={'small'}
            paletteType={'label'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr('_uikit_chat_input_quote_file')}
            <SingleLineText
              textType={'small'}
              paletteType={'body'}
              style={{
                color: getColor('t2'),
              }}
            >
              {body.displayName.substring(0)}
            </SingleLineText>
          </SingleLineText>
        </View>
      );
    } else if (msg.body.type === ChatMessageType.IMAGE) {
      maxWidth = maxWidth * 0.6;
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'img'}
            style={{
              width: 16,
              height: 16,
              tintColor: getColor('t2'),
              marginRight: 2,
            }}
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
            style={{
              width: 16,
              height: 16,
              tintColor: getColor('t2'),
              marginRight: 2,
            }}
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
      const second = Math.floor(body.duration ?? 0);
      return (
        <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
          <Icon
            name={'3th_frame_lft_lgt_sdy'}
            style={{
              width: 16,
              height: 16,
              tintColor: getColor('t2'),
              marginRight: 2,
            }}
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
            paletteType={'body'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr(` ${second}"`)}
          </SingleLineText>
        </View>
      );
    } else if (msg.body.type === ChatMessageType.CUSTOM) {
      const body = msg.body as ChatCustomMessageBody;
      const event = body.event;
      if (event === gCustomMessageCardEventType) {
        const cardParams = body.params as {
          userId: string;
          nickname: string;
          avatar: string;
        };
        maxWidth = maxWidth * 0.8;
        return (
          <View style={{ flexDirection: 'row', maxWidth: maxWidth }}>
            <Icon
              name={'person_single_fill'}
              style={{
                width: 16,
                height: 16,
                tintColor: getColor('t2'),
                marginRight: 2,
              }}
            />
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor('t2'),
              }}
            >
              {tr('card')}
              <SingleLineText
                textType={'small'}
                paletteType={'body'}
                style={{
                  color: getColor('t2'),
                }}
              >
                {cardParams.nickname ?? cardParams.userId}
              </SingleLineText>
            </SingleLineText>
          </View>
        );
      }
    }
    return null;
  };

  const getContentThumb = React.useCallback(async (msg: ChatMessage) => {
    if (msg.body.type === ChatMessageType.IMAGE) {
      const ret = await getImageThumbUrl(msg);
      setThumbUrl(ret);
    } else if (msg.body.type === ChatMessageType.VIDEO) {
      const ret = await getVideoThumbUrl(msg);
      setThumbUrl(ret);
    }
  }, []);

  const getUserName = (msg: ChatMessage) => {
    const user = userInfoFromMessage(msg);
    return user?.userName ?? user?.userId ?? msg.from;
  };

  React.useEffect(() => {
    if (propsMsg) {
      getContentThumb(propsMsg);
    }
  }, [getContentThumb, propsMsg]);

  if (showQuote !== true || propsMsg === undefined) {
    return null;
  }

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
            fontWeight: '500',
            maxWidth: '60%',
          }}
        >
          {tr('you')}
          <SingleLineText
            textType={'small'}
            paletteType={'body'}
            style={{
              color: getColor('t1'),
              maxWidth: '70%',
            }}
          >
            {tr('_uikit_chat_input_quote_title_1')}
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor('t1'),
                fontWeight: '500',
                maxWidth: '60%',
              }}
            >
              {getUserName(propsMsg)}
            </SingleLineText>
          </SingleLineText>
        </SingleLineText>

        <View style={{ height: 4 }} />

        {getContent(propsMsg)}
      </View>

      {thumbUrl ? (
        <>
          <MessageDefaultImage
            url={thumbUrl}
            width={36}
            height={36}
            thumbWidth={24}
            thumbHeight={24}
            iconName={
              bodyType === ChatMessageType.IMAGE
                ? 'img'
                : 'triangle_in_rectangle'
            }
          />
          <View style={{ width: 12 }} />
        </>
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
