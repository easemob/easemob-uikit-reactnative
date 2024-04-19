import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  ContactModel,
  MessageForwardSelector,
  MessageForwardSelectorRef,
} from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageForwardSelectorScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  const msgs = ((route.params as any)?.params as any)?.msgs;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
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
    <SafeAreaViewFragment>
      <MessageForwardSelector
        propsRef={ref}
        onBack={() => {
          navi.goBack({
            props: {
              selectType: 'common',
            },
          });
        }}
        onClickedSearch={(data) => {
          navi.navigate({
            to: 'SearchContact',
            props: { searchType: data, msgs, convId, convType },
          });
        }}
        selectedMsgs={msgs}
        selectedData={data}
      />
    </SafeAreaViewFragment>
  );
}
