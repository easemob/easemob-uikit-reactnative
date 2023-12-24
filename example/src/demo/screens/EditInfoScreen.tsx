import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { EditInfo } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function EditInfoScreen(props: Props) {
  const { navigation, route } = props;
  const backName = ((route.params as any)?.params as any)?.backName;
  const saveName = ((route.params as any)?.params as any)?.saveName;
  const initialData = ((route.params as any)?.params as any)?.initialData;
  const maxLength = ((route.params as any)?.params as any)?.maxLength;
  const goBack = ((route.params as any)?.params as any)?.goBack;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <EditInfo
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        backName={backName}
        saveName={saveName}
        initialData={initialData}
        maxLength={maxLength}
        onBack={() => {
          navigation.goBack();
        }}
        onSave={(data) => {
          // todo: go back with params.
          // navigation.setParams({});
          goBack?.(data);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
