import { default as ImageEditor } from '@react-native-community/image-editor';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  getFileDirectory,
  Icon,
  ListItem,
  Services,
  SingleLineText,
  StatusAvatar,
  Text,
  timeoutTask,
  TopNavigationBar,
  useChatContext,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RestApi } from '../common/rest.api';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function PersonInfoScreen(props: Props) {
  const { navigation } = props;
  // todo: save to user info.
  //   const remark = ((route.params as any)?.params as any)?.remark;
  //   const avatar = ((route.params as any)?.params as any)?.avatar;
  //   const from = ((route.params as any)?.params as any)?.from;
  //   const hash = ((route.params as any)?.params as any)?.hash;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const [_remark, setRemark] = React.useState('');
  const [_avatar, setAvatar] = React.useState<string | undefined>(undefined);
  const im = useChatContext();

  const goBack = (data: any) => {
    // !!! warning: react navigation
    setRemark(data);
    const ret = im.user(im.userId);
    if (ret) {
      im.updateSelfInfo({
        self: { ...ret, userName: data },
        onResult: (res) => {
          console.log('test:zuoyu:res:', res);
        },
      });
    }
  };
  const testRef = React.useRef<(data: any) => void>(goBack);

  const onBack = () => {
    navigation.goBack();
  };
  const onClickedAvatar = () => {
    timeoutTask(100, async () => {
      const ret = await Services.ps.requestMediaLibraryPermission();
      if (ret === false) {
        return;
      }
      Services.ms
        .openMediaLibrary({ selectionLimit: 1, mediaType: 'photo' })
        .then((result) => {
          if (result === undefined || result === null || result.length === 0) {
            return;
          }

          let width = result[0]!.width ?? 100;
          let height = result[0]!.height ?? 100;

          const w = Math.min(width, height);
          const h = Math.min(width, height);

          ImageEditor.cropImage(result[0]!.uri, {
            size: { width: w, height: h },
            resizeMode: 'cover',
          })
            .then(async (res) => {
              console.log(
                'test:zuoyu:cropImage:res',
                res,
                getFileDirectory(res.path)
              );

              // todo: upload to server
              // todo: update user info
              const user = im.user(im.userId);
              if (user) {
                const ret = await RestApi.reqUploadAvatar({
                  userId: user.userId,
                  localAvatarFile: res.path,
                });
                if (ret.isOk && ret.value?.avatarUrl) {
                  im.updateSelfInfo({
                    self: {
                      userId: user.userId,
                      userName: user.userName,
                      avatarURL: ret.value?.avatarUrl,
                    },
                    onResult: (res) => {
                      console.warn('test:zuoyu:cropImage:res', res);
                    },
                  });
                }
              }

              //   Services.ms.deleteCustomDir(getFileDirectory(res.path));
            })
            .catch((e) => {
              console.warn('test:zuoyu:cropImage:error', e);
            });
        })
        .catch((error) => {
          console.warn('error:', error);
        });
    });
  };
  const onClickedRemark = () => {
    navigation.push('EditInfo', {
      params: {
        backName: tr('_demo_person_edit_person_remark'),
        saveName: tr('save'),
        initialData: _remark,
        maxLength: 128,
        testRef,
        from: 'PersonInfo',
        hash: Date.now(),
      },
    });
  };

  React.useEffect(() => {
    const self = im.user(im.userId);
    console.log('test:zuoyu:self:', self);
    if (self) {
      if (self.userName) setRemark(self.userName);
      if (self.avatarURL) setAvatar(self.avatarURL);
    }
  }, [im]);

  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          // backgroundColor: getColor('bg'),
          flex: 1,
        }}
      >
        <TopNavigationBar
          containerStyle={{ backgroundColor: undefined }}
          Left={
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 44,
              }}
              onPress={onBack}
            >
              <Icon
                name={'chevron_left'}
                style={{ width: 24, height: 24, tintColor: getColor('icon') }}
              />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{
                  color: getColor('t1'),
                }}
              >
                {tr('_demo_person_info_navi_title')}
              </Text>
            </Pressable>
          }
          Right={<View />}
        />

        <ListItem
          onClicked={onClickedAvatar}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_person_info_avatar')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <StatusAvatar size={40} disableStatus={true} url={_avatar} />
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />

        <ListItem
          onClicked={onClickedRemark}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_demo_person_info_remark')}
              </Text>
            </View>
          }
          RightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SingleLineText
                paletteType={'label'}
                textType={'large'}
                style={{
                  color: getColor('t1'),
                }}
              >
                {_remark}
              </SingleLineText>
              <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
