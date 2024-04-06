import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  GroupInfo,
  GroupInfoRef,
  GroupParticipantModel,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCallApi } from '../common/AVView';
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
  const from = ((route.params as any)?.params as any)?.from;
  const hash = ((route.params as any)?.params as any)?.hash;
  const selectedMembers = ((route.params as any)?.params as any)
    ?.selectedMembers as GroupParticipantModel[] | undefined;
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { showCall } = useCallApi({});

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
  const testRef = React.useRef<(data: any) => void>(goBack);
  const getSelectedMembers = React.useCallback(() => {
    return selectedMembers;
  }, [selectedMembers]);

  const onClickedVideo = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'video';
      navigation.navigate('AVSelectGroupParticipant', {
        params: {
          groupId: id,
          ownerId: ownerId,
          from: 'GroupInfo',
        },
      });
    },
    [navigation, ownerId]
  );
  const onClickedVoice = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'voice';
      navigation.navigate('AVSelectGroupParticipant', {
        params: {
          groupId: id,
          ownerId: ownerId,
          from: 'GroupInfo',
        },
      });
    },
    [navigation, ownerId]
  );

  React.useEffect(() => {
    if (from === 'AVSelectGroupParticipant') {
      if (hash) {
        showCall({
          convId: groupId,
          convType: 1,
          avType: avTypeRef.current,
          getSelectedMembers: getSelectedMembers,
        });
      }
    }
  }, [from, hash, showCall, getSelectedMembers, groupId]);

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
              from: 'GroupInfo',
              hash: Date.now(),
            },
          });
        }}
        onGroupName={(_groupId, groupName) => {
          editTypeRef.current = 'groupName';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_name'),
              saveName: tr('save'),
              initialData: groupName,
              maxLength: 128,
              // goBack: goBack,
              groupInfoRef,
              testRef,
              from: 'GroupInfo',
              hash: Date.now(),
            },
          });
        }}
        onGroupDescription={(_groupId, groupDescription) => {
          editTypeRef.current = 'groupDescription';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_description'),
              saveName: tr('save'),
              initialData: groupDescription,
              maxLength: 512,
              // goBack: goBack,
              groupInfoRef,
              testRef,
              from: 'GroupInfo',
              hash: Date.now(),
            },
          });
        }}
        onGroupMyRemark={(_groupId, groupMyRemark) => {
          editTypeRef.current = 'groupMyRemark';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_my_remark'),
              saveName: tr('save'),
              initialData: groupMyRemark,
              maxLength: 128,
              // goBack: goBack,
              groupInfoRef,
              testRef,
              from: 'GroupInfo',
              hash: Date.now(),
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
        onGroupDestroy={() => {
          navigation.goBack();
        }}
        onGroupKicked={() => {
          navigation.goBack();
        }}
        onGroupQuit={() => {
          navigation.goBack();
        }}
        onSearch={(id) => {
          navigation.push('MessageSearch', {
            params: { convId: id, convType: 1 },
          });
        }}
        onAudioCall={onClickedVoice}
        onVideoCall={onClickedVideo}
      />
    </SafeAreaView>
  );
}
