import * as React from 'react';
import { Pressable, View } from 'react-native';

import { getMessageFormatTime, getMessageSnapshot } from '../../chat/utils';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
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
      dark: colors.neutral[6],
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
        <View style={{ flexDirection: 'column', flexGrow: 1, paddingLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text paletteType={'title'} textType={'medium'}>
              {data.convName ?? data.convId}
            </Text>
            {data.doNotDisturb === true ? (
              <Icon name={'bell_slash'} style={{ height: 20, width: 20 }} />
            ) : null}
          </View>
          <Text paletteType={'body'} textType={'medium'}>
            {getMessageSnapshot(data.lastMessage)}
          </Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text paletteType={'body'} textType={'small'}>
            {getMessageFormatTime(data.lastMessage, data.pinnedTime)}
          </Text>
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
                    ? undefined
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
