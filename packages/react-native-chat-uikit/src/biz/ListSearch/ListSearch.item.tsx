import * as React from 'react';
import { Pressable, View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { HighText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { DefaultComponentModel, ListSearchItemProps } from './types';

export function ListSearchItem<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
>(props: ListSearchItemProps<ComponentModel>) {
  const { data, keyword, onClicked } = props;
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
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        onClicked?.(data);
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
        <Avatar url={g_not_existed_url} size={50} />
        <HighText
          paletteType={'title'}
          textType={'medium'}
          containerStyle={{
            flexDirection: 'row',
            flexGrow: 1,
            paddingLeft: 12,
          }}
          keyword={keyword}
          content={data.name}
        />
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
