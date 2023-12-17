import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButtonMemo } from '../../ui/Button';
import { SingleLineText } from '../../ui/Text';

export type MessageInputQuoteViewProps = {
  showQuote: boolean;
  onDel: () => void;
};
export const MessageInputQuoteView = (props: MessageInputQuoteViewProps) => {
  const { showQuote, onDel } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    quote: {
      light: colors.neutral[9],
      dark: colors.neutral[3],
    },
    quote_del: {
      light: colors.neutral[3],
      dark: colors.neutral[7],
    },
  });

  if (showQuote !== true) {
    return null;
  }
  return (
    <View
      style={{
        height: 52,
        backgroundColor: getColor('quote'),
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <View style={{ flexGrow: 1 }}>
        <SingleLineText
          textType={'small'}
          paletteType={'label'}
          style={{
            color: getColor('quote_del'),
          }}
        >
          {tr('you are quote a message')}
        </SingleLineText>
        <SingleLineText
          textType={'small'}
          paletteType={'label'}
          style={{
            color: getColor('quote_del'),
          }}
        >
          {tr('original message')}
        </SingleLineText>
      </View>
      <IconButtonMemo
        iconName={'xmark_in_circle_fill'}
        style={{
          width: 20,
          height: 20,
          tintColor: getColor('quote_del'),
        }}
        onPress={onDel}
      />
    </View>
  );
};
