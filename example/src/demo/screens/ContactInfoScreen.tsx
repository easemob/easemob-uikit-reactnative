import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import {
  ChatServiceListener,
  ContactInfo,
  ContactModel,
  Icon,
  ListItem,
  ResultValue,
  SingleLineText,
  UIContactListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
  useColors,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import { useCallApi } from '../common/AVView';
import { accountType } from '../common/const';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useOnce, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { start, stop } = useOnce();
  const { tr } = useI18nContext();
  const userId = ((route.params as any)?.params as any)?.userId;
  const editedData = ((route.params as any)?.params as any)?.editedData;
  const editType = ((route.params as any)?.params as any)?.editType;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const contactRef = React.useRef<any>({} as any);
  const im = useChatContext();
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { showCall } = useCallApi({});
  const [userRemark, setUserRemark] = React.useState<string | undefined>();

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
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });

  const listener = React.useMemo<ChatServiceListener>(() => {
    return {
      onContactDeleted: (_userId: string): void => {
        navi.goBack();
      },
    } as ChatServiceListener;
  }, [navi]);
  useChatListener(listener);

  const onRequestData = React.useCallback(
    async (_id: string) => {
      const r: ContactModel = { userId: userId };
      try {
        const user = await im.getUserInfoSync({ userId: userId });
        if (user.value) {
          r.userName = user.value?.userName;
          r.userAvatar = user.value?.avatarURL;
        }
        const contact = await im.getContactSync({ userId: userId });
        if (contact.value) {
          r.remark = contact.value?.remark;
        }
      } catch (error) {}
      return r;
    },
    [im, userId]
  );

  const onClickedVideo = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'video';
      showCall({
        convId: id,
        convType: 0,
        avType: 'video',
      });
    },
    [showCall]
  );
  const onClickedVoice = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'voice';
      showCall({
        convId: id,
        convType: 0,
        avType: 'voice',
      });
    },
    [showCall]
  );

  const customItemRender = React.useCallback(
    (list: React.ReactNode[]) => {
      const item = (
        <ListItem
          key={'101'}
          onClicked={() => {
            start(() => {
              navi.push({
                to: 'EditInfo',
                props: {
                  backName: tr('_demo_edit_contact_remark'),
                  saveName: tr('done'),
                  initialData: userRemark,
                  editType: 'contactRemark',
                  maxLength: 128,
                },
              });
            });
          }}
          containerStyle={{ paddingHorizontal: 16 }}
          LeftName={
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('fg') }}
            >
              {tr('_uikit_info_item_contact_remark')}
            </SingleLineText>
          }
          RightText={
            <SingleLineText
              textType={'large'}
              paletteType={'label'}
              style={{ color: getColor('t1'), maxWidth: 100 }}
            >
              {userRemark}
            </SingleLineText>
          }
          RightIcon={
            <View>
              <Icon
                name={'chevron_right'}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: getColor('icon'),
                }}
              />
            </View>
          }
        />
      );
      list.splice(1, 0, item);

      return list;
    },
    [getColor, navi, start, tr, userRemark]
  );

  React.useEffect(() => {
    hash;
    if (from === 'EditInfo') {
      stop(() => {
        if (editType === 'contactRemark') {
          contactRef.current?.setContactRemark?.(userId, editedData);
        }
      });
    }
  }, [editType, editedData, stop, userId, hash, from]);

  React.useEffect(() => {
    if (accountType === 'agora') {
      return;
    }
    im.getContactSync({ userId: userId })
      .then((res: ResultValue<ContactModel | undefined>) => {
        if (res.value) {
          setUserRemark(res.value.remark);
        }
      })
      .catch();
  }, [im, userId]);

  React.useEffect(() => {
    if (accountType === 'agora') {
      return;
    }
    const listener: UIContactListListener = {
      onUpdatedEvent: (data) => {
        if (data.userId === userId) {
          setUserRemark(data.remark);
        }
      },
      type: UIListenerType.Contact,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [im, userId]);

  return (
    <SafeAreaViewFragment>
      <ContactInfo
        ref={contactRef}
        userId={userId}
        onSendMessage={() => {
          navi.navigate({
            to: 'ConversationDetail',
            props: {
              convId: userId,
              convType: 0,
            },
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
        onClickedContactRemark={(_userId, remark) => {
          if (accountType === 'agora') {
            return;
          }
          start(() => {
            navi.push({
              to: 'EditInfo',
              props: {
                backName: tr('_demo_edit_contact_remark'),
                saveName: tr('done'),
                initialData: remark,
                editType: 'contactRemark',
                maxLength: 128,
              },
            });
          });
        }}
        onSearch={(id) => {
          navi.push({
            to: 'MessageSearch',
            props: { convId: id, convType: 0 },
          });
        }}
        onRequestData={onRequestData}
        onAudioCall={onClickedVoice}
        onVideoCall={onClickedVideo}
        customItemRender={
          accountType === 'agora' ? undefined : customItemRender
        }
      />
    </SafeAreaViewFragment>
  );
}
