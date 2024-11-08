import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';

import {
  useAlertContext,
  useChatContext,
  useI18nContext,
} from '../../rename.uikit';
import { demoType } from '../common/const';
import { useLogin, useNativeStackRoute, useServerConfig } from '../hooks';
import type { RootScreenParamsList } from '../routes';
import { MineInfo } from '../ui/MineInfo';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function ConfigScreen(props: Props) {
  const {} = props;
  const navi = useNativeStackRoute();
  const {} = navi;
  const im = useChatContext();
  const { tr } = useI18nContext();
  const [userId, setUserId] = React.useState<string>('test');
  const { getFcmToken } = useLogin();
  const { getAlertRef } = useAlertContext();
  const { getEnableDevMode } = useServerConfig();

  React.useEffect(() => {
    if (im.userId) {
      setUserId(im.userId);
    }
  }, [im.userId]);

  if (userId) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MineInfo
          userId={userId}
          enableAccount={false}
          onClickedLogout={() => {
            getAlertRef()?.alertWithInit({
              title: tr('_demo_logout_title'),
              buttons: [
                {
                  text: tr('cancel'),
                  isPreferred: false,
                  onPress: () => {
                    getAlertRef()?.close();
                  },
                },
                {
                  text: tr('confirm'),
                  isPreferred: true,
                  onPress: () => {
                    getAlertRef()?.close(() => {
                      im.logout({
                        unbindDeviceToken: getFcmToken() !== undefined,
                        result: async () => {
                          if (demoType === 1) {
                            navi.replace({ to: 'TopMenu' });
                          } else if (demoType === 2) {
                            navi.replace({ to: 'LoginList' });
                          } else {
                            const ret = await getEnableDevMode();
                            navi.replace({
                              to: 'Login',
                              props: { serverConfigVisible: ret },
                            });
                          }
                        },
                      });
                    });
                  },
                },
              ],
            });
          }}
          onClickedCommon={() => {
            navi.push({ to: 'CommonSetting' });
          }}
          onClickedPersonInfo={() => {
            navi.push({ to: 'PersonInfo' });
          }}
          onClickedAbout={() => {
            navi.push({ to: 'AboutSetting' });
          }}
          onClickedMessageNotification={() => {
            navi.push({ to: 'NotificationSetting' });
          }}
          onClickedPrivacy={() => {
            navi.push({ to: 'PrivacySetting' });
          }}
          // onDestroyAccount={() => {
          //   navi.replace({ to: 'Login' });
          // }}
        />
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}
