import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Platform, View } from 'react-native';

import { Agora, AppServerClient, Easemob, UserDataManager } from '../common';
import { Alert, AlertRef, LoadingIcon, useRoomContext } from '../rename.room';
import type { RootScreenParamsList } from '../routes';
import { randomId } from '../utils/utils';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LoginScreen(props: Props) {
  const { navigation } = props;
  const appType = require('../env').accountType;
  const im = useRoomContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const alertRef = React.useRef<AlertRef>({} as any);
  const isAutoCreateUser = React.useRef(
    Platform.select({ ios: false, default: true })
  );
  const timerRef = React.useRef<NodeJS.Timeout>();
  const countRef = React.useRef(0);

  const firstLoginAction = async () => {
    console.log('dev:LoginScreen:firstLoginAction');
    try {
      const userId = randomId();
      const user = UserDataManager.createUser(userId);
      const { nickname, avatar } = user;
      const ret = await AppServerClient.getLoginTokenSync({
        userId: userId,
        nickname: nickname,
        avatar: avatar,
      });
      if (ret.isOk === true && ret.token) {
        im.login({
          userId,
          userToken: ret.token!,
          userNickname: nickname,
          userAvatarURL: avatar,
          result: (params) => {
            if (params.isOk === true) {
              UserDataManager.setCurrentUser(user, (params) => {
                if (params.user) {
                  navigation.replace('ChannelList', {});
                } else {
                  console.warn('save failed', user);
                  alertRef.current?.alert?.();
                }
              });
            } else {
              console.warn(
                'login failed',
                user,
                params.error,
                params.error?.message
              );
              alertRef.current?.alert?.();
            }
          },
        });
      } else {
        // todo: 再次尝试登录
        console.log('dev:install:1', countRef.current, user);
        ++countRef.current;
        timerRef.current = setTimeout(firstLoginAction, 1500);
      }
    } catch (error) {
      // todo: 再次尝试登录
      console.log('dev:install:2', countRef.current);
      ++countRef.current;
      timerRef.current = setTimeout(firstLoginAction, 1500);
    }
  };

  const loginAction = React.useCallback(
    (onFinished: (isOk: boolean) => void) => {
      console.log('dev:LoginScreen:loginAction');
      setIsLoading(true);
      UserDataManager.getCurrentUser(isAutoCreateUser.current, (params) => {
        if (params.user) {
          const { userId, nickname, avatar } = params.user;
          AppServerClient.getLoginToken({
            userId,
            nickname,
            avatar,
            onResult: (params) => {
              if (params.isOk) {
                im.login({
                  userId,
                  userToken: params.token!,
                  userNickname: nickname,
                  userAvatarURL: avatar,
                  result: (params) => {
                    if (params.isOk) {
                      navigation.replace('ChannelList', {});
                      onFinished(true);
                    } else {
                      console.warn(
                        'login failed',
                        params.error,
                        params.error?.message
                      );
                      try {
                        const json = JSON.parse(params.error?.message || '');
                        if (json.code === 200) {
                          onFinished(true);
                          navigation.replace('ChannelList', {});
                          return;
                        }
                      } catch (error) {
                        console.warn('im.login failed', error);
                        onFinished(false);
                        alertRef.current?.alert?.();
                        return;
                      }
                      console.warn('im.login failed', params);
                      onFinished(false);
                      alertRef.current?.alert?.();
                    }
                  },
                });
              } else {
                console.warn('getLoginToken failed', params);
                onFinished(false);
                alertRef.current?.alert?.();
              }
            },
          });
        } else {
          if (Platform.OS === 'ios') {
            // todo: 如果没有用户信息，认为是首次安装
            // todo: 如果是首次安装，iOS可能需要网络权限
            // todo: 如果没有网络权限，定期循环登录重试
            // todo: 登录成功，保存用户信息
            firstLoginAction();
          } else {
            console.warn('getCurrentUser failed', params);
            onFinished(false);
            alertRef.current?.alert?.();
          }
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [im, navigation]
  );
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('example_login', () => {
      loginAction((isOk) => {
        setIsLoading(!isOk);
      });
    });
    return () => {
      sub.remove();
    };
  }, [loginAction]);

  return (
    <View style={{ flex: 1 }}>
      {appType === 'agora' ? <Agora /> : <Easemob />}
      {isLoading === true ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 150,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <LoadingIcon name={'spinner'} style={{ height: 36, width: 36 }} />
        </View>
      ) : null}
      <Alert
        ref={alertRef}
        title={'Login failed'}
        buttons={[
          {
            text: '                 Re-login                 ',
            onPress: () => {
              alertRef.current.close?.();
              loginAction((isOk) => {
                setIsLoading(!isOk);
              });
            },
          },
        ]}
      />
    </View>
  );
}
