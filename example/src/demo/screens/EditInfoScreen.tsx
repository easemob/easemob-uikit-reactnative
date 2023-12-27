import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  EditInfo,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
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
  // const testRef = ((route.params as any)?.params as any)?.testRef;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
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
          // navigation.setParams({ params: { data } });
          // testRef.current = data;
          // navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
