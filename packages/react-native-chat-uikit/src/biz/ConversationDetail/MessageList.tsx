import * as React from 'react';
import { View } from 'react-native';

export type MessageListProps = {
  onClicked?: () => void;
};
export function MessageList(props: MessageListProps) {
  const { onClicked } = props;
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#fff8dc',
      }}
      onTouchEnd={onClicked}
    >
      {/* <View style={{ flexGrow: 1 }} /> */}
    </View>
  );
}
