import * as React from 'react';
import { Pressable, View } from 'react-native';

import { getNewRequest } from '../../chat/utils';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { CmnButton } from '../../ui/Button';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { NewRequestsItemProps } from './types';

export function NewRequestsItem(props: NewRequestsItemProps) {
  const { onClicked, onLongPressed, onButtonClicked, data } = props;
  const { tr } = useI18nContext();
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
          height: 75.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Avatar url={data.avatar} size={40} />
        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: '55%',
          }}
        >
          <SingleLineText paletteType={'title'} textType={'medium'}>
            {data.name ?? data.requestId}
          </SingleLineText>
          <SingleLineText paletteType={'body'} textType={'medium'}>
            {getNewRequest(data.msg)?.tip}
          </SingleLineText>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'column' }}>
          <CmnButton
            sizesType={'small'}
            radiusType={'small'}
            contentType={'only-text'}
            style={{ height: 28, width: 74 }}
            text={tr('add')}
            onPress={() => {
              onButtonClicked?.(data);
            }}
          />
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
export const NewRequestsItemMemo = React.memo(NewRequestsItem);
