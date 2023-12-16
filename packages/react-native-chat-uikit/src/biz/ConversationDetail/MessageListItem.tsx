import * as React from 'react';
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';
import type { IconNameType } from 'src/assets';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { DynamicIcon, DynamicIconRef, Icon, Image } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { gMaxVoiceDuration } from '../const';
import {
  getImageShowSize,
  getImageThumbUrl,
  getMessageState,
  isSupportMessage,
} from './MessageListItem.hooks';
import type {
  MessageLayoutType,
  MessageListItemActionsProps,
  MessageListItemProps,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export type MessageTextProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
  isSupport: boolean;
};
export function MessageText(props: MessageTextProps) {
  const { layoutType, msg, isSupport } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_text: {
      light: colors.neutral[1],
      dark: colors.neutral[1],
    },
    right_text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const body = msg.body as ChatTextMessageBody;
  let content = body.content;
  if (isSupport !== true) {
    content = tr('not-support-message');
  }
  return (
    <Text
      textType={'large'}
      paletteType={'body'}
      style={{
        color: getColor(layoutType === 'left' ? 'left_text' : 'right_text'),
      }}
    >
      {content}
    </Text>
  );
}

export type MessageImageProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
};
export function MessageImage(props: MessageImageProps) {
  const { msg } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();
  const { width, height } = getImageShowSize(msg);
  React.useEffect(() => {
    msg.status;
    getImageThumbUrl(msg)
      .then((url) => {
        setThumbUrl(url);
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <Image
      style={{ width: width, height: height }}
      source={{ uri: thumbUrl }}
    />
  );
}

export type MessageVoiceProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
  isPlay?: boolean;
};
export function MessageVoice(props: MessageVoiceProps) {
  const { msg, layoutType, isPlay: propsIsPlay = false } = props;
  const body = msg.body as ChatVoiceMessageBody;
  const { duration } = body;
  const maxWidth = Dimensions.get('window').width * 0.6;
  const minWidth = Dimensions.get('window').width * 0.1;
  const width =
    Math.floor(((maxWidth - minWidth) * duration) / gMaxVoiceDuration) +
    minWidth;
  // const loopCount = React.useRef(
  //   Math.floor(duration / (gFrameInterval * 3))
  // ).current;
  const loopCount = -1;
  const ref = React.useRef<DynamicIconRef>({} as any);
  // const isPlayRef = React.useRef(false);
  console.log('test:zuoyu:MessageVoice:', width, maxWidth, minWidth);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_voice: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    right_voice: {
      light: colors.neutral[98],
      dark: colors.neutral[95],
    },
    left_second: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right_second: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const voiceIcons = React.useMemo((): IconNameType[] => {
    if (layoutType === 'left') {
      return [
        '1st_frame_lft_lgt_sdy',
        '2nd_frame_lft_lgt_sdy',
        '3th_frame_lft_lgt_sdy',
      ];
    } else {
      return [
        '1st_frame_rgt_lgt_sdy',
        '2nd_frame_rgt_lgt_sdy',
        '3th_frame_rgt_lgt_sdy',
      ];
    }
  }, [layoutType]);
  const seconds = Math.floor(duration / 1000);

  React.useEffect(() => {
    console.log('test:zuoyu:useEffect:voice:', propsIsPlay);
    if (propsIsPlay === true) {
      ref.current?.startPlay?.();
    } else {
      ref.current?.stopPlay?.();
    }
  }, [propsIsPlay]);

  return (
    <View
      style={{
        flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
        maxWidth: '100%',
        width: width,
        alignItems: 'center',
      }}
    >
      <DynamicIcon
        propsRef={ref}
        names={voiceIcons}
        loopCount={loopCount}
        // onPlayStart={onPlayStart}
        // onPlayFinished={onPlayFinished}
        initialIndex={2}
        style={{
          width: 20,
          height: 20,
          tintColor: getColor(
            layoutType === 'left' ? 'left_voice' : 'right_voice'
          ),
        }}
      />
      <View style={{ flexGrow: 1 }} />
      <Text
        textType={'large'}
        paletteType={'body'}
        style={{
          color: getColor(
            layoutType === 'left' ? 'left_second' : 'right_second'
          ),
        }}
      >{`${seconds}"`}</Text>
    </View>
  );
}

export type MessageBubbleProps = MessageListItemActionsProps & {
  hasTriangle?: boolean;
  model: MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
};
export function MessageBubble(props: MessageBubbleProps) {
  const {
    hasTriangle = true,
    model,
    containerStyle,
    onClicked,
    onLongPress,
  } = props;
  const { layoutType, msg, isVoicePlaying } = model;
  const isSupport = isSupportMessage(msg);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_bg: {
      light: colors.primary[95],
      dark: colors.primary[6],
    },
    right_bg: {
      light: colors.primary[5],
      dark: colors.primary[2],
    },
  });

  const getContent = () => {
    if (isSupport === true) {
      switch (msg.body.type) {
        case ChatMessageType.TXT: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
            />
          );
        }
        case ChatMessageType.IMAGE: {
          return <MessageImage layoutType={layoutType} msg={msg} />;
        }
        case ChatMessageType.VOICE: {
          return (
            <MessageVoice
              msg={msg}
              layoutType={layoutType}
              isPlay={isVoicePlaying}
            />
          );
        }
        case ChatMessageType.VIDEO: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
            />
          );
        }
        case ChatMessageType.FILE: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
            />
          );
        }
        case ChatMessageType.CUSTOM: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
            />
          );
        }
        default: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
            />
          );
        }
      }
    } else {
      return (
        <MessageText msg={msg} layoutType={layoutType} isSupport={isSupport} />
      );
    }
  };

  const _onClicked = React.useCallback(() => {
    if (onClicked) {
      onClicked(msg.msgId.toString(), model);
    }
  }, [model, msg.msgId, onClicked]);

  const _onLongPress = React.useCallback(() => {
    if (onLongPress) {
      onLongPress(msg.msgId.toString(), model);
    }
  }, [model, msg.msgId, onLongPress]);

  return (
    <View
      style={[
        {
          flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
          maxWidth: '66.6%',
        },
        containerStyle,
      ]}
    >
      {msg.body.type === ChatMessageType.IMAGE ? null : null}
      {hasTriangle === true && msg.body.type !== ChatMessageType.IMAGE ? (
        <View style={{ paddingBottom: 10 }}>
          <View style={{ flexGrow: 1 }} />
          <Icon
            name={
              layoutType === 'left' ? 'message_arrow_lft' : 'message_arrow_rgt'
            }
            style={{
              width: 5,
              height: 8,
              tintColor: getColor(
                layoutType === 'left' ? 'left_bg' : 'right_bg'
              ),
            }}
          />
        </View>
      ) : null}

      <Pressable
        style={[
          styles.text_bubble,
          {
            backgroundColor: getColor(
              layoutType === 'left' ? 'left_bg' : 'right_bg'
            ),
            borderRadius: 4,
            paddingHorizontal:
              msg.body.type === ChatMessageType.IMAGE ? undefined : 12,
            paddingVertical:
              msg.body.type === ChatMessageType.IMAGE ? undefined : 7,
          },
        ]}
        onTouchEnd={_onClicked}
        onLongPress={_onLongPress}
      >
        {getContent()}
      </Pressable>
    </View>
  );
}
export type AvatarViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
export function AvatarView(props: AvatarViewProps) {
  const { isVisible = true, layoutType } = props;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? 12 : 8,
        paddingRight: layoutType === 'left' ? 8 : 12,
      }}
    >
      <View style={{ flexGrow: 1 }} />
      <Avatar size={28} />
    </View>
  );
}
export type NameViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
export function NameView(props: NameViewProps) {
  const { isVisible = true, layoutType } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? 53 : undefined,
        paddingRight: layoutType === 'left' ? undefined : 53,
      }}
    >
      <Text
        textType={'small'}
        paletteType={'label'}
        style={{
          color: getColor('text'),
        }}
      >
        {'name'}
      </Text>
    </View>
  );
}

export type TimeViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
export function TimeView(props: TimeViewProps) {
  const { isVisible = true, layoutType } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? 53 : undefined,
        paddingRight: layoutType === 'left' ? undefined : 53,
      }}
    >
      <Text
        textType={'small'}
        paletteType={'body'}
        style={{ color: getColor('text') }}
      >
        {'2023.11.23'}
      </Text>
    </View>
  );
}

export type StateViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
export function StateView(props: StateViewProps) {
  const { isVisible = true, layoutType } = props;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? 4 : undefined,
        paddingRight: layoutType === 'left' ? undefined : 4,
      }}
    >
      <View style={{ flexGrow: 1 }} />
      <Icon name={'loading'} style={{ width: 20, height: 20 }} />
    </View>
  );
}

export type CheckViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
export function CheckView(props: CheckViewProps) {
  const { isVisible = false, layoutType } = props;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        justifyContent: 'center',
        paddingLeft: layoutType === 'left' ? 12 : undefined,
        paddingRight: layoutType === 'left' ? undefined : 12,
      }}
    >
      <Icon name={'checked_ellipse'} style={{ width: 20, height: 20 }} />
    </View>
  );
}

export type MessageViewProps = MessageListItemActionsProps & {
  isVisible?: boolean;
  model: MessageModel;
  avatarIsVisible?: boolean;
  nameIsVisible?: boolean;
  timeIsVisible?: boolean;
};
export function MessageView(props: MessageViewProps) {
  const {
    isVisible = true,
    model,
    avatarIsVisible = true,
    nameIsVisible = true,
    timeIsVisible = true,
    ...others
  } = props;
  const { layoutType } = model;
  const state = getMessageState(model.msg);
  return (
    <View
      style={{
        flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
        display: isVisible === true ? 'flex' : 'none',
      }}
    >
      <CheckView layoutType={layoutType} />
      <View
        style={{
          flexDirection: 'column',
          alignItems: layoutType === 'left' ? 'flex-start' : 'flex-end',
        }}
      >
        {nameIsVisible ? <NameView layoutType={layoutType} /> : null}
        <View
          style={{
            flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
          }}
        >
          {avatarIsVisible ? <AvatarView layoutType={layoutType} /> : null}
          <MessageBubble model={model} {...others} />
          {state !== 'none' ? <StateView layoutType={layoutType} /> : null}
        </View>
        {timeIsVisible ? <TimeView layoutType={layoutType} /> : null}
      </View>
    </View>
  );
}

export type SystemTipViewProps = {
  isVisible?: boolean;
  model: SystemMessageModel;
};
export function SystemTipView(props: SystemTipViewProps) {
  const { isVisible = true, model } = props;
  const { contents } = model;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        alignItems: 'center',
        paddingHorizontal: 27.5,
      }}
    >
      <Text style={{ flexWrap: 'wrap', textAlign: 'center' }}>
        {contents?.[0]}
      </Text>
    </View>
  );
}

export type TimeTipViewProps = {
  isVisible?: boolean;
  model: TimeMessageModel;
};
export function TimeTipView(props: TimeTipViewProps) {
  const { isVisible = true, model } = props;
  const { timestamp } = model;
  const date = new Date(timestamp);
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        alignItems: 'center',
        paddingHorizontal: 27.5,
      }}
    >
      <Text style={{ flexWrap: 'wrap', textAlign: 'center' }}>
        {date.toDateString()}
      </Text>
    </View>
  );
}

export function MessageListItem(props: MessageListItemProps) {
  const { model, ...others } = props;
  const { modelType } = model;
  return (
    <View
      style={{
        // height: 100,
        // width: '100%',
        borderBottomColor: 'yellow',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 8,
        flexDirection: 'column',
      }}
    >
      {modelType === 'message' ? (
        <MessageView
          isVisible={modelType === 'message' ? true : false}
          model={model as MessageModel}
          {...others}
        />
      ) : null}
      {modelType === 'system' ? (
        <SystemTipView
          isVisible={modelType === 'system' ? true : false}
          model={model as SystemMessageModel}
        />
      ) : null}
      {modelType === 'time' ? (
        <TimeTipView
          isVisible={modelType === 'time' ? true : false}
          model={model as TimeMessageModel}
        />
      ) : null}
    </View>
  );
}

export const MessageListItemMemo = React.memo(MessageListItem);

const styles = StyleSheet.create({
  text_bubble: {
    overflow: 'hidden',
  },
});
