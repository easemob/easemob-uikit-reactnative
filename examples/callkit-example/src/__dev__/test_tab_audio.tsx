import * as React from 'react';
import { View } from 'react-native';

import { type User } from '../rename.callkit';
import { Text1Button } from '../ui/Button';

let count = 0;
export function Test() {
  const users = React.useMemo(() => [] as User[], []);
  const [, setValue] = React.useState(0);
  // for (let index = 0; index < 2; index++) {
  //   users.push({
  //     userId: `id_{${index}}`,
  //     userName: `name_${index}`,
  //     userHadJoined: false,
  //     isSelf: false,
  //   });
  //   count = index + 1;
  // }
  return (
    <View style={{ flex: 1, top: 100 }}>
      <Text1Button
        onPress={() => {
          users.push({
            userId: `id_{${count}}`,
            userName: `name_${count}`,
            userHadJoined: false,
            isSelf: false,
          });
          ++count;
          setValue(count);
          console.log('test:1:', count, users.length);
        }}
        text={'update'}
      />
      {/* <AudioTabs users={users} /> */}
    </View>
  );
  // return <AudioTabs users={users} />;
}

export default function TestTabAudio() {
  return Test();
}
