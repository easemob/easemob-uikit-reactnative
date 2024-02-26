import * as React from 'react';
import {
  Dimensions,
  // Image as RNImage,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  ChatCustomMessageBody,
  ChatFileMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import {
  gCustomMessageCardEventType,
  // gMessageAttributeTranslate,
} from '../../chat';
import { getMessageSnapshot, userInfoFromMessage } from '../../chat/utils';
import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { formatTsForConvList } from '../../utils';
import { Avatar } from '../Avatar';
import { MessageDefaultImage } from './MessageListItem';
import {
  getImageShowSize,
  getImageThumbUrl,
  getVideoThumbUrl,
} from './MessageListItem.hooks';
import type { MessageHistoryModel } from './types';

export type MessageHistoryListItemProps = {
  model: MessageHistoryModel;
};

export function MessageHistoryListItem(props: MessageHistoryListItemProps) {
  const { model } = props;
  const { msg } = model;
  const { userId, userName, avatarURL } = userInfoFromMessage(msg) ?? {};
  const { formatTime } = useConfigContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });
  const { tr } = useI18nContext();
  const msgType = msg.body.type;
  const maxWidth = Dimensions.get('window').width * 0.6;

  const getMessageFormatTime = React.useCallback(
    (msg?: ChatMessage, timestamp?: number): string => {
      const cb = formatTime?.conversationListCallback;
      if (msg === undefined && timestamp) {
        return cb ? cb(timestamp) : formatTsForConvList(timestamp);
      } else if (msg) {
        return cb ? cb(msg.localTime) : formatTsForConvList(msg.localTime);
      } else {
        return '';
      }
    },
    [formatTime?.conversationListCallback]
  );

  const getMessageSnapshotParams = React.useCallback((msg: ChatMessage) => {
    if (msg === undefined) {
      return '';
    }
    switch (msg.body.type) {
      case ChatMessageType.VOICE: {
        const body = msg.body as ChatVoiceMessageBody;
        return body.duration;
      }

      case ChatMessageType.FILE: {
        const body = msg.body as ChatFileMessageBody;
        return body.displayName;
      }

      case ChatMessageType.CUSTOM: {
        const body = msg.body as ChatCustomMessageBody;
        if (body.event === gCustomMessageCardEventType) {
          return body.params?.nickname ?? body.params?.userId;
        }
        return '';
      }

      default:
        return '';
    }
  }, []);

  return (
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {}}
      onLongPress={() => {}}
    >
      <View
        style={{
          width: '100%',
          // height: 75.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <View style={{ alignItems: 'flex-end' }}>
          <Avatar url={avatarURL} size={32} />
          <View style={{ flexGrow: 1 }} />
        </View>

        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingLeft: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              paletteType={'title'}
              textType={'medium'}
              style={{ color: getColor('t1') }}
            >
              {userName ?? userId}
            </SingleLineText>
            <View style={{ flexGrow: 1 }} />
            <SingleLineText
              paletteType={'body'}
              textType={'small'}
              style={{ color: getColor('t2') }}
            >
              {getMessageFormatTime(msg)}
            </SingleLineText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {msgType === ChatMessageType.IMAGE ? (
              <MessageHistoryImage msg={msg} maxWidth={maxWidth} />
            ) : msgType === ChatMessageType.VIDEO ? (
              <MessageHistoryVideo msg={msg} maxWidth={maxWidth} />
            ) : (
              <Text
                paletteType={'body'}
                textType={'medium'}
                style={{ color: getColor('t2') }}
              >
                {tr(getMessageSnapshot(msg), getMessageSnapshotParams(msg))}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 54,
        }}
      />
    </Pressable>
  );
}

export type MessageHistoryImageProps = {
  msg: ChatMessage;
  maxWidth?: number;
};
export function MessageHistoryImage(props: MessageHistoryImageProps) {
  const { msg, maxWidth } = props;
  // const url1 =
  //   '/storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url3 =
  //   'file:///storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718%23demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url5 =
  //   'file:///storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url2 =
  //   '/var/mobile/Containers/Data/Application/CC0AD493-D627-463B-B351-44500E6FB1E2/tmp/AD1256B8-B32C-4CFE-B5F5-ECA21662B4E8.jpg';

  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>(undefined);
  const { width, height } = getImageShowSize(msg, maxWidth);
  React.useEffect(() => {
    msg.status;
    getImageThumbUrl(msg)
      .then((url) => {
        setThumbUrl(url);
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <MessageDefaultImage
      url={thumbUrl}
      width={width}
      height={height}
      thumbWidth={64}
      thumbHeight={64}
      iconName={'img'}
    />
  );
}

export type MessageHistoryVideoProps = {
  msg: ChatMessage;
  maxWidth?: number;
};

export function MessageHistoryVideo(props: MessageHistoryVideoProps) {
  const { msg, maxWidth } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();
  const { width, height } = getImageShowSize(msg, maxWidth);
  const [showTriangle, setShowTriangle] = React.useState(true);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    video: {
      light: colors.neutral[98],
      dark: colors.neutral[95],
    },
  });
  React.useEffect(() => {
    msg.status;
    getVideoThumbUrl(msg)
      .then((url) => {
        if (url) {
          setThumbUrl(url);
        }
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <View>
      <MessageDefaultImage
        url={thumbUrl}
        width={width}
        height={height}
        thumbWidth={64}
        thumbHeight={64}
        iconName={'triangle_in_rectangle'}
        onError={() => {
          setShowTriangle(false);
        }}
      />
      {showTriangle === true ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Icon
            name={'triangle_in_circle'}
            style={{ width: 64, height: 64, tintColor: getColor('video') }}
            resolution={'3x'}
          />
        </View>
      ) : null}
    </View>
  );
}
