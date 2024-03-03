import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { ChatMessage } from 'react-native-chat-sdk';

import {
  ContactModel,
  createForwardMessage,
  getMessageSnapshot,
  getMessageSnapshotParams,
  GroupModel,
  useChatContext,
} from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { TabPage, TabPageHeader } from '../../ui/TabPage';
import { Text } from '../../ui/Text';
import { ContactList, ContactListProps } from '../ContactList';
import { GroupList, GroupListProps } from '../GroupList';
import { TopNavigationBar } from '../TopNavigationBar';
import type {
  PropsWithBack,
  PropsWithNavigationBar,
  PropsWithRef,
} from '../types';

export type SelectContactListProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClickedSearch' | 'selectedData'
> & {
  index: number;
  currentIndex: number;
  selectedMsgs?: ChatMessage[];
};
export function SelectContactList(props: SelectContactListProps) {
  return <ContactList contactType={'forward-message'} {...props} />;
}

export type SelectGroupListProps = Pick<GroupListProps, 'containerStyle'> & {
  index: number;
  currentIndex: number;
  selectedMsgs?: ChatMessage[];
};

export function SelectGroupList(props: SelectGroupListProps) {
  return (
    <GroupList
      groupType={'forward-message'}
      navigationBarVisible={false}
      {...props}
    />
  );
}

export type MessageForwardSelectorRef = {
  forwardMessage: (data: ContactModel | GroupModel) => void;
};

export type MessageForwardSelectorProps = PropsWithNavigationBar &
  PropsWithBack &
  PropsWithRef<MessageForwardSelectorRef> & {
    onClickedSearch?: (data?: any) => void;
    selectedData?: ContactModel[];
    selectedMsgs?: ChatMessage[];
    propsRef?: React.MutableRefObject<MessageForwardSelectorRef>;
  };
export function MessageForwardSelector(props: MessageForwardSelectorProps) {
  const {
    propsRef,
    navigationBarVisible,
    customNavigationBar,
    onBack,
    onClickedSearch,
    selectedData,
    selectedMsgs,
  } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const im = useChatContext();

  const onForwardMessage = React.useCallback(
    (data: ContactModel | GroupModel) => {
      let convId;
      let convType = 0;
      if ((data as any)?.userId) {
        convId = (data as ContactModel).userId;
        convType = 0;
      } else if ((data as any)?.groupId) {
        convId = (data as GroupModel).groupId;
        convType = 1;
      }
      if (convId) {
        if (selectedMsgs) {
          const newMsg = createForwardMessage({
            msgs: selectedMsgs,
            targetId: convId,
            targetType: convType,
            getSummary: (msgs) => {
              const list = [] as string[];
              for (const msg of msgs) {
                list.push(
                  tr(getMessageSnapshot(msg), getMessageSnapshotParams(msg))
                );
              }
              return list.join('\n');
            },
          });
          if (newMsg) {
            im.messageManager.sendMessage(newMsg);
          }
        }
      }
    },
    [im.messageManager, selectedMsgs, tr]
  );

  if (propsRef?.current) {
    propsRef.current.forwardMessage = onForwardMessage;
  }

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={onBack}
              >
                <Icon
                  name={'chevron_left'}
                  style={{ width: 24, height: 24, tintColor: getColor('icon') }}
                />
                <Text
                  paletteType={'title'}
                  textType={'medium'}
                  style={{ color: getColor('text') }}
                >
                  {tr('_uikit_forward_to')}
                </Text>
              </Pressable>
            }
            Right={<View style={{ width: 32, height: 32 }} />}
          />
        )
      ) : null}
      <TabPage
        header={{
          Header: TabPageHeader,
          HeaderProps: {
            titles: [
              {
                title: tr('_uikit_tab_contact_list'),
              },
              {
                title: tr('_uikit_tab_group_list'),
              },
            ],
          } as any,
        }}
        body={{
          type: 'TabPageBodyLIST',
          BodyProps: {
            RenderChildren: [SelectContactList, SelectGroupList],
            RenderChildrenProps: {
              index: 0,
              currentIndex: 0,
              onClickedSearch: onClickedSearch,
              selectedData: selectedData,
              selectedMsgs: selectedMsgs,
              onForwardMessage: onForwardMessage,
            } as any,
          },
        }}
        headerPosition="up"
        initIndex={0}
        height={height ? height - 44 : undefined}
      />
    </View>
  );
}
