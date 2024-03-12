import * as React from 'react';
import { View } from 'react-native';
import { VideoViewSetupMode } from 'react-native-agora';
import { Text1Button } from 'react-native-chat-uikit';

import type { User } from '../../../../packages/react-native-chat-callkit/src/types';
import { VideoTabs } from '../../../../packages/react-native-chat-callkit/src/view/components/VideoTabs';

export function Test() {
  const [count, update] = React.useState(0);
  const ref = React.useRef<VideoTabs>({} as any);
  const users = React.useMemo(() => [] as User[], []);
  // for (let index = 0; index < 6; index++) {
  //   users.push({
  //     userId: `id_{${index}}`,
  //     userHadJoined: false,
  //     isSelf: true,
  //     userName: `name_${index}`,
  //     muteAudio: true,
  //     muteVideo: true,
  //   });
  // }
  return (
    <View style={{ flex: 1 }}>
      <Text1Button
        onPress={() => {
          users.push({
            userId: `id_{${count}}`,
            userHadJoined: false,
            isSelf: true,
            userName: `name_${count}`,
            muteAudio: true,
            muteVideo: true,
          });
          update(count + 1);
          // ref.current.update(users);
        }}
        text={'update'}
      />
      <VideoTabs
        ref={ref}
        users={users}
        setupMode={VideoViewSetupMode.VideoViewSetupAdd}
      />
    </View>
  );
  // return <AudioTabs users={users} />;
}

export default function TestTabAudio() {
  return Test();
}
