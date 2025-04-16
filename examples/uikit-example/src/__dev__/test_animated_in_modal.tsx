// https://github.com/callstack/react-native-paper/issues/4446
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button, Modal, Portal, Provider } from 'react-native-paper';

const { height } = Dimensions.get('window');

const CustomModal = ({ visible, onDismiss, children }: any) => {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [translateY, visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Animated.View
          style={[styles.animatedContainer, { transform: [{ translateY }] }]}
        >
          {children}
        </Animated.View>
      </Modal>
    </Portal>
  );
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // return (
  //   <View
  //     style={{ flex: 1, backgroundColor: 'red', width: 100, height: 100 }}
  //   />
  // );

  return (
    <Provider>
      <View style={styles.container}>
        <Button onPress={showModal}>Show Modal</Button>
        <CustomModal visible={modalVisible} onDismiss={hideModal}>
          <Text style={styles.modalContent}>
            This is a custom animated modal!
          </Text>
          <Button onPress={hideModal}>Hide Modal</Button>
        </CustomModal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animatedContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalContent: {
    marginBottom: 20,
  },
});

export default App;
