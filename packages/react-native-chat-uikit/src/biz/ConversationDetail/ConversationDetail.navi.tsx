import * as React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';

import {
  ChatServiceListener,
  // useChatContext,
  useChatListener,
} from '../../chat';
import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { Avatar, StatusAvatar } from '../Avatar';
import {
  TopNavigationBar,
  TopNavigationBarElementType,
  TopNavigationBarRightList,
  TopNavigationBarRightTextList,
} from '../TopNavigationBar';
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
  } = props;
  const [status, setStatus] = React.useState<string>();
  const { enableThread, enableAVMeeting } = useConfigContext();
  // const im = useChatContext();
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
      light: colors.primary[5],
      dark: colors.primary[6],
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
          ret.iconNameList.push('ellipsis');
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

  const listener = React.useMemo(() => {
    return {
      onPresenceStatusChanged: (list) => {
        if (list.length > 0) {
          const user = list.find((u) => {
            return u.publisher === convId;
          });
          if (user) {
            setStatus(user.statusDescription);
          }
        }
      },
    } as ChatServiceListener;
  }, [convId]);
  useChatListener(listener);

  // React.useEffect(() => {
  //   if (convId && convType === 0) {
  //     im.subPresence({ userIds: [convId] });
  //     im.fetchPresence({
  //       userIds: [convId],
  //       onResult: (res) => {
  //         if (res.isOk === true) {
  //           const user = res.value?.find((u) => {
  //             return u.publisher === convId;
  //           });
  //           if (user) {
  //             setStatus(user.statusDescription);
  //           }
  //         }
  //       },
  //     });
  //   }
  //   return () => {
  //     if (convId && convType === 0) {
  //       im.unSubPresence({ userIds: [convId] });
  //     }
  //   };
  // }, [convId, convType, im]);

  if (NavigationBar) {
    // return { NavigationBar };
    return <>{NavigationBar}</>;
  }
  return (
    <TopNavigationBar
      Left={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: Platform.select({ ios: '70%', android: '80%' }),
          }}
        >
          <IconButton
            iconName={'chevron_left'}
            style={{ width: 24, height: 24, tintColor: getColor('icon') }}
            onPress={onBack}
          />
          {comType === 'chat' || comType === 'search' ? (
            <Pressable onPress={onClickedAvatar}>
              {convType === 0 ? (
                <StatusAvatar
                  url={convAvatar}
                  size={32}
                  userId={convId}
                  onClicked={onClickedAvatar}
                />
              ) : (
                <Avatar url={convAvatar} size={32} />
              )}
            </Pressable>
          ) : null}

          <View
            style={{
              marginLeft: 10,
              maxWidth: Dimensions.get('window').width - 200,
            }}
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

            <Text
              textType={'extraSmall'}
              paletteType={'label'}
              style={{ color: getColor('text_enable') }}
            >
              {comType === 'chat' || comType === 'search'
                ? tr(status ?? '')
                : tr('#group')}
            </Text>
          </View>
        </View>
      }
      Right={rightProps.render}
      RightProps={rightProps}
    />
  );
};
