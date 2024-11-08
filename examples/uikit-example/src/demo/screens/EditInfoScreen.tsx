import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { EditInfo } from '../../rename.uikit';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
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
  const editType = ((route.params as any)?.params as any)?.editType;
  return (
    <SafeAreaViewFragment>
      <EditInfo
        backName={backName}
        saveName={saveName}
        initialData={initialData}
        maxLength={maxLength}
        onBack={() => {
          navi.goBack();
        }}
        onSave={(data) => {
          // testRef.current?.(data);
          navi.goBack({
            props: {
              editedData: data,
              editType,
            },
          });
        }}
      />
    </SafeAreaViewFragment>
  );
}
