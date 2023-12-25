import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { SingleLineText } from '../../ui/Text';
import { gMessageReportItemHeight } from './MessageReport.const';
import type { ReportItemModel } from './types';

export type MessageReportItemProps = {
  data: ReportItemModel;
  onChecked?: (current: boolean) => void;
};

export function MessageReportItem(props: MessageReportItemProps) {
  const { colors } = usePaletteContext();
  const { tr } = useI18nContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    color: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    checked: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    unchecked: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const { data, onChecked } = props;
  const { id, title, checked } = data;
  return (
    <View
      key={id}
      style={{
        backgroundColor: getColor('backgroundColor'),
        paddingHorizontal: 16,
        width: '100%',
        height: gMessageReportItemHeight,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            marginVertical: 10,
            maxWidth: '90%',
          }}
        >
          <SingleLineText
            textType={'medium'}
            paletteType={'title'}
            style={{
              color: getColor('color'),
            }}
          >
            {tr(title)}
          </SingleLineText>
        </View>
        <View style={{ flex: 1 }} />
        <IconButton
          iconName={checked === true ? 'radio_ellipse' : 'unchecked_ellipse'}
          style={{
            tintColor:
              checked === true ? getColor('checked') : getColor('unchecked'),
            width: 24,
            height: 24,
            margin: 4,
          }}
          onPress={() => {
            onChecked?.(checked);
          }}
        />
      </View>
    </View>
  );
}

export const MessageReportItemMemo = React.memo(MessageReportItem);
