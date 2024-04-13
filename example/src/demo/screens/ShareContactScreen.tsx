import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ShareContact,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ShareContactScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convName = ((route.params as any)?.params as any)?.convName;
  const from = ((route.params as any)?.params as any)?.__from;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ShareContact
        containerStyle={{
          flexGrow: 1,
        }}
        onClickedSearch={() => {
          navi.navigate({
            to: 'SearchContact',
            props: {
              searchType: 'share-contact',
              convId,
              convType,
              convName,
            },
          });
        }}
        onClickedItem={(data) => {
          navi.navigate({
            to: from,
            props: {
              convId,
              convType,
              convName,
              selectedContacts: data,
              operateType: 'share_card',
            },
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
