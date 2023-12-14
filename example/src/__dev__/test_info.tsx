import * as React from 'react';
import {
  ContactInfo,
  GlobalContainer,
  GroupInfo,
  GroupParticipantInfo,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function TestContactInfo() {
  const [doNotDisturb, onDoNotDisturb] = React.useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ContactInfo
        doNotDisturb={doNotDisturb}
        onDoNotDisturb={onDoNotDisturb}
        userId={''}
      />
    </SafeAreaView>
  );
}

export function TestGroupInfo() {
  const [doNotDisturb, onDoNotDisturb] = React.useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GroupInfo
        doNotDisturb={doNotDisturb}
        onDoNotDisturb={onDoNotDisturb}
        groupId={''}
      />
    </SafeAreaView>
  );
}

export function TestGroupParticipantInfo() {
  const [doNotDisturb, onDoNotDisturb] = React.useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GroupParticipantInfo
        groupId="sdf"
        doNotDisturb={doNotDisturb}
        onDoNotDisturb={onDoNotDisturb}
        userId={''}
      />
    </SafeAreaView>
  );
}

export default function TestInfo() {
  return (
    <GlobalContainer appKey={''}>
      <TestGroupParticipantInfo />
    </GlobalContainer>
  );
}