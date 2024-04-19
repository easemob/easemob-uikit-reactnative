import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ShareContact,
  useAlertContext,
  useDataPriority,
  useI18nContext,
} from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ShareContactScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { tr } = useI18nContext();
  const { getConvInfo } = useDataPriority({});
  const { getAlertRef } = useAlertContext();
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  return (
    <SafeAreaViewFragment>
      <ShareContact
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
    </SafeAreaViewFragment>
  );
}
