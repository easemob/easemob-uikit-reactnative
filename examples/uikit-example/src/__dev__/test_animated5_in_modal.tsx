// https://github.com/hakymz/ReactNativeCustomModal/blob/main/App.js
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  BizContextMenuProps,
  BizContextMenuRef,
  BottomSheetMenu,
  Container,
} from '../rename.uikit';

function BottomSheetMenuTest(props: any) {
  const { onRequestModalClose, title, header, headerProps, propsRef } = props;
  const menuRef = React.useRef<BizContextMenuRef>({} as any);

  if (propsRef.current) {
    propsRef.current.startShow = () => {
      menuRef.current?.startShow?.();
    };
    propsRef.current.startHide = () => {
      menuRef.current?.startHide?.();
    };
    propsRef.current.startShowWithInit = (initItems: React.ReactElement[]) => {
      menuRef.current?.startShowWithInit?.(initItems);
    };
    propsRef.current.startShowWithProps = (props: BizContextMenuProps) => {
      console.log('test:startShowWithProps', props);
      menuRef.current?.startShowWithProps?.(props);
    };
    propsRef.current.getData = () => {
      return menuRef.current?.getData?.();
    };
  }

  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={onRequestModalClose}
      initItems={
        [
          // <View
          //   key={'1'}
          //   style={{ height: 100, width: 100, backgroundColor: 'blue' }}
          // />,
          // <View
          //   key={'2'}
          //   style={{ height: 100, width: 100, backgroundColor: 'red' }}
          // />,
        ]
      }
      title={title}
      header={header}
      headerProps={headerProps}
    />
  );
}

const App = () => {
  const propsRef = React.useRef<BizContextMenuRef>({} as any);
  return (
    <Container options={{ appKey: 'sdf', autoLogin: false, debugModel: true }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BottomSheetMenuTest
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
        </BottomSheetMenuTest>
        <Pressable
          // title="Open Modal"
          onPress={() => {
            // propsRef.current?.startShowWithInit([
            //   <View
            //     key={'1'}
            //     style={{ height: 100, width: 100, backgroundColor: 'blue' }}
            //   />,
            //   <View
            //     key={'2'}
            //     style={{ height: 100, width: 100, backgroundColor: 'red' }}
            //   />,
            // ]);
            propsRef.current?.startShowWithProps({
              initItems: [
                <View
                  key={'1'}
                  style={{ height: 100, width: 100, backgroundColor: 'blue' }}
                />,
                <View
                  key={'2'}
                  style={{ height: 100, width: 100, backgroundColor: 'red' }}
                />,
              ],
              onRequestModalClose: () => propsRef.current?.startHide(),
            });
          }}
        >
          <Text>{'Open Modal'}</Text>
        </Pressable>
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
