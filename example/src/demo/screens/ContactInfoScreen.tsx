import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatServiceListener,
  ContactInfo,
  ContactModel,
  useChatContext,
  useChatListener,
  useI18nContext,
} from 'react-native-chat-uikit';

import { useCallApi } from '../common/AVView';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useOnce, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { start, stop } = useOnce();
  const { tr } = useI18nContext();
  const userId = ((route.params as any)?.params as any)?.userId;
  const editedData = ((route.params as any)?.params as any)?.editedData;
  const editType = ((route.params as any)?.params as any)?.editType;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const contactRef = React.useRef<any>({} as any);
  const im = useChatContext();
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { showCall } = useCallApi({});

  const listener = React.useMemo<ChatServiceListener>(() => {
    return {
      onContactDeleted: (_userId: string): void => {
        navi.goBack();
      },
    } as ChatServiceListener;
  }, [navi]);
  useChatListener(listener);

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

  React.useEffect(() => {
    hash;
    if (from === 'EditInfo') {
      stop(() => {
        if (editType === 'contactRemark') {
          contactRef.current?.setContactRemark?.(userId, editedData);
        }
      });
    }
  }, [editType, editedData, stop, userId, hash, from]);

  return (
    <SafeAreaViewFragment>
      <ContactInfo
        ref={contactRef}
        userId={userId}
        onSendMessage={() => {
          navi.navigate({
            to: 'ConversationDetail',
            props: {
              convId: userId,
              convType: 0,
            },
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
        onClickedContactRemark={(_userId, remark) => {
          start(() => {
            navi.push({
              to: 'EditInfo',
              props: {
                backName: tr('_demo_edit_contact_remark'),
                saveName: tr('done'),
                initialData: remark,
                editType: 'contactRemark',
                maxLength: 128,
              },
            });
          });
        }}
        onSearch={(id) => {
          navi.push({
            to: 'MessageSearch',
            props: { convId: id, convType: 0 },
          });
        }}
        onRequestData={onRequestData}
        onAudioCall={onClickedVoice}
        onVideoCall={onClickedVideo}
      />
    </SafeAreaViewFragment>
  );
}
