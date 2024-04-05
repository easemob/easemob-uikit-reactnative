import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatServiceListener,
  ContactInfo,
  ContactModel,
  useChatContext,
  useChatListener,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCallApi } from '../common/AVView';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { navigation, route } = props;
  const { tr } = useI18nContext();
  const userId = ((route.params as any)?.params as any)?.userId;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const contactRef = React.useRef<any>({} as any);
  const im = useChatContext();
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { showCall } = useCallApi({});

  const listener = React.useMemo<ChatServiceListener>(() => {
    return {
      onContactDeleted: (userId: string): void => {
        console.log(`onContactDeleted: ${userId}`);
        navigation.goBack();
      },
    } as ChatServiceListener;
  }, [navigation]);
  useChatListener(listener);

  const goback = (data: string) => {
    if (data) {
      contactRef.current?.setContactRemark?.(userId, data);
    }
  };
  const testRef = React.useRef<(data: any) => void>(goback);

  const onRequestData = React.useCallback(
    async (_id: string) => {
      const r: ContactModel = { userId: userId };
      try {
        const user = await im.getUserInfoSync({ userId: userId });
        if (user.value) {
          r.userName = user.value?.userName;
          r.userAvatar = user.value?.avatarURL;
        }
        const contact = await im.getContactSync({ userId: userId });
        if (contact.value) {
          r.remark = contact.value?.remark;
        }
      } catch (error) {}
      return r;
    },
    [im, userId]
  );

  const onClickedVideo = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'video';
      showCall({
        convId: id,
        convType: 0,
        avType: 'video',
      });
    },
    [showCall]
  );
  const onClickedVoice = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'voice';
      showCall({
        convId: id,
        convType: 0,
        avType: 'voice',
      });
    },
    [showCall]
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactInfo
        ref={contactRef}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        userId={userId}
        onSendMessage={() => {
          navigation.navigate('ConversationDetail', {
            params: {
              convId: userId,
              convType: 0,
              convName: userId,
              from: 'ContactInfo',
              hash: Date.now(),
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
        onClickedContactRemark={(userId, remark) => {
          console.log(`onClickedContactRemark: ${userId}, ${remark}`);
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_contact_remark'),
              saveName: tr('save'),
              initialData: remark,
              maxLength: 128,
              from: 'ContactInfo',
              hash: Date.now(),
              testRef,
            },
          });
        }}
        onSearch={(id) => {
          navigation.push('MessageSearch', {
            params: { convId: id, convType: 0 },
          });
        }}
        onRequestData={onRequestData}
        onAudioCall={onClickedVoice}
        onVideoCall={onClickedVideo}
      />
    </SafeAreaView>
  );
}
