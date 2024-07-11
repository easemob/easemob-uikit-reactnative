import * as React from 'react';
import { View } from 'react-native';

import { getNewRequest } from '../../chat/utils';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { CmnButton } from '../../ui/Button';
import { PressableHighlight } from '../../ui/Pressable';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { NewRequestsItemProps } from './types';

/**
 * New Requests Item Component.
 */
export function NewRequestsItem(props: NewRequestsItemProps) {
  const { onClicked, onLongPressed, onButtonClicked, data } = props;
  const { cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    pin_bg: {
      light: colors.neutral[9],
      dark: colors.neutral[6],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
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
        <Avatar url={data.avatar} size={40} />
        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: '65%',
          }}
        >
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{
              color: getColor('fg'),
            }}
          >
            {data.name ?? data.requestId}
          </SingleLineText>
          <SingleLineText
            paletteType={'title'}
            textType={'small'}
            style={{
              color: getColor('t2'),
            }}
          >
            {tr(getNewRequest(data.msg)?.tip ?? '')}
          </SingleLineText>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'column' }}>
          <CmnButton
            sizesType={'small'}
            radiusType={input}
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
          marginLeft: 68,
        }}
      />
    </PressableHighlight>
  );
}
export const NewRequestsItemMemo = React.memo(NewRequestsItem);
