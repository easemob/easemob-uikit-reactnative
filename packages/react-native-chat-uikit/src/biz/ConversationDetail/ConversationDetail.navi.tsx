import * as React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';

import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { Avatar, GroupAvatar, StatusAvatar, useAvatarStatus } from '../Avatar';
import { BackButton } from '../Back';
import {
  TopNavigationBar,
  TopNavigationBarElementType,
  TopNavigationBarRightList,
  TopNavigationBarRightTextList,
} from '../TopNavigationBar';
import { StatusType } from '../types';
import type {
  ConversationDetailModelType,
  ConversationSelectModeType,
} from './types';

type _ConversationDetailNavigationBarProps<LeftProps, RightProps> = {
  convId: string;
  convType: number;
  convName?: string;
  convAvatar?: string;
  type: ConversationDetailModelType;
  selectMode?: ConversationSelectModeType;
  onBack?: (data?: any) => void;
  onClickedAvatar?: () => void;
  NavigationBar?: TopNavigationBarElementType<LeftProps, RightProps>;
  doNotDisturb?: boolean;
  newThreadName?: string;
  onClickedThread?: () => void;
  onClickedVoice?: () => void;
  onClickedVideo?: () => void;
  onClickedThreadMore?: () => void;
  onCancelMultiSelected?: () => void;
  parentName?: string;
  messageTyping?: boolean;
};
export const ConversationDetailNavigationBar = <LeftProps, RightProps>(
  props: _ConversationDetailNavigationBarProps<LeftProps, RightProps>
): JSX.Element => {
  const {
    onBack,
    onClickedAvatar,
    convAvatar,
    convName,
    convId,
    convType,
    NavigationBar,
    doNotDisturb,
    type: comType,
    newThreadName,
    onClickedVoice,
    onClickedThread,
    onClickedVideo,
    onClickedThreadMore,
    selectMode = 'common',
    onCancelMultiSelected,
    parentName,
    messageTyping,
  } = props;
  const [status, setStatus] = React.useState<string>();
  const { enableThread, enableAVMeeting, enablePresence, enableTyping } =
    useConfigContext();
  // const im = useChatContext();
  const { addAvatarStatusListener, removeAvatarStatusListener } =
    useAvatarStatus();
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    t3: {
      light: colors.neutral[7],
      dark: colors.neutral[5],
    },
  });

  const getData = React.useCallback(() => {
    const ret = {
      textList: [] as string[],
      iconNameList: [] as string[],
      onClickedList: [] as (() => void)[],
      render: null as any,
    };
    do {
      if (comType === 'chat' || comType === 'search') {
        if (selectMode === 'common') {
          if (enableThread && convType === 1) {
            ret.iconNameList.push('hashtag_in_bubble_fill');
            ret.onClickedList.push(() => {
              onClickedThread?.();
            });
            ret.render = TopNavigationBarRightList;
          }
          if (enableAVMeeting) {
            ret.iconNameList.push('phone_pick');
            ret.iconNameList.push('video_camera');
            ret.onClickedList.push(() => {
              onClickedVoice?.();
            });
            ret.onClickedList.push(() => {
              onClickedVideo?.();
            });
            ret.render = TopNavigationBarRightList;
          }
        } else if (selectMode === 'multi') {
          ret.textList.push(tr('cancel'));
          ret.onClickedList.push(() => {
            onCancelMultiSelected?.();
          });
          ret.render = TopNavigationBarRightTextList;
        }
      } else if (comType === 'thread') {
        if (selectMode === 'common') {
          ret.iconNameList.push('ellipsis_vertical');
          ret.onClickedList.push(() => {
            onClickedThreadMore?.();
          });
          ret.render = TopNavigationBarRightList;
        } else if (selectMode === 'multi') {
        }
      }
    } while (false);
    return ret;
  }, [
    comType,
    convType,
    enableAVMeeting,
    enableThread,
    onCancelMultiSelected,
    onClickedThread,
    onClickedThreadMore,
    onClickedVideo,
    onClickedVoice,
    selectMode,
    tr,
  ]);

  const rightProps = React.useMemo(() => {
    const ret = getData();
    return {
      textList: ret.textList,
      iconNameList: ret.iconNameList,
      onClickedList: ret.onClickedList,
      render: ret.render,
    };
  }, [getData]);

  React.useEffect(() => {
    const listener = (params: { status: StatusType }) => {
      setStatus(params.status);
    };
    const sub = addAvatarStatusListener(listener);
    return () => {
      removeAvatarStatusListener(sub);
    };
  }, [addAvatarStatusListener, removeAvatarStatusListener]);

  if (NavigationBar) {
    // return { NavigationBar };
    return <>{NavigationBar}</>;
  }
  return (
    <TopNavigationBar
      Left={
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: Platform.select({ ios: '70%', android: '80%' }),
          }}
          onPress={selectMode === 'multi' ? null : onBack}
        >
          {selectMode !== 'multi' ? <BackButton /> : null}

          {comType === 'chat' || comType === 'search' ? (
            <Pressable
              onPress={selectMode === 'multi' ? null : onClickedAvatar}
            >
              {enablePresence === true && convType === 0 ? (
                <StatusAvatar
                  url={convAvatar}
                  size={32}
                  userId={convId}
                  onClicked={
                    selectMode === 'multi' ? undefined : onClickedAvatar
                  }
                />
              ) : convType === 0 ? (
                <Avatar url={convAvatar} size={32} />
              ) : (
                <GroupAvatar url={convAvatar} size={32} />
              )}
            </Pressable>
          ) : null}

          <Pressable
            style={{
              marginLeft: 10,
              maxWidth: Dimensions.get('window').width - 200,
            }}
            onPress={selectMode === 'multi' ? undefined : onClickedAvatar}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SingleLineText
                textType={'medium'}
                paletteType={'title'}
                style={{
                  color: getColor('text'),
                }}
              >
                {comType === 'chat' || comType === 'search'
                  ? convName ?? convId
                  : newThreadName ?? convId}
              </SingleLineText>
              {(comType === 'chat' || comType === 'search') &&
              doNotDisturb === true ? (
                <Icon
                  name={'bell_slash'}
                  style={{ height: 20, width: 20, tintColor: getColor('t3') }}
                />
              ) : null}
            </View>

            {convType === 0 ? (
              enableTyping === true && messageTyping === true ? (
                <Text
                  textType={'extraSmall'}
                  paletteType={'body'}
                  style={{ color: getColor('text_enable') }}
                >
                  {tr('_uikit_message_typing')}
                </Text>
              ) : enablePresence === true && status && status?.length > 0 ? (
                <Text
                  textType={'extraSmall'}
                  paletteType={'body'}
                  style={{ color: getColor('text_enable') }}
                >
                  {tr(status ?? '')}
                </Text>
              ) : null
            ) : convType === 1 ? (
              comType === 'thread' ? (
                <Text
                  textType={'extraSmall'}
                  paletteType={'body'}
                  style={{ color: getColor('text_enable') }}
                >
                  {`#${parentName}`}
                </Text>
              ) : null
            ) : null}
          </Pressable>
        </Pressable>
      }
      Right={rightProps.render}
      RightProps={rightProps}
    />
  );
};
