import * as React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  SlideModal,
  SlideModalRef,
} from 'react-native-chat-uikit';

type MySlideModalRef = SlideModalRef;
type MySlideModalProps = {
  propsRef?: React.RefObject<MySlideModalRef>;
};
export const MySlideModal = (props: MySlideModalProps) => {
  const { propsRef } = props;
  const modalRef = React.useRef<SlideModalRef>({} as any);
  console.log('test:MySlideModal:', propsRef?.current);
  if (propsRef?.current) {
    propsRef.current.startShow = () => {
      modalRef?.current?.startShow?.();
    };
    propsRef.current.startHide = () => {
      modalRef?.current?.startHide?.();
    };
  }
  return (
    <SlideModal
      propsRef={modalRef}
      modalAnimationType="slide"
      backgroundColor={'rgba(1,1,1, 0.2)'}
      backgroundTransparent={false}
      onRequestModalClose={() => {
        modalRef.current.startHide();
      }}
    >
      <Pressable
      // style={{ height: 400, backgroundColor: 'yellow' }}
      // onPress={() => {
      //   modalRef.current.startHide();
      // }}
      >
        <View style={{ height: 400, backgroundColor: 'yellow' }}>
          <View style={{ height: 40, margin: 10, backgroundColor: 'blue' }} />
          <View style={{ height: 40, margin: 10, backgroundColor: 'blue' }} />
          <View style={{ height: 40, margin: 10, backgroundColor: 'blue' }} />
          <View style={{ height: 40, margin: 10, backgroundColor: 'blue' }} />
        </View>
      </Pressable>
    </SlideModal>
  );
};

export function SlideModalComponent(): JSX.Element {
  const { width } = useWindowDimensions();
  const modalRef = React.useRef<MySlideModalRef>({} as any);
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Pressable
        onPress={() => {
          modalRef.current.startShow();
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <MySlideModal propsRef={modalRef} />
    </View>
  );
}

export function AlertComponent(): JSX.Element {
  const { width } = useWindowDimensions();
  const modalRef = React.useRef<SlideModalRef>({} as any);
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Pressable
        onPress={() => {
          modalRef.current.startShow();
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <SlideModal
        propsRef={modalRef}
        modalAnimationType="fade"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
        onRequestModalClose={() => {
          modalRef.current.startHide();
        }}
        modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
        enableSlideComponent={false}
      >
        <Pressable
          style={{ height: 200, width: 200, backgroundColor: 'yellow' }}
          onPress={() => {
            modalRef.current.startHide();
          }}
        />
      </SlideModal>
    </View>
  );
}

const S = ({ type }: { type: number }) => {
  if (type === 1) {
    return <AlertComponent />;
  } else {
    return <SlideModalComponent />;
  }
};

export function TestSlideModal() {
  const [type, setType] = React.useState<number>(1);
  return (
    <View>
      <Pressable
        style={{
          height: 100,
          backgroundColor: 'blue',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        onPress={() => {
          setType(type === 1 ? 2 : 1);
        }}
      >
        <Text> change alert or modal </Text>
      </Pressable>
      <S type={type} />
    </View>
  );
}

export default function test_modal() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={palette}
      theme={theme}
    >
      <TestSlideModal />
    </Container>
  );
}
