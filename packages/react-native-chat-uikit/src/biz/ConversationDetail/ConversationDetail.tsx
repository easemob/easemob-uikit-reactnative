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
import {
  MessageInput,
  MessageInputProps,
  MessageInputRef,
} from './MessageInput';
import { MessageList } from './MessageList';

export type ConversationDetailProps = {
  input?: {
    props?: MessageInputProps;
    render?: React.ForwardRefExoticComponent<
      MessageInputProps & React.RefAttributes<MessageInputRef>
    >;
    ref?: React.RefObject<MessageInputRef>;
  };
};
export function ConversationDetail(props: ConversationDetailProps) {
  const { input } = props;
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

  const messageInputRef = React.useRef<MessageInputRef>({} as any);
  const _messageInputRef = input?.ref ?? messageInputRef;
  const _MessageInput = input?.render ?? MessageInput;
  const messageInputProps = input?.props ?? {};

  const navigationBar = () => {
    return (
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24 }}
              onPress={() => {
                // todo: left
              }}
            />
            <Avatar url={g_not_existed_url} size={24} />
            <View style={{ marginLeft: 10 }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('text') }}
              >
                {tr('NickName')}
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
    <View style={{ flexGrow: 1 }}>
      {navigationBar()}
      <MessageList
        onClicked={() => {
          messageInputRef?.current?.close?.();
        }}
      />
      <_MessageInput ref={_messageInputRef} {...messageInputProps} />
      {/* <MessageInput ref={messageInputRef} /> */}
    </View>
  );
}
