import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import type { ChatRoom } from '../rename.room';
import { useLifecycle, useRoomContext } from '../rename.room';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomListScreen(props: Props) {
  const { navigation } = props;
  const dataRef = React.useRef<{ id: string; room: ChatRoom }[]>([]);
  const [data, setData] = React.useState(dataRef.current);
  const [refreshing, setRefreshing] = React.useState(false);
  const im = useRoomContext();

  const request = React.useCallback(
    async (finished?: () => void) => {
      const s = await im.loginState();
      if (s === 'logged') {
        dataRef.current = [];
        im.fetchChatroomList(1)
          .then((list) => {
            for (const room of list) {
              dataRef.current.push({
                id: room.roomId,
                room: room,
              });
            }
            setData([...dataRef.current]);
            finished?.();
          })
          .catch(finished);
      } else {
        finished?.();
      }
    },
    [im]
  );
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      request(() => {
        setRefreshing(false);
      });
    }, 1000);
  };

  useLifecycle(
    React.useCallback(
      async (state) => {
        if (state === 'load') {
          request();
        } else {
        }
      },
      [request]
    )
  );

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Drop down to request the latest chat room list.'}
        </Text>
        <Text style={{ color: 'red' }}>{'refresh state: failed.'}</Text>
      </View>
      <FlatList
        renderItem={(info) => {
          const { item } = info;
          return (
            <TouchableOpacity
              key={item.id}
              style={{
                width: '90%',
                height: 40,
                marginVertical: 4,
                backgroundColor: '#fff8dc',
                justifyContent: 'center',
                // alignItems: 'center',
                borderRadius: 8,
                alignSelf: 'center',
              }}
              onPress={() => {
                navigation.push('TestChatroom', {
                  params: { room: item.room },
                });
              }}
            >
              <Text style={{ color: '#8fbc8f', fontSize: 20 }}>
                {`${item.id}:${item.room.roomName ?? item.id}`}
              </Text>
            </TouchableOpacity>
          );
        }}
        data={data}
        keyExtractor={(item) => {
          return item.id;
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      <View style={{ flex: 1 }} />
    </View>
  );
}
