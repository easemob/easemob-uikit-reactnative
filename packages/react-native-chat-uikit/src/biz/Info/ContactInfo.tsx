import * as React from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useColors } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { CmnButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { CommonSwitch } from '../../ui/Switch';
import { SingleLineText, Text } from '../../ui/Text';
import { SimpleToast } from '../../ui/Toast';
import { StatusAvatar } from '../Avatar';
import { BackButton } from '../Back';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { ListItem } from '../ListItem';
import { TopNavigationBar } from '../TopNavigationBar';
import { BlockButtons } from './BlockButtons';
import { useContactInfo } from './ContactInfo.hooks';
import type { ContactInfoProps, ContactInfoRef } from './types';

/**
 * Contact Info Component.
 *
 * If it is a contact, the send button is displayed, if it is not a contact, the add contact button is displayed. If it is the current user, there are no operation options.
 */
export const ContactInfo = React.forwardRef<ContactInfoRef, ContactInfoProps>(
  function (props: ContactInfoProps, ref?: React.ForwardedRef<ContactInfoRef>) {
    const {
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
      doNotDisturb,
      onDoNotDisturb,
      blockUser,
      onBlockUser,
      onClearChat,
      userId,
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
      onAddContact,
      onCopyId,
      onClickedRemark,
      getNickName,
      onSearch,
      hasAudioCall,
      userRemark,
      enableBlock,
    } = useContactInfo(props, ref);
    const { cornerRadius } = useThemeContext();
    const { input } = cornerRadius;
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

    const customListItem = React.useCallback(() => {
      const items = [] as React.ReactNode[];
      if (isContact === true) {
        items.push(<View key={'100'} style={{ height: 20 }} />);
        items.push(
          <ListItem
            key={'101'}
            onClicked={onClickedRemark}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_contact_remark')}
              </Text>
            }
            RightText={
              <SingleLineText
                textType={'large'}
                paletteType={'label'}
                style={{ color: getColor('t1'), maxWidth: 100 }}
              >
                {userRemark}
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
        items.push(
          <View
            key={'102'}
            style={{
              height: 12,
              width: '100%',
              backgroundColor: getColor('bg2'),
            }}
          />
        );
        items.push(
          <ListItem
            key={'103'}
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
        );
        if (enableBlock === true) {
          items.push(
            <ListItem
              key={'104'}
              containerStyle={{ paddingHorizontal: 16 }}
              LeftName={
                <Text
                  textType={'medium'}
                  paletteType={'title'}
                  style={{ color: getColor('fg') }}
                >
                  {tr('_uikit_info_block_list')}
                </Text>
              }
              RightIcon={
                <View>
                  {blockUser !== undefined ? (
                    <CommonSwitch
                      height={31}
                      width={51}
                      value={blockUser}
                      onValueChange={onBlockUser}
                    />
                  ) : null}
                </View>
              }
            />
          );
        }
        items.push(
          <ListItem
            key={'105'}
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
        );
      } else if (isSelf !== true) {
        items.push(
          <View key={'100'} style={{ alignItems: 'center', marginTop: 20 }}>
            <CmnButton
              sizesType={'large'}
              radiusType={input}
              contentType={'only-text'}
              text={tr('_uikit_info_button_add_contact')}
              style={{ width: 180, height: 50 }}
              onPress={onAddContact}
            />
          </View>
        );
      }
      return (
        <ScrollView style={{ flex: 1 }}>
          {customItemRender ? customItemRender(items) : items}
        </ScrollView>
      );
    }, [
      blockUser,
      customItemRender,
      doNotDisturb,
      enableBlock,
      getColor,
      input,
      isContact,
      isSelf,
      onAddContact,
      onBlockUser,
      onClearChat,
      onClickedRemark,
      onDoNotDisturb,
      tr,
      userRemark,
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
                    display:
                      isSelf === true || isContact === false ? 'none' : 'flex',
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
        <View style={{ alignItems: 'center', paddingTop: 20 }}>
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
              style={{
                color: getColor('fg'),
              }}
            >
              {getNickName()}
            </Text>
            {doNotDisturb === true ? (
              <Icon
                name={'bell_slash'}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: getColor('t3'),
                }}
              />
            ) : null}
          </View>

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
              {tr('_uikit_info_item_contact_id')}
              <SingleLineText
                textType={'small'}
                paletteType={'label'}
                style={{ color: getColor('t3') }}
              >
                {userId}
              </SingleLineText>
            </SingleLineText>
            <Icon
              name={'doc_on_doc'}
              style={{ width: 16, height: 16, tintColor: getColor('t3') }}
            />
          </Pressable>

          {isContact === true ? (
            <>
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
            </>
          ) : null}
        </View>

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
