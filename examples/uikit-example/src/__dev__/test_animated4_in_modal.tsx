// https://github.com/hakymz/ReactNativeCustomModal/blob/main/App.js
import React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Container, SlideModal, SlideModalRef } from '../rename.uikit';

const App = () => {
  const propsRef = React.useRef<SlideModalRef>({} as any);
  return (
    <Container options={{ appKey: 'sdf', autoLogin: false, debugModel: true }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SlideModal
          propsRef={propsRef}
          modalAnimationType="slide"
          onRequestModalClose={() => propsRef.current?.startHide()}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => propsRef.current?.startHide()}>
                <Image
                  source={require('../../assets/agora_about_logo.png')}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/agora_logo_2x.png')}
              style={{ height: 150, width: 150, marginVertical: 10 }}
            />
          </View>

          <Text
            style={{ marginVertical: 30, fontSize: 20, textAlign: 'center' }}
          >
            Congratulations registration was successful
          </Text>
        </SlideModal>
        <Button
          title="Open Modal"
          onPress={() => propsRef.current?.startShow()}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default App;
