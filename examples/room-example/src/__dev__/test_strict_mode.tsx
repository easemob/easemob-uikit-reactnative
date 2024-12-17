/**
 * ref: https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-rendering-in-development?
 */

import * as React from 'react';
import { Text, View } from 'react-native';

type ItemT = {
  id: string;
  content: string;
};

let count = 0;

export function TestListView2({ stories }: { stories: ItemT[] }) {
  console.log('test:TestListView:', stories);
  const items = stories;
  items.push({
    id: count.toString(),
    content: count.toString() + 'sdf',
  });
  ++count;
  return (
    <View style={{ flex: 1, backgroundColor: 'red', top: 100 }}>
      {items.map((v, i) => {
        return (
          <Text key={i} id={v.id}>
            {v.content}
          </Text>
        );
      })}
    </View>
  );
}

const list = [] as ItemT[];

function TestListView() {
  let [stories] = React.useState(list);
  return <TestListView2 stories={stories} />;
}

export default function test_list_view() {
  return <TestListView />;
}
