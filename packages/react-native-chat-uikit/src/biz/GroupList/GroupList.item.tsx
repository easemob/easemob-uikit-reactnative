import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Text2Button } from '../../ui/Button';
import { PressableHighlight } from '../../ui/Pressable';
import { SingleLineText } from '../../ui/Text';
import { GroupAvatar } from '../Avatar';
import type { GroupListItemProps } from './types';

/**
 * Group List Item Component.
 */
export function GroupListItem(props: GroupListItemProps) {
  const { data, onClicked, onLongPressed, groupType = 'common' } = props;
  const { forwarded } = data;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    btn_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
  });
  return (
    <PressableHighlight
      style={{
        backgroundColor: getColor('bg'),
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
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <GroupAvatar url={data.groupAvatar} size={40} />
        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: groupType === 'common' ? '80%' : '60%',
          }}
        >
          <SingleLineText paletteType={'title'} textType={'medium'}>
            {data.groupName === undefined || data.groupName.length === 0
              ? data.groupId
              : data.groupName}
          </SingleLineText>
        </View>

        {groupType === 'forward-message' ? (
          <>
            <View style={{ flexGrow: 1 }} />
            <Text2Button
              sizesType={'small'}
              radiusType={'extraSmall'}
              text={tr(forwarded === true ? 'forwarded' : 'forward')}
              style={{
                backgroundColor: getColor('btn_bg'),
              }}
              textStyle={{
                color: getColor(forwarded === true ? 'disable2' : 'fg'),
              }}
              onPress={() => {
                onClicked?.(data);
              }}
            />
          </>
        ) : null}
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </PressableHighlight>
  );
}
export const GroupListItemMemo = React.memo(GroupListItem);
