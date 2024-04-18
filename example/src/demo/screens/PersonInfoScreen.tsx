// import { default as ImageEditor } from '@react-native-community/image-editor';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  Icon,
  ListItem,
  SingleLineText,
  StatusAvatar,
  Text,
  TopNavigationBar,
  TopNavigationBarLeft,
  useChatContext,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RestApi } from '../common/rest.api';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function PersonInfoScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t1: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    right: {
      light: colors.neutral[3],
      dark: colors.neutral[5],
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
          console.log('dev:updateSelfInfo:', res);
        },
      });
    }
  };
  const testRef = React.useRef<(data: any) => void>(goBack);

  const onBack = () => {
    navi.goBack();
  };

  const updateAvatar = async (path: string, filetype?: string) => {
    const user = im.user(im.userId);
    if (user) {
      const ret = await RestApi.requestUploadAvatar({
        userId: user.userId,
        localAvatarFile: path,
        fileType: filetype,
      });
      if (ret.isOk && ret.value?.avatarUrl) {
        const old = im.user(im.userId);
        im.updateSelfInfo({
          self: {
            ...old,
            userId: user.userId,
            avatarURL: ret.value.avatarUrl,
          },
          onResult: (res) => {
            console.warn('dev:cropImage:res', res);
          },
        });
      }
    }
    //   Services.ms.deleteCustomDir(getFileDirectory(res.path));
  };

  const onClickedAvatar2 = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
      cropping: true,
    }).then((image) => {
      updateAvatar(image.path, image.mime);
    });
  };

  const onClickedRemark = () => {
    navi.push({
      to: 'EditInfo',
      props: {
        backName: tr('_demo_person_edit_person_remark'),
        saveName: tr('done'),
        initialData: _remark,
        maxLength: 128,
        testRef,
      },
    });
  };

  React.useEffect(() => {
    const self = im.user(im.userId);
    if (self) {
      if (self.userName) setRemark(self.userName);
      if (self.avatarURL) setAvatar(self.avatarURL);
    }
  }, [im]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <TopNavigationBar
        containerStyle={{ backgroundColor: undefined }}
        Left={
          <TopNavigationBarLeft
            onBack={onBack}
            content={tr('_demo_person_info_navi_title')}
          />
        }
        Right={<View />}
      />

      <ListItem
        onClicked={onClickedAvatar2}
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
            <StatusAvatar
              size={40}
              disableStatus={true}
              userId={im.userId}
              url={_avatar}
            />
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
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
            <Icon
              name={'chevron_right'}
              style={{ height: 20, width: 20, tintColor: getColor('right') }}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}
