import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { Icon } from '../../ui/Image';
import { CommonSwitch } from '../../ui/Switch';
import { Text } from '../../ui/Text';
import { SimpleToast } from '../../ui/Toast';
import { GroupAvatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { ListItem } from '../ListItem';
import { TopNavigationBar } from '../TopNavigationBar';
import { BlockButtons } from './BlockButtons';
import { useGroupInfo } from './GroupInfo.hooks';
import type { GroupInfoProps, GroupInfoRef } from './types';

/**
 * Group Info Component.
 *
 * If you are a group administrator, you have more operating rights. If you are an ordinary member, you have no group management rights.
 */
export const GroupInfo = React.forwardRef<GroupInfoRef, GroupInfoProps>(
  function (props: GroupInfoProps, ref?: React.ForwardedRef<GroupInfoRef>) {
    const {
      groupId,
      onBack,
      hasAudioCall = false,
      hasSendMessage = true,
      hasVideoCall = false,
      containerStyle,
      navigationBarVisible,
      customNavigationBar,
      onInitButton,
    } = props;
    const {
      groupName,
      groupAvatar,
      groupDescription,
      alertRef,
      toastRef,
      onClearChat,
      doNotDisturb,
      onDoNotDisturb,
      onGroupName,
      onGroupDescription,
      // onGroupMyRemark,
      onCopyId,
      onParticipant,
      menuRef,
      onRequestCloseMenu,
      onMore,
      groupMemberCount,
      onSendMessage,
      onVideoCall,
      onAudioCall,
      isOwner,
      tr,
    } = useGroupInfo(props, ref);
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
      t1: {
        light: colors.neutral[5],
        dark: colors.neutral[6],
      },
      t2: {
        light: colors.neutral[3],
        dark: colors.neutral[95],
      },
      t3: {
        light: colors.neutral[7],
        dark: colors.neutral[6],
      },
      icon: {
        light: colors.neutral[3],
        dark: colors.neutral[95],
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
        {navigationBarVisible !== false ? (
          customNavigationBar ? (
            <>{customNavigationBar}</>
          ) : (
            <TopNavigationBar
              Left={
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 40,
                    width: 40,
                  }}
                  onPress={onBack}
                >
                  <Icon
                    name={'chevron_left'}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: getColor('icon'),
                    }}
                  />
                </Pressable>
              }
              Right={
                <Pressable
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={onMore}
                >
                  <Icon
                    name={'ellipsis_vertical'}
                    style={{ height: 24, width: 24 }}
                  />
                </Pressable>
              }
            />
          )
        ) : null}
        <ScrollView style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <GroupAvatar size={100} url={groupAvatar} />
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 12,
                alignItems: 'center',
              }}
            >
              <Text
                textType={'large'}
                paletteType={'headline'}
                style={{ color: getColor('fg') }}
              >
                {groupName ?? groupId}
              </Text>
              {doNotDisturb === true ? (
                <Icon
                  name={'bell_slash'}
                  style={{ height: 20, width: 20, tintColor: getColor('t3') }}
                />
              ) : null}
            </View>

            {groupDescription ? (
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('t2'), paddingTop: 4 }}
              >
                {groupDescription ?? 'test description'}
              </Text>
            ) : null}

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
                {tr('_uikit_info_item_group_id')}
                <Text
                  textType={'small'}
                  paletteType={'label'}
                  style={{ color: getColor('t3') }}
                >
                  {`${groupId}`}
                </Text>
              </Text>
              <Icon
                name={'doc_on_doc'}
                style={{ width: 16, height: 16, tintColor: getColor('t3') }}
              />
            </Pressable>

            <View style={{ height: 20 }} />
            <BlockButtons
              hasAudioCall={hasAudioCall}
              hasSendMessage={hasSendMessage}
              hasVideoCall={hasVideoCall}
              onSendMessage={onSendMessage}
              onAudioCall={onAudioCall}
              onVideoCall={onVideoCall}
              onInitButton={onInitButton}
            />
          </View>
          <View style={{ height: 20 }} />
          <ListItem
            onClicked={onParticipant}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_member')}
              </Text>
            }
            RightText={
              <Text
                textType={'large'}
                paletteType={'label'}
                style={{ color: getColor('t1') }}
              >
                {groupMemberCount}
              </Text>
            }
            RightIcon={
              <View>
                <Icon
                  name={'chevron_right'}
                  style={{ height: 20, width: 20, tintColor: getColor('icon') }}
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
          {/* <ListItem
            onClicked={onGroupMyRemark}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_my_remark')}
              </Text>
            }
            RightIcon={
              <View>
                <Icon
                  name={'chevron_right'}
                  style={{ height: 20, width: 20, tintColor: getColor('icon') }}
                />
              </View>
            }
          /> */}
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

          {isOwner === true ? (
            <>
              <View
                style={{
                  height: 12,
                  width: '100%',
                  backgroundColor: getColor('bg2'),
                }}
              />
              <ListItem
                onClicked={onGroupName}
                containerStyle={{ paddingHorizontal: 16 }}
                LeftName={
                  <Text
                    textType={'medium'}
                    paletteType={'title'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr('_uikit_info_item_group_name')}
                  </Text>
                }
                RightIcon={
                  <View>
                    <Icon
                      name={'chevron_right'}
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: getColor('icon'),
                      }}
                    />
                  </View>
                }
              />
              <ListItem
                onClicked={onGroupDescription}
                containerStyle={{ paddingHorizontal: 16 }}
                LeftName={
                  <Text
                    textType={'medium'}
                    paletteType={'title'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr('_uikit_info_item_group_desc')}
                  </Text>
                }
                RightIcon={
                  <View>
                    <Icon
                      name={'chevron_right'}
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: getColor('icon'),
                      }}
                    />
                  </View>
                }
              />
            </>
          ) : null}
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
);
