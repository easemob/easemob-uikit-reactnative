import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { ChatMessage } from 'react-native-chat-sdk';

import { gMessageAttributeMentions, useChatContext } from '../../chat';
import { getMessageSnapshot } from '../../chat/utils';
import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { formatTsForConvList } from '../../utils';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import type { ConversationListItemProps } from './types';

/**
 * Conversation list item component.
 */
export function ConversationListItem(props: ConversationListItemProps) {
  const { onClicked, onLongPressed, data } = props;
  const { lastMessage } = data;
  const { formatTime } = useConfigContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    pin_bg: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
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
      light: colors.neutral[7],
      dark: colors.neutral[5],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
    mention: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const im = useChatContext();
  const { tr } = useI18nContext();

  const getMention = React.useCallback(
    (msg?: ChatMessage) => {
      if (msg?.attributes?.[gMessageAttributeMentions]) {
        const mentions = msg.attributes?.[gMessageAttributeMentions];
        if (typeof mentions === 'string') {
          if (mentions === 'ALL') {
            return tr('@all');
          }
        } else if (Array.isArray(mentions)) {
          const ret = (mentions as string[]).find((item) => {
            if (item === im.userId) {
              return true;
            }
            return false;
          });
          return ret ? tr('@me') : null;
        }
      }
      return null;
    },
    [im.userId, tr]
  );

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

  const count =
    data.doNotDisturb === true
      ? data.unreadMessageCount === 0
        ? 0
        : undefined
      : data.unreadMessageCount;

  return (
    <Pressable
      style={{
        backgroundColor:
          data.isPinned === true ? getColor('pin_bg') : getColor('bg'),
      }}
      onPress={() => {
        onClicked?.(data);
      }}
      onLongPress={() => {
        onLongPressed?.(data);
      }}
    >
      <View
        style={{
          width: '100%',
          height: 75.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Avatar url={data.convAvatar} size={50} />
        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: '65%',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SingleLineText
              paletteType={'title'}
              textType={'medium'}
              style={{ color: getColor('t1') }}
            >
              {data.convName ?? data.convId}
            </SingleLineText>
            {data.doNotDisturb === true ? (
              <Icon
                name={'bell_slash'}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: getColor('t3'),
                }}
              />
            ) : null}
          </View>
          <SingleLineText
            paletteType={'body'}
            textType={'medium'}
            style={{ color: getColor('mention') }}
          >
            {getMention(lastMessage)}
            <SingleLineText
              paletteType={'body'}
              textType={'medium'}
              style={{ color: getColor('t2') }}
            >
              {tr(getMessageSnapshot(data.lastMessage))}
            </SingleLineText>
          </SingleLineText>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'column' }}>
          <SingleLineText
            paletteType={'body'}
            textType={'small'}
            style={{ color: getColor('t2') }}
          >
            {getMessageFormatTime(data.lastMessage, data.pinnedTime)}
          </SingleLineText>
          <View style={{ height: count === undefined ? 10 : 5 }} />
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <View style={{ flexGrow: 1 }} />
            <View
              style={{
                height: 20,
                // justifyContent: 'center',
                marginRight: count === undefined ? 4 : 0,
              }}
            >
              <Badges count={count} />
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </Pressable>
  );
}
export const ConversationListItemMemo = React.memo(ConversationListItem);
