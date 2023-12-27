import * as React from 'react';
import { Pressable, View } from 'react-native';

import { getMessageFormatTime, getMessageSnapshot } from '../../chat/utils';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import type { ConversationListItemProps } from './types';

export function ConversationListItem(props: ConversationListItemProps) {
  const { onClicked, onLongPressed, data } = props;
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
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });
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
              <Icon name={'bell_slash'} style={{ height: 20, width: 20 }} />
            ) : null}
          </View>
          <SingleLineText
            paletteType={'body'}
            textType={'medium'}
            style={{ color: getColor('t2') }}
          >
            {getMessageSnapshot(data.lastMessage)}
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
                justifyContent: 'center',
              }}
            >
              <Badges
                count={
                  data.doNotDisturb === true
                    ? data.unreadMessageCount === 0
                      ? 0
                      : undefined
                    : data.unreadMessageCount
                }
              />
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
