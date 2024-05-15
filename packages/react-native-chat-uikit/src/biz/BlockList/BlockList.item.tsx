import * as React from 'react';
import { SectionListData, View } from 'react-native';

import type { BlockModel } from '../../chat';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { PressableHighlight } from '../../ui/Pressable';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { IndexModel } from '../ListIndex';
import type { BlockListItemProps } from './types';

/**
 * Block list item component.
 */
export function BlockListItem(props: BlockListItemProps) {
  const { section, onClicked, onLongPressed } = props;
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

  const getNickName = React.useCallback((section: BlockModel) => {
    if (section.remark && section.remark.length > 0) {
      return section.remark;
    } else if (section.userName && section.userName.length > 0) {
      return section.userName;
    } else {
      return section.userId;
    }
  }, []);

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
          onClicked?.(section);
        }}
        onLongPress={() => {
          onLongPressed?.(section);
        }}
      >
        <Avatar url={section.userAvatar} size={40} />
        <View
          style={{
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: '80%',
          }}
        >
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{ color: getColor('t1') }}
          >
            {getNickName(section)}
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
export const BlockListItemMemo = React.memo(BlockListItem);

/**
 * Block list item header component.
 */
export function BlockListItemHeader(
  props: SectionListData<BlockListItemProps, IndexModel>
) {
  const { indexTitle } = props;
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
  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
        },
      ]}
    >
      <View
        style={[
          {
            height: 32,
            justifyContent: 'center',
            paddingLeft: 16,
          },
        ]}
      >
        <SingleLineText
          paletteType={'title'}
          textType={'small'}
          style={{
            color: getColor('t2'),
          }}
        >
          {indexTitle}
        </SingleLineText>
      </View>
    </View>
  );
}
export const BlockListItemHeaderMemo = React.memo(BlockListItemHeader);
