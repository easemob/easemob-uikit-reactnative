import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ShareContact,
  useAlertContext,
  useColors,
  useDataPriority,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ShareContactScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { tr } = useI18nContext();
  const { getConvInfo } = useDataPriority({});
  const { getAlertRef } = useAlertContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
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
            },
          });
        }}
        onClickedItem={(data) => {
          const conv = getConvInfo(convId, convType);
          getAlertRef().alertWithInit({
            title: tr('_demo_alert_title_share_contact_title'),
            message: tr(
              '_demo_alert_title_share_contact_message',
              data?.userName,
              conv.remark ?? conv.name
            ),
            buttons: [
              {
                text: tr('cancel'),
                onPress: () => {
                  getAlertRef().close();
                },
              },
              {
                text: tr('confirm'),
                isPreferred: true,
                onPress: () => {
                  getAlertRef().close();
                  navi.goBack({
                    props: {
                      selectedContacts: data,
                    },
                  });
                },
              },
            ],
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
