/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { getElement, TopNavigationBar } from 'react-native-chat-uikit';

type MyNavigationBarProps = {
  Title?: React.ReactElement;
  Left?: React.ComponentType<any> | React.ReactElement | null | undefined;
  Right?: React.ComponentType<any> | React.ReactElement | null | undefined;
  containerStyle?: StyleProp<ViewStyle>;
};
export function MyNavigationBar(props: MyNavigationBarProps) {
  const { containerStyle, Title, Left, Right } = props;

  return (
    <View
      style={[
        containerStyle,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      ]}
    >
      {getElement(Left)}
      {Title}
      {getElement(Right)}
    </View>
  );
}

export default function TestNavigationBar() {
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <MyNavigationBar
        containerStyle={{ marginHorizontal: 20 }}
        Title={
          <View style={{ height: 40, width: 40, backgroundColor: 'yellow' }}>
            <Text>{'Title'}</Text>
          </View>
        }
        Right={() => {
          return (
            <View style={{ height: 40, width: 40, backgroundColor: 'yellow' }}>
              <Text>{'Right'}</Text>
            </View>
          );
        }}
        Left={() => {
          return (
            <View style={{ height: 40, width: 40, backgroundColor: 'yellow' }}>
              <Text>{'Left'}</Text>
            </View>
          );
        }}
      />
      <TopNavigationBar
        containerStyle={{ marginHorizontal: 20 }}
        Title={
          <View style={{ height: 40, width: 40, backgroundColor: 'yellow' }}>
            <Text>{'Title'}</Text>
          </View>
        }
        Right={({ onClicked }: { onClicked?: () => void }) => {
          return (
            <View
              style={{ height: 40, width: 40, backgroundColor: 'yellow' }}
              onTouchEnd={onClicked}
            >
              <Text>{'Right'}</Text>
            </View>
          );
        }}
        Left={() => {
          return (
            <View style={{ height: 40, width: 40, backgroundColor: 'yellow' }}>
              <Text>{'Left'}</Text>
            </View>
          );
        }}
        RightProps={{
          onClicked: () => {
            console.log('test:zuoyu:RightProps:onClick');
          },
        }}
      />
    </View>
  );
}
