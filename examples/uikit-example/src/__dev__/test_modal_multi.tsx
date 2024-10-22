import * as React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Container, Text } from 'react-native-chat-uikit';

function ShowAlert() {
  Alert.alert('Title', 'Message');
}
function ShowModal(props: { visible: boolean; onRequestClose: () => void }) {
  const { visible, onRequestClose } = props;
  return (
    <Modal
      style={{ backgroundColor: 'green' }}
      visible={visible}
      onRequestClose={onRequestClose}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={{ flex: 1, backgroundColor: 'green' }}>
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: 'yellow',
              alignSelf: 'center',
              marginTop: '50%',
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function Test1() {
  const [visible, setVisible] = React.useState(false);
  const onClicked = () => {
    setVisible((pre) => !pre);
    setTimeout(ShowAlert, 1000);
  };
  return (
    <View style={{ top: 300 }}>
      <Pressable onPress={onClicked}>
        <Text>{'show modal'}</Text>
      </Pressable>
      <ShowModal
        visible={visible}
        onRequestClose={() => {
          console.log('onRequestClose');
          onClicked();
        }}
      />
    </View>
  );
}

export default function TestModal() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <Test1 />
    </Container>
  );
}
