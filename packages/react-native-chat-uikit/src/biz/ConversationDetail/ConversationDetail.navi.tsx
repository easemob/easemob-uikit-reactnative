import * as React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import {
  TopNavigationBar,
  TopNavigationBarElementType,
  TopNavigationBarRightList,
  TopNavigationBarRightText,
} from '../TopNavigationBar';
import type {
  ConversationDetailModelType,
  ConversationSelectModeType,
} from './types';

type _ConversationDetailNavigationBarProps<LeftProps, RightProps> = {
  convId: string;
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

  const getRight = (): any => {
    if (comType === 'chat') {
      if (selectMode === 'common') {
        return TopNavigationBarRightList;
      } else {
        return TopNavigationBarRightText;
      }
    } else if (comType === 'thread') {
      if (selectMode === 'common') {
        return TopNavigationBarRightList;
      } else {
        return TopNavigationBarRightText;
      }
    } else {
      return null;
    }
  };

  const getRightProps = (): any => {
    if (comType === 'chat') {
      if (selectMode === 'common') {
        return {
          onClickedList: [
            () => {
              onClickedThread?.();
            },
            () => {
              onClickedVoice?.();
            },
            () => {
              onClickedVideo?.();
            },
          ],
          iconNameList: [
            'hashtag_in_bubble_fill',
            'phone_pick',
            'video_camera',
          ],
        };
      } else {
        return {
          onClicked: () => {
            onCancelMultiSelected?.();
          },
          text: tr('cancel'),
        };
      }
    } else if (comType === 'thread') {
      if (selectMode === 'common') {
        return {
          onClickedList: [
            () => {
              onClickedThreadMore?.();
            },
          ],
          iconNameList: ['ellipsis_vertical'],
        };
      } else {
        return {
          onClicked: () => {
            onCancelMultiSelected?.();
          },
          text: tr('cancel'),
        };
      }
    } else {
      return {};
    }
  };

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
          {comType === 'chat' ? (
            <Pressable onPress={onClickedAvatar}>
              <Avatar url={convAvatar} size={32} />
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
                {comType === 'chat'
                  ? convName ?? convId
                  : newThreadName ?? convId}
              </SingleLineText>
              {comType === 'chat' && doNotDisturb === true ? (
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
              {comType === 'chat' ? tr('state') : tr('#group')}
            </Text>
          </View>
        </View>
      }
      Right={getRight()}
      RightProps={getRightProps()}
    />
  );
};
