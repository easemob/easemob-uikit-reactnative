import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { BlockButton, CmnButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { CommonSwitch } from '../../ui/Switch';
import { Text } from '../../ui/Text';
import { SimpleToast } from '../../ui/Toast';
import { Avatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { ListItem } from '../ListItem';
import { TopNavigationBar } from '../TopNavigationBar';
import { useContactInfo } from './ContactInfo.hooks';
import type { ContactInfoProps } from './types';

export function ContactInfo(props: ContactInfoProps) {
  const {
    onBack,
    hasAudioCall = false,
    hasSendMessage = true,
    hasVideoCall = false,
    containerStyle,
    enableNavigationBar,
    NavigationBar,
  } = props;
  const {
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    userId,
    userName,
    userAvatar,
    isContact,
    onSendMessage,
    onAudioCall,
    onVideoCall,
    alertRef,
    menuRef,
    toastRef,
    onRequestCloseMenu,
    onMore,
    tr,
    isSelf,
  } = useContactInfo(props);
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
      {enableNavigationBar !== false ? (
        NavigationBar ? (
          <>{NavigationBar}</>
        ) : (
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
              <Pressable
                style={{
                  width: 32,
                  height: 32,
                  display: isSelf === true ? 'none' : 'flex',
                }}
                onPress={onMore}
              >
                <Icon
                  name={'ellipsis_vertical'}
                  style={{ height: 24, width: 24 }}
                />
              </Pressable>
            }
            containerStyle={{ paddingHorizontal: 12 }}
          />
        )
      ) : null}
      <View style={{ alignItems: 'center', paddingTop: 20 }}>
        <Avatar size={100} url={userAvatar} />
        <View style={{ height: 12 }} />
        <Text
          textType={'large'}
          paletteType={'headline'}
          style={{ color: getColor('fg') }}
        >
          {userName}
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
        <Text
          textType={'small'}
          paletteType={'label'}
          style={{ color: getColor('t3') }}
        >
          {userId}
        </Text>
        {isContact === true ? (
          <>
            <View style={{ height: 20 }} />
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
                  text={tr('_uikit_info_send_msg')}
                  containerStyle={{ height: 62, width: 114 }}
                  onPress={() => {
                    onSendMessage?.(userId);
                  }}
                />
              ) : null}
              {hasAudioCall ? (
                <BlockButton
                  iconName={'phone_pick'}
                  text={tr('_uikit_info_send_audio')}
                  containerStyle={{ height: 62, width: 114 }}
                  onPress={() => {
                    onAudioCall?.(userId);
                  }}
                />
              ) : null}
              {hasVideoCall ? (
                <BlockButton
                  iconName={'video_camera'}
                  text={tr('_uikit_info_send_video')}
                  containerStyle={{ height: 62, width: 114 }}
                  onPress={() => {
                    onVideoCall?.(userId);
                  }}
                />
              ) : null}
            </View>
          </>
        ) : null}
      </View>
      {isContact === true ? (
        <>
          <View style={{ height: 20 }} />
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
                {tr('_uikit_info_not_disturb')}
              </Text>
            }
            RightIcon={
              <View>
                {doNotDisturb !== undefined ? (
                  <CommonSwitch
                    height={31}
                    width={51}
                    value={doNotDisturb}
                    onValueChange={onDoNotDisturb}
                  />
                ) : null}
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
                {tr('_uikit_info_clear_msg')}
              </Text>
            }
          />
        </>
      ) : isSelf !== true ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <CmnButton
            sizesType={'large'}
            radiusType={'small'}
            contentType={'only-text'}
            text={tr('_uikit_info_button_add_contact')}
            style={{ width: 180, height: 50 }}
          />
        </View>
      ) : null}

      <Alert ref={alertRef} />
      <BottomSheetNameMenu
        onRequestModalClose={onRequestCloseMenu}
        ref={menuRef}
      />
      <SimpleToast propsRef={toastRef} />
    </View>
  );
}
