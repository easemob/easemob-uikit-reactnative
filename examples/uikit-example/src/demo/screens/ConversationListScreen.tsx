import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ConversationList,
  ConversationListRef,
  // DataModel,
  // DataModelType,
  // UIKitError,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationListScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ConversationList
        propsRef={convRef}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        // filterEmptyConversation={true}
        onClickedSearch={() => {
          navigation.push('SearchConversation', {});
        }}
        onClickedItem={(data) => {
          if (data === undefined) {
            return;
          }
          const convId = data?.convId;
          const convType = data?.convType;
          const convName = data?.convName;
          navigation.navigate('ConversationDetail', {
            params: {
              convId,
              convType,
              convName: convName ?? convId,
              from: 'ConversationList',
              hash: Date.now(),
            },
          });
        }}
        onClickedNewGroup={() => {
          navigation.navigate('CreateGroup', {});
        }}
        onClickedNewConversation={() => {
          navigation.navigate('NewConversation', {});
        }}
        // onInitMenu={(menu: InitMenuItemsType[]) => {
        //   return [
        //     ...menu,
        //     {
        //       name: 'test',
        //       isHigh: false,
        //       icon: 'bell',
        //       onClickedItem: () => {
        //         console.log('test');
        //         const list = convRef.current.getList();
        //         const first = list[0];
        //         if (first) {
        //           convRef.current.updateItem({
        //             ...first,
        //             doNotDisturb: !first.doNotDisturb,
        //           });
        //         }
        //       },
        //     },
        //   ];
        // }}
        // onClickedNewContact={() => {
        // }}
      />
    </SafeAreaView>
  );
}
