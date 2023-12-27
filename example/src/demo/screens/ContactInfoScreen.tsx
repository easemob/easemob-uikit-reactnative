import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatServiceListener,
  ContactInfo,
  useChatListener,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { navigation, route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  const listener = React.useMemo<ChatServiceListener>(() => {
    return {
      onContactDeleted: (userId: string): void => {
        console.log(`onContactDeleted: ${userId}`);
        navigation.goBack();
      },
    } as ChatServiceListener;
  }, [navigation]);
  useChatListener(listener);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactInfo
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
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
