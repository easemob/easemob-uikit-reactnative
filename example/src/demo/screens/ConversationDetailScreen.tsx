import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ConversationDetail,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { navigation, route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convName = ((route.params as any)?.params as any)?.convName;
  const selected = ((route.params as any)?.params as any)?.selected;
  const getSelected = () => {
    if (selected) {
      try {
        const p = JSON.parse(selected);
        return [p];
      } catch {}
    }
    return undefined;
  };
  const { top, bottom } = useSafeAreaInsets();
  console.log('test:zuoyu:ConversationDetailScreen');
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ConversationDetail
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        convId={convId}
        convType={convType}
        convName={convName}
        input={{
          props: {
            top,
            bottom,
            onInputMention: (groupId: string) => {
              // todo : select group member.
              console.log('test:zuoyu:SelectSingleParticipant:', groupId);
              navigation.push('SelectSingleParticipant', {
                params: {
                  groupId,
                },
              });
            },
          },
        }}
        list={{
          props: {
            onClickedItem: (
              id: string,
              model: SystemMessageModel | TimeMessageModel | MessageModel
            ) => {
              console.log('onClickedItem', id, model);
              navigation.push('ImageMessagePreview', {
                params: {
                  msgId: id,
                },
              });
            },
          },
        }}
        onBack={() => {
          // todo: maybe need update
          navigation.goBack();
        }}
        selectedParticipant={getSelected()}
      />
    </SafeAreaView>
  );
}
