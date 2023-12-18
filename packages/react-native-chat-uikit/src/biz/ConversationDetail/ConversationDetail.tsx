import * as React from 'react';
import { View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import {
  TopNavigationBar,
  TopNavigationBarRightList,
} from '../TopNavigationBar';
import { useConversationDetail } from './ConversationDetail.hooks';
import type { ConversationDetailProps } from './types';

export function ConversationDetail(props: ConversationDetailProps) {
  const { containerStyle, onBack, convId, convName } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  const {
    onClickedSend,
    _messageInputRef,
    _MessageInput,
    messageInputProps,
    _messageListRef,
    _MessageList,
    messageListProps,
    onQuoteMessageForInput,
  } = useConversationDetail(props);

  const navigationBar = () => {
    return (
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24 }}
              onPress={() => {
                onBack?.();
              }}
            />
            <Avatar url={g_not_existed_url} size={24} />
            <View style={{ marginLeft: 10 }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('text') }}
              >
                {convName ?? convId}
              </Text>
              <Text
                textType={'extraSmall'}
                paletteType={'label'}
                style={{ color: getColor('text_enable') }}
              >
                {tr('State')}
              </Text>
            </View>
          </View>
        }
        Right={TopNavigationBarRightList}
        RightProps={{
          onClickedList: [
            () => {
              // todo: click phone_pick
            },
            () => {
              // todo: click video_camera
            },
          ],
          iconNameList: ['phone_pick', 'video_camera'],
        }}
        containerStyle={{ paddingHorizontal: 12 }}
      />
    );
  };

  return (
    <View style={[{ flexGrow: 1 }, containerStyle]}>
      {navigationBar()}
      <_MessageList
        onClicked={() => {
          _messageInputRef?.current?.close?.();
        }}
        onQuoteMessageForInput={onQuoteMessageForInput}
        ref={_messageListRef}
        {...messageListProps}
      />
      <_MessageInput
        ref={_messageInputRef}
        onClickedSend={onClickedSend}
        onHeightChange={(height) => {
          _messageListRef?.current?.onInputHeightChange?.(height);
        }}
        {...messageInputProps}
      />
      {/* <MessageInput ref={messageInputRef} /> */}
    </View>
  );
}
