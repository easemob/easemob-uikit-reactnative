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
import { useOnce, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { start, stop } = useOnce();
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const groupInfoRef = React.useRef<GroupInfoRef>({} as any);
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const editedData = ((route.params as any)?.params as any)?.editedData;
  const editType = ((route.params as any)?.params as any)?.editType;
  const selectedMembers = ((route.params as any)?.params as any)
    ?.selectedMembers as GroupParticipantModel[] | undefined;
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { showCall } = useCallApi({});
  const getSelectedMembers = React.useCallback(() => {
    return selectedMembers;
  }, [selectedMembers]);

  const onClickedVideo = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'video';
      start(() => {
        navi.navigate({
          to: 'AVSelectGroupParticipant',
          props: {
            groupId: id,
            ownerId: ownerId,
          },
        });
      });
    },
    [navi, ownerId, start]
  );
  const onClickedVoice = React.useCallback(
    (id: string) => {
      avTypeRef.current = 'voice';
      start(() => {
        navi.navigate({
          to: 'AVSelectGroupParticipant',
          props: {
            groupId: id,
            ownerId: ownerId,
          },
        });
      });
    },
    [navi, ownerId, start]
  );

  React.useEffect(() => {
    hash;
    if (from === 'AVSelectGroupParticipant') {
      stop(() => {
        showCall({
          convId: groupId,
          convType: 1,
          avType: avTypeRef.current,
          getSelectedMembers: getSelectedMembers,
        });
      });
    } else if (from === 'EditInfo') {
      stop(() => {
        if (editType === 'groupName') {
          groupInfoRef.current?.setGroupName?.(groupId, editedData);
        } else if (editType === 'groupDescription') {
          groupInfoRef.current?.setGroupDescription?.(groupId, editedData);
        } else if (editType === 'groupMyRemark') {
          groupInfoRef.current?.setGroupMyRemark?.(groupId, editedData);
        }
      });
    }
  }, [
    from,
    showCall,
    getSelectedMembers,
    selectedMembers,
    editType,
    editedData,
    hash,
    stop,
    groupId,
  ]);

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
        }}
        groupId={groupId}
        ownerId={ownerId}
        onParticipant={(groupId) => {
          navi.push({
            to: 'GroupParticipantList',
            props: {
              groupId,
            },
          });
        }}
        onClickedChangeGroupOwner={() => {
          navi.push({
            to: 'ChangeGroupOwner',
            props: {
              groupId,
            },
          });
        }}
        onSendMessage={() => {
          navi.navigate({
            to: 'ConversationDetail',
            props: {
              convId: groupId,
              convType: 1,
            },
          });
        }}
        onGroupName={(_groupId, groupName) => {
          start(() => {
            navi.push({
              to: 'EditInfo',
              props: {
                backName: tr('edit_group_name'),
                saveName: tr('save'),
                initialData: groupName,
                editType: 'groupName',
                maxLength: 128,
                groupInfoRef,
              },
            });
          });
        }}
        onGroupDescription={(_groupId, groupDescription) => {
          start(() => {
            navi.push({
              to: 'EditInfo',
              props: {
                backName: tr('edit_group_description'),
                saveName: tr('save'),
                initialData: groupDescription,
                editType: 'groupDescription',
                maxLength: 512,
                groupInfoRef,
              },
            });
          });
        }}
        onGroupMyRemark={(_groupId, groupMyRemark) => {
          start(() => {
            navi.push({
              to: 'EditInfo',
              props: {
                backName: tr('edit_group_my_remark'),
                saveName: tr('save'),
                initialData: groupMyRemark,
                editType: 'groupMyRemark',
                maxLength: 128,
                groupInfoRef,
              },
            });
          });
        }}
        onBack={() => {
          navi.goBack();
        }}
        onGroupDestroy={() => {
          navi.goBack();
        }}
        onGroupKicked={() => {
          navi.goBack();
        }}
        onGroupQuit={() => {
          navi.goBack();
        }}
        onSearch={(id) => {
          navi.push({
            to: 'MessageSearch',
            props: {
              convId: id,
              convType: 1,
            },
          });
        }}
        onAudioCall={onClickedVoice}
        onVideoCall={onClickedVideo}
      />
    </SafeAreaView>
  );
}
