import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Alert, AlertRef } from '../../ui/Alert';
import { BlockButton, CmnButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { CommonSwitch } from '../../ui/Switch';
import { Text } from '../../ui/Text';
import { SimpleToast } from '../../ui/Toast';
import { Avatar } from '../Avatar';
import { ListItem } from '../ListItem';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupParticipantInfo } from './GroupParticipantInfo.hooks';
import type { GroupParticipantInfoProps } from './types';

export function GroupParticipantInfo(props: GroupParticipantInfoProps) {
  const {
    onBack,
    onMore,
    hasAudioCall = false,
    hasSendMessage = true,
    hasVideoCall = false,
    onClearChat,
    containerStyle,
    isContact = false,
  } = props;
  const {
    doNotDisturb,
    onDoNotDisturb,
    userId,
    userName,
    userAvatar,
    onCopyId,
    toastRef,
    onRemark,
  } = useGroupParticipantInfo(props);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    t3: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });
  const alertRef = React.useRef<AlertRef>({} as any);

  return (
    <View
      style={[
        {
          flexGrow: 1,
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
          >
            <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
          </Pressable>
        }
        Right={
          <Pressable style={{ width: 32, height: 32 }} onPress={onMore}>
            <Icon
              name={'ellipsis_vertical'}
              style={{ height: 24, width: 24 }}
            />
          </Pressable>
        }
        containerStyle={{ paddingHorizontal: 12 }}
      />
      <View style={{ alignItems: 'center', paddingTop: 20 }}>
        <Avatar size={100} url={userAvatar} />
        <View style={{ height: 12 }} />
        <Text
          textType={'large'}
          paletteType={'headline'}
          style={{ color: getColor('fg') }}
        >
          {userName ?? userId}
        </Text>
        <View style={{ height: 4 }} />
        {/* <Text
          textType={'medium'}
          paletteType={'label'}
          style={{ color: getColor('t2') }}
        >
          {'Sign'}
        </Text>
        <View style={{ height: 4 }} /> */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onTouchEnd={onCopyId}
        >
          <Text
            textType={'small'}
            paletteType={'label'}
            style={{ color: getColor('t3') }}
          >
            {userId}
          </Text>
          <Icon
            name={'doc_on_doc'}
            style={{ width: 16, height: 16, tintColor: getColor('t3') }}
          />
        </View>
        <View style={{ height: 20 }} />
        {isContact === true ? (
          <CmnButton
            sizesType={'large'}
            radiusType={'small'}
            contentType={'only-text'}
            text={tr('Add Contact')}
          />
        ) : (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            {hasSendMessage ? (
              <BlockButton
                iconName={'bubble_fill'}
                text={tr('send message')}
                containerStyle={{ height: 62, width: 114 }}
              />
            ) : null}
            {hasAudioCall ? (
              <BlockButton
                iconName={'phone_pick'}
                text={tr('audio call')}
                containerStyle={{ height: 62, width: 114 }}
              />
            ) : null}
            {hasVideoCall ? (
              <BlockButton
                iconName={'video_camera'}
                text={tr('video call')}
                containerStyle={{ height: 62, width: 114 }}
              />
            ) : null}
          </View>
        )}
      </View>
      {isContact === true ? null : (
        <>
          <ListItem
            onClicked={onRemark}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('remark')}
              </Text>
            }
            RightIcon={
              <View>
                <Icon
                  name={'chevron_right'}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            }
          />
          <View
            style={{
              height: 12,
              width: '100%',
              backgroundColor: getColor('bg2'),
            }}
          />
          <ListItem
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('message no disturb')}
              </Text>
            }
            RightIcon={
              <View>
                <CommonSwitch
                  height={31}
                  width={51}
                  value={doNotDisturb}
                  onValueChange={onDoNotDisturb}
                />
              </View>
            }
          />
          <ListItem
            onClicked={onClearChat}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('clear message')}
              </Text>
            }
          />
        </>
      )}

      <Alert ref={alertRef} />
      <SimpleToast propsRef={toastRef} />
    </View>
  );
}
