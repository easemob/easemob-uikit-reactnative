import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatServiceListener,
  ContactInfo,
  useChatListener,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      />
    </SafeAreaView>
  );
}
