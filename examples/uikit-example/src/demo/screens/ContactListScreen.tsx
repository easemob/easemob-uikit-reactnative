import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  ContactItemProps,
  ContactList,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { generateRandomChineseNames } from '../common/names';
import type { RootScreenParamsList } from '../routes';

export const names = generateRandomChineseNames(10);

export const MyCustomItemView = (props: ContactItemProps) => {
  const {} = props;
  return <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />;
};

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactListScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ContactList
        contactType={'contact-list'}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        // navigationBarVisible={false}
        // onInitialized={updateData}
        onClickedSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'contact-list' },
          });
        }}
        onClickedItem={(data) => {
          if (data?.userId) {
            navigation.push('ContactInfo', { params: { userId: data.userId } });
          }
        }}
        onClickedGroupList={() => {
          navigation.navigate('GroupList', {
            params: {},
          });
        }}
        onClickedNewRequest={() => {
          navigation.navigate('NewRequests', {
            params: {},
          });
        }}
        // onInitListItemActions={(
        //   defaultItems: React.ReactElement<ContactItemProps>[]
        // ) => {
        //   defaultItems.push(<MyCustomItemView name={'custom item'} />);
        //   return defaultItems;
        // }}
        // customNavigationBar={
        //   <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />
        // }
        // enableNavigationBar={true}
        // onClickedNewContact={() => {}}
        // onSort={(
        //   prevProps: ContactListItemProps,
        //   nextProps: ContactListItemProps
        // ) => {
        //   return prevProps.id === nextProps.id
        //     ? 0
        //     : prevProps.id < nextProps.id
        //     ? 1
        //     : -1;
        // }}
        // navigationBarVisible={true}
        // customNavigationBar={
        //   <View
        //     style={{
        //       width: 100,
        //       height: 44,
        //       backgroundColor: 'red',
        //     }}
        //   />
        // }
      />
    </SafeAreaView>
  );
}
