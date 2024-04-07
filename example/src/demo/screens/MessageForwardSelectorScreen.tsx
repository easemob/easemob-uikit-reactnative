import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  ContactModel,
  MessageForwardSelector,
  MessageForwardSelectorRef,
  seqId,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageForwardSelectorScreen(props: Props) {
  const { route, navigation } = props;
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  const msgs = ((route.params as any)?.params as any)?.msgs;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const from = ((route.params as any)?.params as any)?.from;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const ref = React.useRef<MessageForwardSelectorRef>({} as any);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('forwardMessage', (data) => {
      const d = data as ContactModel;
      ref.current?.forwardMessage(d);
    });
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <MessageForwardSelector
        propsRef={ref}
        onBack={() => {
          if (from === 'ConversationDetail') {
            navigation.navigate({
              name: 'ConversationDetail',
              params: {
                params: {
                  convId: convId,
                  convType: convType,
                  selectType: 'common',
                  from: 'MessageForwardSelector',
                  hash: seqId('_random'),
                },
              },
              merge: true,
            });
          } else if (from === 'MessageThreadDetail') {
            navigation.navigate({
              name: 'MessageThreadDetail',
              params: {
                params: {
                  convId: convId,
                  convType: convType,
                  selectType: 'common',
                  from: 'MessageForwardSelector',
                  hash: seqId('_random'),
                },
              },
              merge: true,
            });
          }
        }}
        onClickedSearch={(data) => {
          navigation.navigate('SearchContact', {
            params: { searchType: data, msgs, convId, convType },
          });
        }}
        selectedMsgs={msgs}
        selectedData={data}
      />
    </SafeAreaView>
  );
}
