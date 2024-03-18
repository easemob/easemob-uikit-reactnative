import * as React from 'react';
import { View } from 'react-native';
import {
  CallError,
  CallListener,
  CallType,
  CallUser,
  formatElapsed,
  MultiCall,
  SingleCall,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';
import {
  useAbsoluteViewContext,
  useChatContext,
  useSimpleToastContext,
} from 'react-native-chat-uikit';

import { agoraAppId, appKey } from './const';

export type AVViewProps = {};
export function AVView(props: AVViewProps) {
  const {} = props;
  return <View />;
}

export function useCallApi(props: AVViewProps) {
  const {} = props;
  const { getAbsoluteViewRef } = useAbsoluteViewContext();
  const { getSimpleToastRef } = useSimpleToastContext();
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
            }}
            onHangUp={() => {
              console.log('test:stateEvent.onHangUp');
              onRequestClose();
            }}
            onCancel={() => {
              console.log('test:stateEvent.onCancel');
              onRequestClose();
            }}
            onRefuse={() => {
              console.log('test:stateEvent.onRefuse');
              onRequestClose();
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
    [getAbsoluteViewRef, getSimpleToastRef]
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
            onClose={(elapsed, reason) => {
              console.log('test:stateEvent.onClose', elapsed, reason);
              onRequestClose();
              getSimpleToastRef().show({
                message: reason
                  ? `reason: ${JSON.stringify(reason)}`
                  : `Call End: ${formatElapsed(elapsed)}`,
              });
            }}
            onHangUp={() => {
              console.log('test:stateEvent.onHangUp');
              onRequestClose();
            }}
            onCancel={() => {
              console.log('test:stateEvent.onCancel');
              onRequestClose();
            }}
            onRefuse={() => {
              console.log('test:stateEvent.onRefuse');
              onRequestClose();
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
    [getAbsoluteViewRef, getSimpleToastRef]
  );

  return {
    showSingleCall,
    showMultiCall,
    hideCall,
  };
}

export function useCallApiListener() {
  const { showMultiCall, showSingleCall, hideCall } = useCallApi({});
  const { call } = useCallkitSdkContext();
  const im = useChatContext();

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
