import * as React from 'react';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { Icon } from '../../ui/Image';
import { CommonSwitch } from '../../ui/Switch';
import { SingleLineText } from '../../ui/Text';
import { SimpleToast } from '../../ui/Toast';
import { GroupAvatar } from '../Avatar';
import { BackButton } from '../Back';
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
      // hasAudioCall = false,
      hasSendMessage = true,
      // hasVideoCall = false,
      containerStyle,
      navigationBarVisible,
      customNavigationBar,
      onInitButton,
      customItemRender,
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
      onSearch,
      hasAudioCall,
    } = useGroupInfo(props, ref);
    const { colors } = usePaletteContext();
    const { getColor } = useColors({
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
    });

    const customListItem = React.useCallback(() => {
      const items = [] as React.ReactNode[];
      items.push(
        <View key={'100'} style={{ alignItems: 'center', paddingTop: 20 }}>
          <GroupAvatar size={100} url={groupAvatar} />
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 12,
              alignItems: 'center',
            }}
          >
            <SingleLineText
              textType={'large'}
              paletteType={'headline'}
              style={{ color: getColor('fg') }}
            >
              {groupName ?? groupId}
            </SingleLineText>
            {doNotDisturb === true ? (
              <Icon
                name={'bell_slash'}
                style={{ height: 20, width: 20, tintColor: getColor('t3') }}
              />
            ) : null}
          </View>

          {groupDescription ? (
            <SingleLineText
              textType={'medium'}
              paletteType={'body'}
              style={{ color: getColor('t2'), paddingTop: 4 }}
            >
              {groupDescription ?? 'test description'}
            </SingleLineText>
          ) : null}

          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 4,
            }}
            onPress={onCopyId}
          >
            <SingleLineText
              textType={'small'}
              paletteType={'label'}
              style={{ color: getColor('t3') }}
            >
              {tr('_uikit_info_item_group_id')}
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{ color: getColor('t3') }}
              >
                {`${groupId}`}
              </SingleLineText>
            </SingleLineText>
            <Icon
              name={'doc_on_doc'}
              style={{ width: 16, height: 16, tintColor: getColor('t3') }}
            />
          </Pressable>

          <View style={{ height: 20 }} />
          <View
            style={{
              marginHorizontal: 12,
              width: Dimensions.get('window').width - 24,
            }}
          >
            <BlockButtons
              hasAudioCall={hasAudioCall}
              hasSendMessage={hasSendMessage}
              hasVideoCall={hasAudioCall}
              onSendMessage={onSendMessage}
              onAudioCall={onAudioCall}
              onVideoCall={onVideoCall}
              onInitButton={onInitButton}
              onSearch={onSearch}
              itemCount={4}
            />
          </View>
        </View>
      );
      items.push(<View key={'101'} style={{ height: 20 }} />);
      items.push(
        <ListItem
          key={'102'}
          onClicked={onParticipant}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_uikit_info_item_member')}
            </SingleLineText>
          }
          RightText={
            <SingleLineText
              textType={'large'}
              paletteType={'label'}
              style={{ color: getColor('t1') }}
            >
              {groupMemberCount}
            </SingleLineText>
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
      );
      items.push(
        <View
          key={'103'}
          style={{
            height: 12,
            width: '100%',
            backgroundColor: getColor('bg2'),
          }}
        />
      );
      items.push(
        <ListItem
          key={'104'}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_uikit_info_not_disturb')}
            </SingleLineText>
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
      );
      items.push(
        <ListItem
          key={'105'}
          onClicked={onClearChat}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_uikit_info_clear_msg')}
            </SingleLineText>
          }
        />
      );
      if (isOwner === true) {
        items.push(
          <View
            key={'106'}
            style={{
              height: 12,
              width: '100%',
              backgroundColor: getColor('bg2'),
            }}
          />
        );
        items.push(
          <ListItem
            key={'107'}
            onClicked={onGroupName}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <SingleLineText
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_group_name')}
              </SingleLineText>
            }
            RightIcon={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SingleLineText
                  textType={'large'}
                  paletteType={'body'}
                  style={{ color: getColor('t1'), maxWidth: 150 }}
                >
                  {groupName}
                </SingleLineText>
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
              </View>
            }
          />
        );
        items.push(
          <ListItem
            key={'108'}
            onClicked={onGroupDescription}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <SingleLineText
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_group_desc')}
              </SingleLineText>
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
        );
      }

      return (
        <ScrollView style={{ flex: 1 }}>
          {customItemRender ? customItemRender(items) : items}
        </ScrollView>
      );
    }, [
      customItemRender,
      doNotDisturb,
      getColor,
      groupAvatar,
      groupDescription,
      groupId,
      groupMemberCount,
      groupName,
      hasAudioCall,
      hasSendMessage,
      isOwner,
      onAudioCall,
      onClearChat,
      onCopyId,
      onDoNotDisturb,
      onGroupDescription,
      onGroupName,
      onInitButton,
      onParticipant,
      onSearch,
      onSendMessage,
      onVideoCall,
      tr,
    ]);

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
                  <BackButton />
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

        {customListItem()}

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
