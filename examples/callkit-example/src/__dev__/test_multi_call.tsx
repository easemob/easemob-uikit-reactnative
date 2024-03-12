import * as React from 'react';
import { Text, View } from 'react-native';
import {
  CallState,
  InviteeListProps,
  MultiCall,
} from 'react-native-chat-callkit';
import { Text1Button } from 'react-native-chat-uikit';

import { SelectListMemo } from '../components/SelectList';

const ContactList = (props: InviteeListProps): JSX.Element => {
  console.log('test:contactList:');
  const { onClose, selectedIds, maxCount } = props;
  const [count, setCount] = React.useState<number>(selectedIds.length);
  const addedIdsRef = React.useRef<string[]>([]);
  const content = () => {
    return `(${count}/${maxCount})`;
  };
  return (
    <View
      style={{
        flex: 1,
        top: 44,
        width: '100%',
        // height: 100,
        backgroundColor: 'white',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text1Button
          style={{ height: 40, width: 60 }}
          onPress={() => {
            onClose(addedIdsRef.current);
          }}
          text={'done'}
        />
        <View style={{ width: 10 }} />
        <View>
          <Text>{content()}</Text>
        </View>
      </View>
      <SelectListMemo
        selectedIds={selectedIds}
        maxCount={maxCount}
        onChangeCount={(c) => {
          setCount(c);
        }}
        onAddedIds={(ids: string[]) => {
          addedIdsRef.current = ids;
        }}
      />
    </View>
  );
};

export function test_all() {
  const isMinimize = false; // for test
  // const elapsed = 10000; // for test
  const callState = CallState.Calling; // for test
  const callType = 'audio'; // !!! must
  const bottomButtonType = 'invitee-video-init'; // for test
  const muteVideo = false; // for test
  const inviterId = 'inviterId';
  const currentId = 'wo';
  const isTest = true;
  const inviteeIds = ['1', '2', '3', '4', '5', '6'];
  // const inviteeIds = ['1'];
  return (
    <MultiCall
      isMinimize={isMinimize}
      callState={callState}
      callType={callType}
      bottomButtonType={bottomButtonType}
      muteVideo={muteVideo}
      inviterId={inviterId}
      inviterName={inviterId}
      currentId={currentId}
      currentName={currentId}
      isTest={isTest}
      inviteeIds={inviteeIds}
      inviteeList={{
        InviteeList: ContactList,
      }}
      onClose={() => {}}
    />
  );
}

export default function TestMultiCall() {
  React.useEffect(() => {}, []);
  return test_all();
}
