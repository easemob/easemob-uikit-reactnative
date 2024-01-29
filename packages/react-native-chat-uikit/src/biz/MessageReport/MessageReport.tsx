import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18nContext } from '../../i18n';
import { useThemeContext } from '../../theme';
import { BorderButton, CmnButton } from '../../ui/Button';
import { gBottomSheetHeaderHeight } from '../const';
import { gTabHeaderHeight } from './MessageReport.const';
import { useMessageReportApi, useScrollGesture } from './MessageReport.hooks';
import {
  MessageReportItemMemo,
  MessageReportItemProps,
} from './MessageReport.item';
import type { ReportItemModel } from './types';

/**
 * Properties of the `MessageReport` component.
 */
export type MessageReportProps = {
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture?: (finished: boolean) => void;
  /**
   * Callback function when cancel button is clicked.
   */
  onCancel: () => void;
  /**
   * Callback function when report button is clicked.
   */
  onReport: (result?: ReportItemModel) => void;
  /**
   * data source. {@link ReportItemModel}
   */
  data: ReportItemModel[];
  /**
   * The height of the component.
   */
  height?: number;
};

/**
 * Component for reporting messages.
 *
 * This component is mainly used for reporting illegal messages.
 *
 * @param props {@link MessageReportProps}
 * @returns JSX.Element
 *
 */
export function MessageReport(props: MessageReportProps) {
  const {
    requestUseScrollGesture,
    onCancel,
    data: propData,
    onReport,
    height: propsHeight,
  } = props;
  const { data, onUpdate } = useMessageReportApi(propData);
  const { isScrollingRef, handles } = useScrollGesture(requestUseScrollGesture);
  const ref = React.useRef<FlatList<MessageReportItemProps>>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const { cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
  const { bottom } = useSafeAreaInsets();
  const { tr } = useI18nContext();
  let height =
    propsHeight ??
    (winHeight * 3) / 5 -
      gBottomSheetHeaderHeight -
      gTabHeaderHeight -
      bottom -
      (StatusBar.currentHeight ?? 0);

  return (
    <View
      style={{
        height: height,
      }}
      {...handles}
    >
      <FlatList
        ref={ref}
        data={data}
        renderItem={(info: ListRenderItemInfo<MessageReportItemProps>) => {
          const { item } = info;
          return (
            <MessageReportItemMemo
              data={item.data}
              onChecked={() => {
                onUpdate(item);
              }}
            />
          );
        }}
        keyExtractor={(item: MessageReportItemProps) => {
          return item.data.id;
        }}
        onMomentumScrollEnd={() => {
          if (Platform.OS !== 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
        onResponderEnd={() => {
          if (Platform.OS === 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingVertical: 8,
        }}
      >
        <BorderButton
          sizesType={'large'}
          radiusType={input}
          contentType={'only-text'}
          text={tr('cancel')}
          style={{ width: '42%', height: 40 }}
          onPress={onCancel}
        />
        <CmnButton
          sizesType={'large'}
          radiusType={input}
          contentType={'only-text'}
          text={tr('report')}
          style={{ width: '42%', height: 40 }}
          onPress={() => {
            onReport?.(
              data.map((v) => v.data).filter((v) => v.checked === true)[0]
            );
          }}
        />
      </View>
    </View>
  );
}
