import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';

import {
  CallError,
  CallListener,
  CallType,
  CallUser,
  formatElapsed,
  MultiCall,
  SingleCall,
  useCallkitSdkContext,
} from '../../rename.callkit';
import {
  GroupParticipantModel,
  useAbsoluteViewContext,
  useChatContext,
  useSimpleToastContext,
} from '../../rename.uikit';
import { agoraAppId, appKey } from './const';

export type AVViewProps = {};
export function AVView(props: AVViewProps) {
  const {} = props;
  useCallApiListener();
  return <></>;
}

export function useCallApi(props: AVViewProps) {
  const {} = props;
  const im = useChatContext();
  const { getAbsoluteViewRef } = useAbsoluteViewContext();
  const { getSimpleToastRef } = useSimpleToastContext();

  const sendTip = React.useCallback((type: string, extra?: any) => {
    DeviceEventEmitter.emit('onSignallingMessage', {
      type: type,
      extra: extra,
    });
  }, []);

  const hideCall = React.useCallback(() => {
    getAbsoluteViewRef().destroy();
  }, [getAbsoluteViewRef]);
  const showSingleCall = React.useCallback(
    (params: {
      appKey: string;
      agoraAppId: string;
      inviterId: string;
      currentId: string;
      inviteeIds: string[];
      callType: CallType;
      inviterName?: string;
      inviterAvatar?: string;
      invitees?: CallUser[];
      onRequestClose: () => void;
    }) => {
      const {
        inviteeIds,
        currentId,
        inviterId,
        callType,
        invitees,
        inviterAvatar,
        inviterName,
        onRequestClose,
      } = params;
      getAbsoluteViewRef().showWithProps({
        children: (
          <SingleCall
            inviterId={inviterId}
            inviterName={inviterName}
            inviterAvatar={inviterAvatar}
            currentId={currentId}
            inviteeId={inviteeIds[0] ?? ''}
            inviteeName={invitees?.[0]?.userName}
            inviteeAvatar={invitees?.[0]?.userAvatarUrl}
            callType={callType === CallType.Audio1v1 ? 'audio' : 'video'}
            onClose={(elapsed, reason) => {
              console.log('test:stateEvent.onClose', elapsed, reason);
              onRequestClose();
              getSimpleToastRef().show({
                message: reason
                  ? `reason: ${JSON.stringify(reason)}`
                  : `Call End: ${formatElapsed(elapsed)}`,
              });
              sendTip('callEnd', elapsed);
            }}
            onHangUp={() => {
              console.log('test:stateEvent.onHangUp');
              onRequestClose();
              sendTip('callHangUp');
            }}
            onCancel={() => {
              console.log('test:stateEvent.onCancel');
              onRequestClose();
              sendTip('callCancel');
            }}
            onRefuse={() => {
              console.log('test:stateEvent.onRefuse');
              onRequestClose();
              sendTip('callRefuse');
            }}
            onError={(error) => {
              console.log('test:stateEvent.onError', error);
              onRequestClose();
              getSimpleToastRef().show({
                message: `error: ${JSON.stringify(error)}`,
              });
            }}
          />
        ),
      });
    },
    [getAbsoluteViewRef, getSimpleToastRef, sendTip]
  );
  const showMultiCall = React.useCallback(
    (params: {
      appKey: string;
      agoraAppId: string;
      inviterId: string;
      currentId: string;
      inviteeIds: string[];
      callType: CallType;
      inviterName?: string;
      inviterAvatar?: string;
      invitees?: CallUser[];
      onRequestClose: () => void;
      groupAvatar?: string;
    }) => {
      const {
        inviteeIds,
        inviterId,
        invitees,
        inviterAvatar,
        inviterName,
        currentId,
        callType,
        onRequestClose,
        groupAvatar,
      } = params;
      getAbsoluteViewRef().showWithProps({
        children: (
          <MultiCall
            inviterId={inviterId}
            inviterName={inviterName}
            inviterAvatar={inviterAvatar}
            currentId={currentId}
            callType={callType === CallType.AudioMulti ? 'audio' : 'video'}
            inviteeIds={inviteeIds}
            // inviteeList={{ InviteeList: ContactList }}
            invitees={invitees}
            groupAvatar={groupAvatar}
            onClose={(elapsed, reason) => {
              console.log('test:stateEvent.onClose', elapsed, reason);
              onRequestClose();
              getSimpleToastRef().show({
                message: reason
                  ? `reason: ${JSON.stringify(reason)}`
                  : `Call End: ${formatElapsed(elapsed)}`,
              });
              sendTip('callEnd', elapsed);
            }}
            onHangUp={() => {
              console.log('test:stateEvent.onHangUp');
              onRequestClose();
              sendTip('callHangUp');
            }}
            onCancel={() => {
              console.log('test:stateEvent.onCancel');
              onRequestClose();
              sendTip('callCancel');
            }}
            onRefuse={() => {
              console.log('test:stateEvent.onRefuse');
              onRequestClose();
              sendTip('callRefuse');
            }}
            onError={(error) => {
              console.log('test:stateEvent.onError', error);
              onRequestClose();
              getSimpleToastRef().show({
                message: `error: ${JSON.stringify(error)}`,
              });
            }}
          />
        ),
      });
    },
    [getAbsoluteViewRef, getSimpleToastRef, sendTip]
  );

  const showCall = React.useCallback(
    async (params: {
      convId: string;
      convType: number;
      avType: 'video' | 'voice';
      getSelectedMembers?: () => GroupParticipantModel[] | undefined;
    }) => {
      const { convId, avType, convType, getSelectedMembers } = params;
      let members: GroupParticipantModel[] = [];
      let groupAvatar: string | undefined;
      try {
        if (convType === 0) {
          members.push({
            memberId: convId,
          });
        } else if (convType === 1) {
          members = getSelectedMembers?.() ?? [];
          members = members.filter((item) => item.memberId !== im.userId);
          const ret = await im.getGroupInfoSync({ groupId: convId });
          if (ret.isOk && ret.value) {
            groupAvatar = ret.value.groupAvatar;
          }
        }
      } catch (error) {
        console.warn('test:showCall:parse selectedMembers error', error);
      }

      const callType =
        avType === 'video'
          ? convType === 0
            ? CallType.Video1v1
            : CallType.VideoMulti
          : avType === 'voice'
          ? convType === 0
            ? CallType.Audio1v1
            : CallType.AudioMulti
          : undefined;

      if (callType === undefined) {
        return;
      }
      if (im.userId === undefined) {
        return;
      }
      if (members.length === 0) {
        return;
      }
      const inviteeIds = members.map((item) => item.memberId);
      if (callType === CallType.Audio1v1 || callType === CallType.Video1v1) {
        showSingleCall({
          appKey: appKey,
          agoraAppId: agoraAppId,
          inviterId: im.userId,
          currentId: im.userId,
          inviteeIds: inviteeIds,
          callType: callType,
          // inviterName: '',
          // inviterAvatar: '',
          onRequestClose: hideCall,
        });
      } else if (
        callType === CallType.AudioMulti ||
        callType === CallType.VideoMulti
      ) {
        showMultiCall({
          appKey: appKey,
          agoraAppId: agoraAppId,
          inviterId: im.userId,
          currentId: im.userId,
          inviteeIds: inviteeIds,
          callType: callType,
          // inviterName: '',
          // inviterAvatar: '',
          onRequestClose: hideCall,
          groupAvatar: groupAvatar,
        });
      }
    },
    [hideCall, im, showMultiCall, showSingleCall]
  );

  const onShowCall = React.useCallback(
    (params: {
      channelId: string;
      inviterId: string;
      callType: CallType;
      extension?: any;
    }) => {
      const { callType, inviterId } = params;
      if (im.userId === undefined) {
        return;
      }
      if (inviterId === im.userId) {
        return;
      }
      if (callType === CallType.Audio1v1 || callType === CallType.Video1v1) {
        showSingleCall({
          appKey: appKey,
          agoraAppId: agoraAppId,
          inviterId: inviterId,
          currentId: im.userId,
          inviteeIds: [im.userId],
          callType: callType,
          // inviterName: '',
          // inviterAvatar: '',
          onRequestClose: hideCall,
        });
      } else if (
        callType === CallType.AudioMulti ||
        callType === CallType.VideoMulti
      ) {
        showMultiCall({
          appKey: appKey,
          agoraAppId: agoraAppId,
          inviterId: inviterId,
          currentId: im.userId,
          inviteeIds: [im.userId],
          callType: callType,
          // inviterName: '',
          // inviterAvatar: '',
          onRequestClose: hideCall,
        });
      }
    },
    [hideCall, im.userId, showMultiCall, showSingleCall]
  );

  return {
    showSingleCall,
    showMultiCall,
    hideCall,
    showCall,
    onShowCall,
  };
}

export function useCallApiListener() {
  const { onShowCall } = useCallApi({});
  const { call } = useCallkitSdkContext();

  const addListener = React.useCallback(() => {
    const listener = {
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        onShowCall(params);
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        console.warn('onCallOccurError:', params);
      },
      onSignallingMessage: (msg) => {
        console.log('dev:onSignallingMessage:', msg);
        DeviceEventEmitter.emit('onSignallingMessage', {
          type: 'callSignal',
          extra: msg,
        });
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call, onShowCall]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);
}
