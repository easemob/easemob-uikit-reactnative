import * as React from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { useDispatchListener } from '../../dispatch';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import type { ChatMessage } from '../../rename.chat';
import { usePaletteContext } from '../../theme';
import { BorderButton } from '../../ui/Button';
import { seqId } from '../../utils';
import { BottomSheetNameMenu, InitMenuItemsType } from '../BottomSheetMenu';
import {
  BottomSheetMessageReport,
  BottomSheetMessageReportProps,
  ReportItemModel,
} from '../MessageReport';
import type { PropsWithError, PropsWithTest } from '../types';
import {
  gMessageListHeight,
  gMessageListMarginBottom,
  gMessageListMarginLeft,
  gMessageListWidth,
} from './MessageList.const';
import { useMessageListApi } from './MessageList.hooks';
import { MessageListItemMemo } from './MessageList.item';
import type { MessageListItemModel, MessageListItemProps } from './types';

/**
 * Referencing value of the `MessageList` component.
 */
export type MessageListRef = {
  /**
   * Add a sended successful message to the list.
   */
  addSendedMessage: (message: ChatMessage) => void;
  /**
   * Scroll to the end of the list.
   */
  scrollToEnd: () => void;

  /**
   * Close menu.
   */
  closeMenu: (onFinished?: () => void) => void;

  /**
   * Translation message.
   * @param msg Messages that need to be translated.
   */
  translateMessage: (msg?: ChatMessage | undefined) => void;

  /**
   * Recall the message and other devices will be affected and deleted.
   * @param msg Message that need to be recalled.
   */
  deleteMessage: (msg?: ChatMessage | undefined) => void;
};

/**
 * Properties of the `MessageList` component.
 */
export type MessageListProps = {
  /**
   * Whether the component is visible.
   */
  visible?: boolean;
  /**
   * Callback function when the gesture is used.
   */
  onLongPressItem?: (item: MessageListItemModel) => void;
  /**
   * Callback function when the unread count changes.
   */
  onUnreadCount?: (count: number) => void;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Callback function when the layout is changed.
   */
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  /**
   * Custom component for each item in the list. Built-in components are used by default.
   */
  MessageListItemComponent?: React.ComponentType<MessageListItemProps>;

  /**
   * Properties of the `Report` component.
   */
  reportProps?: BottomSheetMessageReportProps;
  /**
   * Maximum number of messages displayed.
   *
   * Older messages exceeding this value will be recycled.
   * The default value is 1000.
   * Range: (0,10000]
   */
  maxMessageCount?: number;

  /**
   * Message list menu items.
   */
  messageMenuItems?: InitMenuItemsType[];
} & PropsWithTest &
  PropsWithError;

/**
 * Component for displaying the list of messages.
 */
export const MessageList = React.forwardRef<MessageListRef, MessageListProps>(
  function (props: MessageListProps, ref?: React.ForwardedRef<MessageListRef>) {
    const {
      onLongPressItem,
      onUnreadCount,
      containerStyle,
      visible = true,
      onLayout: onLayoutProps,
      reportProps = {} as BottomSheetMessageReportProps,
      MessageListItemComponent,
      maxMessageCount,
      messageMenuItems,
    } = props;
    const {
      data,
      addSendedMessage,
      listRef,
      scrollToEnd,
      onEndReached,
      onScroll,
      scrollToLastMessage,
      onScrollBeginDrag,
      onScrollEndDrag,
      onMomentumScrollEnd,
      onLayout,
      translateMessage,
      deleteMessage,
      reportMessage,
      menuRef,
      reportRef,
    } = useMessageListApi({
      onLongPress: onLongPressItem,
      onUnreadCount,
      onLayoutProps,
      maxMessageCount,
      messageMenuItems,
    });

    const { tr } = useI18nContext();
    const defaultData = useGetReportDefaultData(tr);

    React.useImperativeHandle(
      ref,
      () => {
        return {
          addSendedMessage: (message) => {
            addSendedMessage(message);
          },
          scrollToEnd: () => {
            scrollToEnd();
          },
          closeMenu: (onFinished?: () => void) => {
            menuRef?.current?.startHide?.(onFinished);
          },
          translateMessage: (msg) => {
            translateMessage(msg);
          },
          deleteMessage: (msg) => {
            deleteMessage(msg);
          },
        };
      },
      [addSendedMessage, deleteMessage, menuRef, scrollToEnd, translateMessage]
    );

    const getReportData = React.useMemo(() => {
      if (reportProps?.data) {
        return reportProps.data;
      }
      return defaultData;
    }, [defaultData, reportProps?.data]);

    const getOnReport = React.useMemo(() => {
      if (reportProps?.onReport) {
        return { onReport: reportProps.onReport };
      }
      return {
        onReport: (result?: ReportItemModel) => {
          reportMessage(result);
          reportRef?.current?.startHide?.();
        },
      };
    }, [reportMessage, reportProps, reportRef]);

    const _MessageListItemComponent =
      MessageListItemComponent ?? MessageListItemMemo;

    if (visible === false) {
      return null;
    }

    return (
      <>
        <View
          style={[
            {
              marginLeft: gMessageListMarginLeft,
              marginBottom: gMessageListMarginBottom,
              width: gMessageListWidth,
              height: gMessageListHeight,
              // backgroundColor: '#ffd700',
            },
            containerStyle,
          ]}
          onLayout={onLayout}
        >
          <FlatList
            ref={listRef}
            data={data}
            renderItem={(info: ListRenderItemInfo<MessageListItemProps>) => {
              return <_MessageListItemComponent {...info.item} />;
            }}
            // renderItem={RenderItemMemo}
            keyExtractor={(item: MessageListItemProps) => {
              return item.id;
            }}
            onEndReached={onEndReached}
            onScroll={onScroll}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
          <UnreadButton onPress={scrollToLastMessage} />
        </View>
        <BottomSheetNameMenu
          ref={menuRef}
          onRequestModalClose={() => {
            menuRef?.current?.startHide?.();
          }}
          initItems={[]}
        />
        <BottomSheetMessageReport
          ref={reportRef}
          {...reportProps}
          onReport={getOnReport.onReport}
          data={getReportData}
        />
      </>
    );
  }
);

export const MessageListMemo = React.memo(MessageList);

// const RenderItemMemo = React.memo(
//   (info: ListRenderItemInfo<MessageListItemProps>) => {
//     const { item } = info;
//     return <MessageListItem {...item} />;
//   }
// );

const UnreadButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const [text, setText] = React.useState('');
  const { tr } = useI18nContext();

  useDispatchListener(
    `_$useMessageListApi_updateUnreadCount`,
    (count: number) => {
      const n = count > 99 ? '99+' : count.toString();
      const content = count === 0 ? '' : tr('${0} new message(s)', n);
      setText(content);
    }
  );

  return (
    <BorderButton
      style={{
        position: 'absolute',
        minWidth: 26,
        height: 26,
        // borderRadius: 24,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: getColor('bg'),
        borderWidth: 0,
        display: text.length === 0 ? 'none' : 'flex',
      }}
      textStyle={{ color: getColor('text') }}
      iconStyle={{ tintColor: getColor('text') }}
      sizesType={'small'}
      radiusType={'large'}
      contentType={'icon-text'}
      icon={'chevron_down_small'}
      text={text}
      onPress={onPress}
    />
  );
};

function useGetReportDefaultData(_tr: (key: string, ...args: any[]) => string) {
  const ret = React.useMemo(() => {
    return [
      {
        id: seqId('_rp').toString(),
        tag: 'tag1',
        title: 'Unwelcome commercial content',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag2',
        title: 'Pornographic or explicit content',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag3',
        title: 'Child abuse',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag4',
        title: 'Hate speech or graphic violence',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag5',
        title: 'Promote terrorism',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag6',
        title: 'Harassment or bullying',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag7',
        title: 'Suicide or self harm',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag8',
        title: 'False information',
        checked: false,
      },
      {
        id: seqId('_rp').toString(),
        tag: 'tag9',
        title: 'Others',
        checked: false,
      },
    ] as ReportItemModel[];
  }, []);
  return ret;
}

export type MessageListComponent = typeof MessageList;
