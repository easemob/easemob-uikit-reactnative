import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatServiceListener,
  GroupInfo,
  GroupInfoRef,
  UIGroupListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { navigation, route } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const editTypeRef = React.useRef<string>();
  const groupInfoRef = React.useRef<GroupInfoRef>({} as any);
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;
  const testRef = React.useRef<string>();
  const im = useChatContext();
  // const goBack2 = React.useCallback(
  //   (data: any) => {
  //     groupInfoRef.current?.setGroupName?.(groupId, data);
  //   },
  //   [groupId]
  // );

  // React.useEffect(() => {
  // }, [testRef.current]);

  const goBack = (data: any) => {
    // !!! warning: react navigation
    if (editTypeRef.current === 'groupName') {
      groupInfoRef.current?.setGroupName?.(groupId, data);
    } else if (editTypeRef.current === 'groupDescription') {
      groupInfoRef.current?.setGroupDescription?.(groupId, data);
    } else if (editTypeRef.current === 'groupMyRemark') {
      groupInfoRef.current?.setGroupMyRemark?.(groupId, data);
    }
  };

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onDeletedEvent: (data) => {
        if (data.groupId === groupId) {
          navigation.goBack();
        }
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [groupId, im, navigation, ownerId]);

  const listener = React.useRef<ChatServiceListener>({
    onDestroyed: (params: { groupId: string }) => {
      if (params.groupId === groupId) {
        navigation.goBack();
      }
    },
    onOwnerChanged: (params: {
      groupId: string;
      newOwner: string;
      oldOwner: string;
    }) => {
      if (params.groupId === groupId) {
        navigation.goBack();
      }
    },
  });
  useChatListener(listener.current);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <GroupInfo
        ref={groupInfoRef}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        ownerId={ownerId}
        onParticipant={(groupId) => {
          navigation.push('GroupParticipantList', { params: { groupId } });
        }}
        // onGroupDestroy={() => {
        //   navigation.goBack();
        // }}
        onGroupQuit={() => {
          navigation.goBack();
        }}
        onClickedChangeGroupOwner={() => {
          navigation.push('ChangeGroupOwner', { params: { groupId } });
        }}
        onSendMessage={() => {
          navigation.navigate('ConversationDetail', {
            params: {
              convId: groupId,
              convType: 1,
              convName: groupId,
              testRef,
            },
          });
        }}
        onGroupName={(_groupId, groupName) => {
          editTypeRef.current = 'groupName';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_name'),
              saveName: 'Save',
              initialData: groupName,
              maxLength: 128,
              goBack: goBack,
              testRef,
            },
          });
        }}
        onGroupDescription={(_groupId, groupDescription) => {
          editTypeRef.current = 'groupDescription';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_description'),
              saveName: 'Save',
              initialData: groupDescription,
              maxLength: 128,
              goBack: goBack,
            },
          });
        }}
        onGroupMyRemark={(_groupId, groupMyRemark) => {
          editTypeRef.current = 'groupMyRemark';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_my_remark'),
              saveName: 'Save',
              initialData: groupMyRemark,
              maxLength: 128,
              goBack: goBack,
              testRef,
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
