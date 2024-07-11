import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { PressableHighlight } from '../../ui/Pressable';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { GroupParticipantListItemProps } from './types';

/**
 * Group Participant List Item Component.
 */
export function GroupParticipantListItem(props: GroupParticipantListItemProps) {
  const { data, onClicked, onLongPressed, onCheckClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    no_checked: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
    checked: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const getCheckedButton = (disable?: boolean, checked?: boolean) => {
    const name = (checked?: boolean) => {
      return checked !== false ? 'checked_rectangle' : 'unchecked_rectangle';
    };
    const color = (disable?: boolean) => {
      return disable !== true ? getColor('enable') : getColor('disable2');
    };
    if (checked === undefined) {
      return null;
    }

    return (
      <View style={{ marginRight: 12 }}>
        <IconButton
          iconName={name(checked)}
          style={{
            height: 28,
            width: 28,
            tintColor: color(disable),
          }}
          onPress={() => {
            if (disable !== true) {
              onCheckClicked?.(data);
            }
          }}
        />
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
      }}
    >
      <PressableHighlight
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
        onPress={() => {
          if (data.checked !== undefined) {
            if (data.disable !== true) {
              onCheckClicked?.(data);
            }
          } else {
            onClicked?.(data);
          }
        }}
        onLongPress={() => {
          onLongPressed?.(data);
        }}
      >
        {getCheckedButton(data.disable, data.checked)}

        <Avatar url={data.memberAvatar} size={40} />
        <View style={{ flexGrow: 1, paddingLeft: 12, maxWidth: '80%' }}>
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{ color: getColor('fg') }}
          >
            {data.memberName ?? data.memberId}
          </SingleLineText>
        </View>
      </PressableHighlight>
      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 68,
        }}
      />
    </View>
  );
}
export const GroupParticipantListItemMemo = React.memo(
  GroupParticipantListItem
);
