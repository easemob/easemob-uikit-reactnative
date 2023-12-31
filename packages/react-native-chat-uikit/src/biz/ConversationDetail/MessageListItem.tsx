import * as React from 'react';
import {
  Dimensions,
  // Image as RNImage,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  ChatCustomMessageBody,
  ChatFileMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import { ICON_ASSETS, IconNameType } from '../../assets';
import {
  gCustomMessageCardEventType,
  gMessageAttributeQuote,
} from '../../chat';
import { userInfoFromMessage } from '../../chat/utils';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import {
  DefaultImage,
  DynamicIcon,
  DynamicIconRef,
  Icon,
  Image,
  LoadingIcon,
} from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { gMaxVoiceDuration } from '../const';
import {
  getFileSize,
  getFormatTime,
  getImageShowSize,
  getImageThumbUrl,
  getMessageBubblePadding,
  getMessageState,
  getStateIcon,
  getStateIconColor,
  getSystemTip,
  getVideoThumbUrl,
  isQuoteMessage,
  isSupportMessage,
} from './MessageListItem.hooks';
import type {
  MessageEditableStateType,
  MessageLayoutType,
  MessageListItemActionsProps,
  MessageListItemProps,
  MessageModel,
  MessageStateType,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export type MessageBasicProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
  maxWidth?: number;
};

export type MessageTextProps = MessageBasicProps & {
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
    left_text_flag: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[7],
    },
    right_text_flag: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const body = msg.body as ChatTextMessageBody;
  let content = body.content;
  const editable =
    body.modifyCount !== undefined && body.modifyCount > 0
      ? 'edited'
      : ('no-editable' as MessageEditableStateType);
  if (isSupport !== true) {
    content = tr('_uikit_msg_tip_not_support');
  }

  return (
    <View>
      <Text
        textType={'large'}
        paletteType={'body'}
        style={{
          color: getColor(layoutType === 'left' ? 'left_text' : 'right_text'),
        }}
      >
        {content}
      </Text>
      {editable === 'edited' ? (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <SingleLineText
            textType={'extraSmall'}
            paletteType={'body'}
            style={{
              color: getColor(
                layoutType === 'left' ? 'left_text_flag' : 'right_text_flag'
              ),
            }}
          >
            {tr('_uikit_msg_edit')}
          </SingleLineText>
        </View>
      ) : null}
    </View>
  );
}

export type MessageDefaultImageProps = {
  url?: string;
  width: number;
  height: number;
  iconName: IconNameType;
  onError?: () => void;
};
export function MessageDefaultImage(props: MessageDefaultImageProps) {
  const { url, width, height, iconName, onError } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
    fg: {
      light: colors.neutral[7],
      dark: colors.neutral[2],
    },
  });
  return (
    <DefaultImage
      source={{
        uri: url,
      }}
      style={[
        {
          width: width,
          height: height,
          borderRadius: 4, // todo:
        },
      ]}
      defaultSource={ICON_ASSETS[iconName]('3x')}
      defaultStyle={{
        width: 64,
        height: 64,
        tintColor: getColor('fg'),
      }}
      defaultContainerStyle={{
        width: width,
        height: height,
        backgroundColor: getColor('bg'),
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onError={onError}
    />
  );
}

export type MessageImageProps = MessageBasicProps & {};
export function MessageImage(props: MessageImageProps) {
  const { msg, maxWidth } = props;
  // const url1 =
  //   '/storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url3 =
  //   'file:///storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718%23demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url5 =
  //   'file:///storage/emulated/0/Android/data/com.hyphenate.rn.ChatUikitExample/1135220126133718#demo/files/asterisk003/asterisk001/53e8d540-a144-11ee-a811-ab4c303d7025.jpg';
  // const url2 =
  //   '/var/mobile/Containers/Data/Application/CC0AD493-D627-463B-B351-44500E6FB1E2/tmp/AD1256B8-B32C-4CFE-B5F5-ECA21662B4E8.jpg';
  // const url4 = g_not_existed_url;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>(undefined);
  const { width, height } = getImageShowSize(msg, maxWidth);
  React.useEffect(() => {
    msg.status;
    getImageThumbUrl(msg)
      .then((url) => {
        console.log('test:zuoyu:url:image:', url);
        setThumbUrl(url);
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <MessageDefaultImage
      url={thumbUrl}
      width={width}
      height={height}
      iconName={'img'}
    />
  );
  // return (
  //   <DefaultImage
  //     source={{
  //       uri: url3,
  //     }}
  //     style={[
  //       {
  //         width: width,
  //         height: height,
  //         borderRadius: 4,
  //       },
  //     ]}
  //     defaultSource={ICON_ASSETS.img('3x')}
  //     defaultStyle={{
  //       width: 64,
  //       height: 64,
  //       // backgroundColor: 'blue',
  //     }}
  //     defaultContainerStyle={{
  //       width: width,
  //       height: height,
  //       // backgroundColor: 'red',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //     }}
  //   />
  // );
  // return (
  //   <RNImage
  //     style={{ width: width, height: height }}
  //     // url={thumbUrl}
  //     // size={width}
  //     source={{ uri: url5 }}
  //     onError={(e) => {
  //       console.log('test:zuoyu:error:', e.nativeEvent.error);
  //     }}
  //     onLoad={(e) => {
  //       console.log('test:zuoyu:onLoad:', e.nativeEvent.source);
  //     }}
  //   />
  // );
}

export type MessageVoiceProps = MessageBasicProps & {
  isPlay?: boolean;
};
export function MessageVoice(props: MessageVoiceProps) {
  const {
    msg,
    layoutType,
    isPlay: propsIsPlay = false,
    maxWidth: propsMaxWidth,
  } = props;
  const body = msg.body as ChatVoiceMessageBody;
  const { duration } = body;
  const maxWidth = propsMaxWidth ?? Dimensions.get('window').width * 0.6;
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
  const seconds = duration;

  React.useEffect(() => {
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
        maxWidth: maxWidth,
        width: Math.floor(width), // !!! Decimals cause errors. Appears only if aligned right. for example: 105.5
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

export type MessageVideoProps = MessageBasicProps & {};
export function MessageVideo(props: MessageVideoProps) {
  const { msg, maxWidth } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();
  const { width, height } = getImageShowSize(msg, maxWidth);
  const [showTriangle, setShowTriangle] = React.useState(true);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    video: {
      light: colors.neutral[98],
      dark: colors.neutral[95],
    },
  });
  React.useEffect(() => {
    msg.status;
    getVideoThumbUrl(msg, (url) => {
      setThumbUrl(url);
    })
      .then((url) => {
        if (url !== undefined) {
          setThumbUrl(url);
        }
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <View>
      <MessageDefaultImage
        url={thumbUrl}
        width={width}
        height={height}
        iconName={'triangle_in_rectangle'}
        onError={() => {
          setShowTriangle(false);
        }}
      />
      {showTriangle === true ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Icon
            name={'triangle_in_circle'}
            style={{ width: 64, height: 64, tintColor: getColor('video') }}
            resolution={'3x'}
          />
        </View>
      ) : null}
    </View>
  );
}

export type MessageFileProps = MessageBasicProps & {};
export function MessageFile(props: MessageFileProps) {
  const { msg, maxWidth, layoutType } = props;
  const body = msg.body as ChatFileMessageBody;
  const fileName = body.displayName;
  const fileSize = React.useMemo(
    () => getFileSize(body.fileSize),
    [body.fileSize]
  );
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_file_bg: {
      light: colors.neutral[100],
      dark: colors.neutral[6],
    },
    right_file_bg: {
      light: colors.neutral[100],
      dark: colors.neutral[6],
    },
    left_file_fg: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    right_file_fg: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    left_name: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right_name: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    left_size: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    right_size: {
      light: colors.neutral[95],
      dark: colors.neutralSpecial[6],
    },
  });
  return (
    <View
      style={{
        flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
        width: maxWidth,
      }}
    >
      <View
        style={{
          padding: 6,
          backgroundColor: getColor(
            layoutType === 'left' ? 'left_file_bg' : 'right_file_bg'
          ),
          borderRadius: 4,
        }}
      >
        <Icon
          name={'doc'}
          style={{
            width: 32,
            height: 32,
            tintColor: getColor(
              layoutType === 'left' ? 'left_file_fg' : 'right_file_fg'
            ),
          }}
        />
      </View>

      {layoutType === 'left' ? null : <View style={{ flexGrow: 1 }} />}
      <View
        style={{
          maxWidth: '75%',
          paddingHorizontal: layoutType === 'left' ? 12 : undefined,
        }}
      >
        <SingleLineText
          textType={'medium'}
          paletteType={'title'}
          style={{
            color: getColor(layoutType === 'left' ? 'left_name' : 'right_name'),
          }}
        >
          {fileName}
        </SingleLineText>
        <SingleLineText
          textType={'medium'}
          paletteType={'title'}
          style={{
            color: getColor(layoutType === 'left' ? 'left_size' : 'right_size'),
          }}
        >
          {fileSize}
        </SingleLineText>
      </View>
    </View>
  );
}

export type MessageCustomCardProps = MessageBasicProps & {};
export function MessageCustomCard(props: MessageCustomCardProps) {
  const { msg, maxWidth, layoutType } = props;
  const body = msg.body as ChatCustomMessageBody;
  const avatar = body.params?.avatar;
  const userId = body.params?.userId;
  const userName = body.params?.nickname;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_divider: {
      light: colors.neutralSpecial[8],
      dark: colors.primary[6],
    },
    right_divider: {
      light: colors.primary[8],
      dark: colors.primary[6],
    },
    left_name: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    right_name: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    left_name_small: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[3],
    },
    right_name_small: {
      light: colors.neutral[95],
      dark: colors.neutralSpecial[7],
    },
  });
  return (
    <View style={{ width: maxWidth }}>
      <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size={44} url={avatar} />
        <View style={{ width: 12 }} />
        <SingleLineText
          textType={'medium'}
          paletteType={'title'}
          style={{
            color: getColor(layoutType === 'left' ? 'left_name' : 'right_name'),
            maxWidth: '70%',
          }}
        >
          {userId ?? userName}
        </SingleLineText>
      </View>
      <View
        style={{
          borderBottomColor: getColor(
            layoutType === 'left' ? 'left_divider' : 'right_divider'
          ),
          borderBottomWidth: 0.5,
          marginHorizontal: 12,
        }}
      />
      <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
        <SingleLineText
          textType={'extraSmall'}
          paletteType={'label'}
          style={{
            color: getColor(
              layoutType === 'left' ? 'left_name_small' : 'right_name_small'
            ),
            maxWidth: '100%',
          }}
        >
          {'contact'}
        </SingleLineText>
      </View>
    </View>
  );
}

export type MessageBubbleProps = MessageListItemActionsProps & {
  hasTriangle?: boolean;
  model: MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
};
export function MessageBubble(props: MessageBubbleProps) {
  const {
    hasTriangle = true,
    model,
    containerStyle,
    onClicked,
    onLongPress,
    maxWidth,
  } = props;
  const { layoutType, msg, isVoicePlaying } = model;
  const { paddingHorizontal, paddingVertical } = React.useMemo(
    () => getMessageBubblePadding(msg),
    [msg]
  );
  const triangleWidth = 5;
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
  const isShowTriangle = React.useMemo(() => {
    return (
      hasTriangle === true &&
      msg.body.type !== ChatMessageType.IMAGE &&
      msg.body.type !== ChatMessageType.VIDEO
    );
  }, [hasTriangle, msg.body.type]);
  const contentMaxWidth = React.useMemo(() => {
    const _maxWidth = maxWidth
      ? maxWidth - (paddingHorizontal ?? 0) * 2
      : undefined;
    if (isShowTriangle === true) {
      return _maxWidth ? _maxWidth - triangleWidth : undefined;
    } else {
      return _maxWidth;
    }
  }, [isShowTriangle, maxWidth, paddingHorizontal]);

  const getContent = () => {
    if (isSupport === true) {
      switch (msg.body.type) {
        case ChatMessageType.TXT: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
              maxWidth={contentMaxWidth}
            />
          );
        }
        case ChatMessageType.IMAGE: {
          return (
            <MessageImage
              layoutType={layoutType}
              msg={msg}
              maxWidth={contentMaxWidth}
            />
          );
        }
        case ChatMessageType.VOICE: {
          return (
            <MessageVoice
              msg={msg}
              layoutType={layoutType}
              isPlay={isVoicePlaying}
              maxWidth={contentMaxWidth}
            />
          );
        }
        case ChatMessageType.VIDEO: {
          return (
            <MessageVideo
              msg={msg}
              layoutType={layoutType}
              maxWidth={contentMaxWidth}
            />
          );
        }
        case ChatMessageType.FILE: {
          return (
            <MessageFile
              msg={msg}
              layoutType={layoutType}
              maxWidth={contentMaxWidth}
            />
          );
        }
        case ChatMessageType.CUSTOM: {
          const body = msg.body as ChatCustomMessageBody;
          if (body.event === gCustomMessageCardEventType) {
            return (
              <MessageCustomCard
                msg={msg}
                layoutType={layoutType}
                maxWidth={contentMaxWidth}
              />
            );
          }
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
              maxWidth={contentMaxWidth}
            />
          );
        }
        default: {
          return (
            <MessageText
              msg={msg}
              layoutType={layoutType}
              isSupport={isSupport}
              maxWidth={contentMaxWidth}
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
          maxWidth: maxWidth ?? '60%',
        },
        containerStyle,
      ]}
    >
      {isShowTriangle ? (
        <View style={{ paddingBottom: 10 }}>
          <View style={{ flexGrow: 1 }} />
          <Icon
            name={
              layoutType === 'left' ? 'message_arrow_lft' : 'message_arrow_rgt'
            }
            style={{
              width: triangleWidth,
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
            paddingHorizontal: paddingHorizontal,
            paddingVertical: paddingVertical,
          },
        ]}
        onPress={_onClicked}
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
  avatar?: string;
};
export function AvatarView(props: AvatarViewProps) {
  const { isVisible = true, layoutType, avatar } = props;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? undefined : 8,
        paddingRight: layoutType === 'left' ? 8 : undefined,
      }}
    >
      <View style={{ flexGrow: 1 }} />
      <Avatar size={28} url={avatar} />
    </View>
  );
}
export type NameViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  name: string;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
export function NameView(props: NameViewProps) {
  const { isVisible = true, layoutType, name, hasAvatar, hasTriangle } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
  });
  const paddingWidth =
    hasAvatar === true
      ? hasTriangle === true
        ? 53
        : 48
      : hasTriangle === true
      ? 17
      : 12;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? paddingWidth : undefined,
        paddingRight: layoutType === 'left' ? undefined : paddingWidth,
      }}
    >
      <SingleLineText
        textType={'small'}
        paletteType={'label'}
        style={{
          color: getColor('text'),
        }}
      >
        {name}
      </SingleLineText>
    </View>
  );
}

export type TimeViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  timestamp: number;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
export function TimeView(props: TimeViewProps) {
  const {
    isVisible = true,
    layoutType,
    timestamp,
    hasAvatar,
    hasTriangle,
  } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  const time = getFormatTime(timestamp);
  const paddingWidth =
    hasAvatar === true
      ? hasTriangle === true
        ? 53
        : 48
      : hasTriangle === true
      ? 17
      : 12;
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? paddingWidth : undefined,
        paddingRight: layoutType === 'left' ? undefined : paddingWidth,
      }}
    >
      <Text
        textType={'small'}
        paletteType={'body'}
        style={{ color: getColor('text') }}
      >
        {time}
      </Text>
    </View>
  );
}

export type StateViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  state: MessageStateType;
  onClicked?: () => void;
};
export function StateView(props: StateViewProps) {
  const { isVisible = true, layoutType, state, onClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    common: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    red: {
      light: colors.error[5],
      dark: colors.error[6],
    },
    green: {
      light: colors.secondary[4],
      dark: colors.secondary[5],
    },
  });

  const isStop = React.useMemo(() => {
    return state !== 'loading-attachment' && state !== 'sending';
  }, [state]);
  const iconName = React.useMemo(() => getStateIcon(state), [state]);
  const iconColor = React.useMemo(() => getStateIconColor(state), [state]);
  return (
    <Pressable
      style={{
        display: isVisible === true ? 'flex' : 'none',
        paddingLeft: layoutType === 'left' ? 4 : undefined,
        paddingRight: layoutType === 'left' ? undefined : 4,
      }}
      onPress={onClicked}
    >
      <View style={{ flexGrow: 1 }} />
      {isStop === true ? (
        <Icon
          name={iconName}
          style={{
            height: 20,
            width: 20,
            tintColor: getColor(iconColor),
          }}
        />
      ) : (
        <LoadingIcon
          isStop={isStop}
          name={iconName}
          style={{
            width: 20,
            height: 20,
            tintColor: getColor(iconColor),
          }}
        />
      )}
    </Pressable>
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

export type MessageQuoteBubbleProps = MessageListItemActionsProps & {
  hasAvatar: boolean;
  hasTriangle: boolean;
  model: MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
};
export function MessageQuoteBubble(props: MessageQuoteBubbleProps) {
  const {
    hasAvatar,
    hasTriangle,
    model,
    containerStyle,
    maxWidth,
    onQuoteClicked,
  } = props;
  const { layoutType, msgQuote: msg, msg: originalMsg } = model;
  const { paddingHorizontal, paddingVertical } = React.useMemo(() => {
    return {
      paddingHorizontal: 12,
      paddingVertical: 8,
    };
  }, []);
  // const triangleWidth = 5;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    left_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[6],
    },
    right_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    left_name: {
      light: colors.neutralSpecial[6],
      dark: colors.neutralSpecial[7],
    },
    right_name: {
      light: colors.neutralSpecial[6],
      dark: colors.neutralSpecial[7],
    },
    left_text: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    right_text: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const marginWidth =
    hasAvatar === true
      ? hasTriangle === true
        ? 53
        : 48
      : hasTriangle === true
      ? 17
      : 12;

  const getContent = (msg?: ChatMessage) => {
    const user = userInfoFromMessage(msg);
    switch (msg?.body.type) {
      case ChatMessageType.TXT: {
        const body = msg?.body as ChatTextMessageBody;
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
              }}
            >
              {user?.userName ?? user?.userId ?? msg.from}
            </SingleLineText>
            <Text
              textType={'medium'}
              paletteType={'label'}
              numberOfLines={2}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_text' : 'right_text'
                ),
              }}
            >
              {body.content}
            </Text>
          </View>
        );
      }
      case ChatMessageType.IMAGE: {
        return (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 12 }}>
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_name' : 'right_name'
                  ),
                }}
              >
                {user?.userName ?? user?.userId ?? msg.from}
              </SingleLineText>
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name={'img'}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: getColor(
                      layoutType === 'left' ? 'left_text' : 'left_text'
                    ),
                  }}
                />
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {tr('picture')}
                </Text>
              </View>
            </View>
            <View style={{ borderRadius: 4, overflow: 'hidden' }}>
              <Image
                source={{
                  uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
                }}
                style={{ width: 36, height: 36 }}
              />
            </View>
          </View>
        );
      }
      case ChatMessageType.VOICE: {
        const body = msg?.body as ChatVoiceMessageBody;
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
              }}
            >
              {user?.userName ?? user?.userId ?? msg.from}
            </SingleLineText>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                name={'3th_frame_lft_lgt_sdy'}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: getColor(
                    layoutType === 'left' ? 'left_text' : 'left_text'
                  ),
                }}
              />
              <Text
                textType={'medium'}
                paletteType={'label'}
                numberOfLines={2}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_text' : 'right_text'
                  ),
                }}
              >
                {tr('voice')}
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {`: ${Math.floor(body.duration / 1000)}`}
                </Text>
              </Text>
            </View>
          </View>
        );
      }
      case ChatMessageType.VIDEO: {
        return (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 12 }}>
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    layoutType === 'left' ? 'left_name' : 'right_name'
                  ),
                }}
              >
                {user?.userName ?? user?.userId ?? msg.from}
              </SingleLineText>
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name={'triangle_in_rectangle'}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: getColor(
                      layoutType === 'left' ? 'left_text' : 'left_text'
                    ),
                  }}
                />
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                  }}
                >
                  {tr('video')}
                </Text>
              </View>
            </View>
            <View style={{ borderRadius: 4, overflow: 'hidden' }}>
              <Image
                source={{
                  uri: 'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
                }}
                style={{ width: 36, height: 36 }}
              />
            </View>
          </View>
        );
      }
      case ChatMessageType.FILE: {
        const body = msg?.body as ChatFileMessageBody;
        return (
          <View>
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{
                color: getColor(
                  layoutType === 'left' ? 'left_name' : 'right_name'
                ),
              }}
            >
              {user?.userName ?? user?.userId ?? msg.from}
            </SingleLineText>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                name={'doc'}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: getColor(
                    layoutType === 'left' ? 'left_text' : 'left_text'
                  ),
                }}
              />
              <Text
                textType={'medium'}
                paletteType={'label'}
                numberOfLines={2}
                style={{
                  width: '90%',
                  color: getColor(
                    layoutType === 'left' ? 'left_text' : 'right_text'
                  ),
                }}
              >
                {tr('file')}
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  numberOfLines={2}
                  style={{
                    color: getColor(
                      layoutType === 'left' ? 'left_text' : 'right_text'
                    ),
                    flexWrap: 'wrap',
                  }}
                >
                  {`: ${body.displayName}`}
                </Text>
              </Text>
            </View>
          </View>
        );
      }
      default: {
        return (
          <Text
            textType={'large'}
            paletteType={'body'}
            style={{
              color: getColor(
                layoutType === 'left' ? 'left_text' : 'right_text'
              ),
            }}
          >
            {tr('_uikit_msg_tip_not_support')}
          </Text>
        );
      }
    }
  };

  const _onClicked = (msg: ChatMessage, quoteMsg?: ChatMessage) => {
    if (onQuoteClicked) {
      const quote = msg.attributes[gMessageAttributeQuote];
      onQuoteClicked?.(quoteMsg ? quoteMsg.msgId : quote.msgID, model);
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
          maxWidth: maxWidth ?? '70%',
          marginLeft: layoutType === 'left' ? marginWidth : marginWidth,
          marginBottom: 2,
          // marginRight: layoutType === 'left' ? marginWidth : undefined,
        },
        containerStyle,
      ]}
    >
      <Pressable
        style={[
          styles.text_bubble,
          {
            backgroundColor: getColor(
              layoutType === 'left' ? 'left_bg' : 'right_bg'
            ),
            borderRadius: 4,
            paddingHorizontal: paddingHorizontal,
            paddingVertical: paddingVertical,
          },
        ]}
        onPress={() => _onClicked(originalMsg, msg)}
      >
        {getContent(msg)}
      </Pressable>
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
    onQuoteClicked,
    onAvatarClicked,
    onStateClicked,
    ...others
  } = props;
  const { layoutType } = model;
  const state = getMessageState(model.msg);
  const maxWidth = Dimensions.get('window').width * 0.6;
  const userName = model.userName ?? model.userId;
  const time = model.msg.localTime ?? model.msg.serverTime;
  const avatar = avatarIsVisible === true ? model.userAvatar : undefined;
  const bubblePadding = 12;
  const hasTriangle = true;
  const isQuote = isQuoteMessage(model.msg, model.msgQuote);

  const onClickedAvatar = React.useCallback(() => {
    onAvatarClicked?.(model.msg.msgId, model);
  }, [model, onAvatarClicked]);

  const onClickedState = React.useCallback(() => {
    onStateClicked?.(model.msg.msgId, model);
  }, [model, onStateClicked]);

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
        {nameIsVisible ? (
          <NameView
            layoutType={layoutType}
            name={userName}
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
          />
        ) : null}
        {isQuote ? (
          <MessageQuoteBubble
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
            onQuoteClicked={onQuoteClicked}
            maxWidth={maxWidth}
            model={model}
          />
        ) : null}
        <View
          style={{
            flexDirection: layoutType === 'left' ? 'row' : 'row-reverse',
            paddingHorizontal: bubblePadding,
          }}
        >
          {avatarIsVisible ? (
            <Pressable onPress={onClickedAvatar}>
              <AvatarView layoutType={layoutType} avatar={avatar} />
            </Pressable>
          ) : null}
          <MessageBubble
            model={model}
            maxWidth={maxWidth}
            hasTriangle={hasTriangle}
            {...others}
          />
          {state !== 'none' ? (
            <StateView
              layoutType={layoutType}
              state={state}
              onClicked={onClickedState}
            />
          ) : null}
        </View>
        {timeIsVisible ? (
          <TimeView
            layoutType={layoutType}
            timestamp={time}
            hasAvatar={avatarIsVisible}
            hasTriangle={hasTriangle}
          />
        ) : null}
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
  const { msg } = model;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    fg: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        alignItems: 'center',
        paddingHorizontal: 27.5,
      }}
    >
      <Text
        style={{
          flexWrap: 'wrap',
          textAlign: 'center',
          color: getColor('fg'),
        }}
      >
        {getSystemTip(msg, tr)}
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
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    fg: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  return (
    <View
      style={{
        display: isVisible === true ? 'flex' : 'none',
        alignItems: 'center',
        paddingHorizontal: 27.5,
      }}
    >
      <Text
        style={{
          flexWrap: 'wrap',
          textAlign: 'center',
          color: getColor('fg'),
        }}
      >
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
        // borderBottomColor: 'yellow',
        // borderBottomWidth: 1,
        // borderTopWidth: 1,
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
