import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import type { MessageListItemProps, VoiceContent } from './types';

export function MessageListVoiceItem(props: MessageListItemProps) {
  const { content } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const c = content as VoiceContent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name={'2_bars_in_circle'} style={{ height: 10, width: 43 }} />
      <Text
        textType={'medium'}
        paletteType={'body'}
        style={{ color: getColor('text') }}
      >{`${c.length}''`}</Text>
    </View>
  );
}
