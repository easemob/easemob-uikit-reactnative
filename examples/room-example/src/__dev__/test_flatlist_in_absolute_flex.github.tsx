import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';

type ParticipantListItemProps = { id: string };

export function ParticipantList() {
  const dataRef = React.useRef<ParticipantListItemProps[]>([
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
    { id: '12' },
    { id: '13' },
    { id: '14' },
    { id: '15' },
    { id: '16' },
    { id: '17' },
  ]);
  const [data] = React.useState<ParticipantListItemProps[]>(dataRef.current);

  return (
    <View
      style={{
        height: 300,
      }}
    >
      <FlatList
        data={data}
        renderItem={(info: ListRenderItemInfo<ParticipantListItemProps>) => {
          const { item } = info;
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: 'yellow',
                margin: 1,
              }}
            >
              <Text>{item.id + 'sdlkfjsdlfksdjflskdjf'}</Text>
            </View>
          );
        }}
        keyExtractor={(item: ParticipantListItemProps) => {
          return item.id;
        }}
      />
    </View>
  );
}

export function ParticipantListItem(): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        width: '100%',
        marginTop: 100,
      }}
    >
      <View
        style={
          {
            // flex: 1, // Not setting this will cause the FlatList to not scroll.
          }
        }
      >
        <View style={{ position: 'absolute' }}>
          <ParticipantList />
        </View>
      </View>
    </View>
  );
}

export default function test_flatlist() {
  return <ParticipantListItem />;
}
