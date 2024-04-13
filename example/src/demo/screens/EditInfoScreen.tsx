import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  EditInfo,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function EditInfoScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const backName = ((route.params as any)?.params as any)?.backName;
  const saveName = ((route.params as any)?.params as any)?.saveName;
  const initialData = ((route.params as any)?.params as any)?.initialData;
  const maxLength = ((route.params as any)?.params as any)?.maxLength;
  // const goBack = ((route.params as any)?.params as any)?.goBack;
  const testRef = ((route.params as any)?.params as any)
    ?.testRef as React.MutableRefObject<(data: any) => void>;
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
        }}
        backName={backName}
        saveName={saveName}
        initialData={initialData}
        maxLength={maxLength}
        onBack={() => {
          navi.goBack();
        }}
        onSave={(data) => {
          testRef.current?.(data);
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
