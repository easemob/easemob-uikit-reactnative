import * as React from 'react';
import { View } from 'react-native';

import Draggable from '../../../../packages/react-native-chat-callkit/src/view/components/Draggable';

export default function TestDraggable() {
  return (
    <Draggable x={0} y={0}>
      <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />
    </Draggable>
  );
}
