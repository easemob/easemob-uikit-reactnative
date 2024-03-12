import * as React from 'react';
import { CallState, SingleCall } from 'react-native-chat-callkit';

// import { TestEnum } from '../../../../packages/react-native-chat-callkit/src/view/SingleCall';

export function test_all() {
  const isMinimize = false; // for test
  const callState = CallState.Calling; // for test
  const callType = 'video'; // !!! must
  const bottomButtonType = 'invitee-video-init'; // for test
  const muteVideo = false; // for test
  const inviterId = 'inviterId';
  const currentId = 'wo';
  const inviteeId = 'inviteeId';
  const isTest = true;
  return (
    <SingleCall
      isMinimize={isMinimize}
      callState={callState}
      callType={callType}
      bottomButtonType={bottomButtonType}
      muteVideo={muteVideo}
      inviterId={inviterId}
      inviterName={inviterId}
      currentId={currentId}
      currentName={currentId}
      inviteeId={inviteeId}
      isTest={isTest}
      onClose={() => {}}
    />
  );
}

export default function TestSingleCall() {
  return test_all();
}
