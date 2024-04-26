import * as React from 'react';
import {
  // Dimensions,
  // Image as RNImage,
  Pressable,
  View,
} from 'react-native';

import { userInfoFromMessage } from '../../chat/utils';
import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { ChatMessage, ChatMessageType } from '../../rename.chat';
import { usePaletteContext } from '../../theme';
import { HighText, SingleLineText } from '../../ui/Text';
import { formatTsForConvList } from '../../utils';
import { Avatar } from '../Avatar';
import { useMessageSnapshot } from '../hooks';
import type { MessageSearchItemProps } from './types';

export function MessageSearchItem(props: MessageSearchItemProps) {
  const { model, onClicked } = props;
  const { msg, keyword } = model;
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
    t3: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });
  const { getMessageSnapshot } = useMessageSnapshot();
  const msgType = msg.body.type;

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

  return (
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        onClicked?.(model);
      }}
    >
      <View
        style={{
          width: '100%',
          height: 59.5,
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
            {msgType === ChatMessageType.TXT ? (
              <HighText
                paletteType={'body'}
                textType={'medium'}
                containerStyle={{
                  flexDirection: 'row',
                  flexGrow: 1,
                  maxWidth: '80%',
                }}
                highColors={[colors.primary[5], colors.primary[6]]}
                textColors={[colors.neutral[5], colors.neutral[6]]}
                keyword={keyword}
                content={getMessageSnapshot(msg)}
              />
            ) : null}
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

export const MessageSearchItemMemo = React.memo(MessageSearchItem);
