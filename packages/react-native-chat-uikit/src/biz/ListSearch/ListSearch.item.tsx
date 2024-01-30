import * as React from 'react';
import { Pressable, View } from 'react-native';

import type { DataModel } from '../../chat';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { HighText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { ContactSearchModel } from '../ContactList';
import type { ListSearchItemProps } from './types';

export function ListSearchItem<ComponentModel extends DataModel = DataModel>(
  props: ListSearchItemProps<ComponentModel>
) {
  const { searchType } = props;
  if (searchType === 'create-group' || searchType === 'add-group-member') {
    const p = props as any as ListSearchItemProps<ContactSearchModel>;
    return <StateListSearchItem {...p} />;
  }
  return <DefaultListSearchItem {...props} />;
}
export function DefaultListSearchItem<
  ComponentModel extends DataModel = DataModel
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
        <Avatar url={data.avatar} size={50} />
        <HighText
          paletteType={'title'}
          textType={'medium'}
          containerStyle={{
            flexDirection: 'row',
            flexGrow: 1,
            paddingLeft: 12,
          }}
          keyword={keyword}
          content={data.name ?? data.id}
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
export function StateListSearchItem(
  props: ListSearchItemProps<ContactSearchModel>
) {
  const { data, keyword, onClicked } = props;
  const { checked, onCheckClicked, disable } = data;
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
    disable: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        if (checked !== undefined) {
          if (disable !== true) {
            onCheckClicked?.(data);
          }
        } else {
          onClicked?.(data);
        }
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
        {checked !== undefined ? (
          <View style={{ marginRight: 12 }}>
            <IconButton
              iconName={
                checked !== false ? 'checked_rectangle' : 'unchecked_rectangle'
              }
              style={{
                height: 28,
                width: 28,
                tintColor: getColor(
                  checked === true && disable !== true ? 'enable' : 'disable'
                ),
              }}
              onPress={() => {
                if (disable !== true) {
                  onCheckClicked?.(data);
                }
              }}
            />
          </View>
        ) : null}
        <Avatar url={data.avatar} size={50} />
        <HighText
          paletteType={'title'}
          textType={'medium'}
          containerStyle={{
            flexDirection: 'row',
            flexGrow: 1,
            paddingLeft: 12,
          }}
          keyword={keyword}
          content={data.name ?? data.userId}
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
