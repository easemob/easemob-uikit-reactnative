import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Alert,
  BottomSheetNameMenu,
  Icon,
  ListItem,
  SimpleToast,
  StatusAvatar,
  Text,
  Text1Button,
  UIKIT_VERSION,
  useColors,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';

import { mineInfo } from '../utils/utils';
import { useMineInfo } from './MineInfo.hooks';
import type { MineInfoProps } from './types';

export function MineInfo(props: MineInfoProps) {
  const { containerStyle } = props;
  const {
    userId,
    userName,
    userAvatar,
    alertRef,
    menuRef,
    toastRef,
    onRequestCloseMenu,
    onClickedState,
    onClickedLogout,
    onClickedCommon,
    onClickedMessageNotification,
    onClickedPrivacy,
    userState,
    onClickedPersonInfo,
    onClickedAbout,
    enablePresence,
    onCopyId,
  } = useMineInfo(props);
  const { cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
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

  return (
    <View
      style={[
        {
          flex: 1,
          // flexGrow: 1,
          backgroundColor: getColor('bg'),
          // backgroundColor: 'red',
        },
        containerStyle,
      ]}
    >
      <View style={{ alignItems: 'center', paddingTop: 64 }}>
        <StatusAvatar
          size={100}
          url={userAvatar}
          userId={userId}
          statusContainerStyle={{
            height: 22,
            width: 22,
            borderRadius: 11,
            right: -2,
            bottom: -2,
          }}
          statusStyle={{ height: 18, width: 18, borderRadius: 9 }}
        />
        <View style={{ height: 12 }} />
        <Text
          textType={'large'}
          paletteType={'headline'}
          style={{ color: getColor('fg') }}
        >
          {userName ?? userId}
        </Text>
        <View style={{ height: 4 }} />
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 4,
          }}
          onPress={onCopyId}
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
        </Pressable>
      </View>

      <View style={{ height: 10 }} />

      {/* <View style={{ flexGrow: 1 }} /> */}

      <ScrollView style={{ flex: 1 }}>
        {enablePresence === true ? (
          <ListItem
            header={
              <View
                style={{
                  paddingHorizontal: 16,
                  height: 26,
                  justifyContent: 'center',
                }}
              >
                <Text
                  textType={'small'}
                  paletteType={'title'}
                  style={{ color: getColor('t3') }}
                >
                  {tr('_demo_info_state_set')}
                </Text>
              </View>
            }
            onClicked={onClickedState}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={mineInfo[5]!}
                  style={{ height: 28, width: 28, borderRadius: 4 }}
                />
                <View style={{ width: 8 }} />
                <Text
                  textType={'medium'}
                  paletteType={'title'}
                  style={{ color: getColor('fg') }}
                >
                  {tr('_demo_info_online_state')}
                </Text>
              </View>
            }
            RightIcon={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  style={{ color: getColor('t3') }}
                >
                  {tr(userState)}
                </Text>
                <Icon
                  name={'chevron_right'}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            }
          />
        ) : null}

        <ListItem
          onClicked={onClickedPersonInfo}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={mineInfo[3]!}
                style={{ height: 28, width: 28, borderRadius: 4 }}
              />
              <View style={{ width: 8 }} />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_info_person_info')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />

        <ListItem
          onClicked={onClickedCommon}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={mineInfo[2]!}
                style={{ height: 28, width: 28, borderRadius: 4 }}
              />
              <View style={{ width: 8 }} />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_info_common_setting')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />

        <ListItem
          onClicked={onClickedMessageNotification}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={mineInfo[0]!}
                style={{ height: 28, width: 28, borderRadius: 4 }}
              />
              <View style={{ width: 8 }} />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_info_message_notification')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />

        <ListItem
          onClicked={onClickedPrivacy}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={mineInfo[4]!}
                style={{ height: 28, width: 28, borderRadius: 4 }}
              />
              <View style={{ width: 8 }} />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_info_show_privacy')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />

        <ListItem
          onClicked={onClickedAbout}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={mineInfo[1]!}
                style={{ height: 28, width: 28, borderRadius: 4 }}
              />
              <View style={{ width: 8 }} />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('about')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('t3') }}
              >
                {`Easemob UIKit v${UIKIT_VERSION}`}
              </Text>
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />

        <ListItem
          header={
            <View
              style={{
                paddingHorizontal: 16,
                height: 26,
                justifyContent: 'center',
              }}
            >
              <Text
                textType={'small'}
                paletteType={'title'}
                style={{ color: getColor('t3') }}
              >
                {tr('login')}
              </Text>
            </View>
          }
          onClicked={onClickedState}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text1Button
                sizesType={'middle'}
                radiusType={input}
                text={tr('_demo_info_logout')}
                onPress={onClickedLogout}
              />
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }} />
          }
        />
      </ScrollView>

      <Alert ref={alertRef} />
      <BottomSheetNameMenu
        onRequestModalClose={onRequestCloseMenu}
        ref={menuRef}
      />
      <SimpleToast propsRef={toastRef} />
    </View>
  );
}
