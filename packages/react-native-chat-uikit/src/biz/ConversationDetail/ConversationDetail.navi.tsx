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
} from '../TopNavigationBar';
import type { ConversationDetailModelType } from './types';

type _ConversationDetailNavigationBarProps<LeftProps, RightProps> = {
  convId: string;
  convName?: string;
  convAvatar?: string;
  type: ConversationDetailModelType;
  onBack?: (data?: any) => void;
  onClickedAvatar?: () => void;
  NavigationBar?: TopNavigationBarElementType<LeftProps, RightProps>;
  doNotDisturb?: boolean;
  newThreadName?: string;
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
      Right={
        comType === 'chat' || comType === 'thread'
          ? TopNavigationBarRightList
          : null
      }
      RightProps={{
        onClickedList:
          comType === 'chat'
            ? [
                () => {
                  // todo: click thread for open.
                },
                () => {
                  // todo: click phone_pick
                },
                () => {
                  // todo: click video_camera
                },
              ]
            : comType === 'thread'
            ? [
                () => {
                  // todo: show thread bottom sheet menu.
                },
              ]
            : [],
        iconNameList: [
          // 'hashtag_in_bubble_fill',
          // 'phone_pick',
          // 'video_camera'
        ],
      }}
    />
  );
};
