import { ChatConversationType } from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type {
  ConversationSearchModel,
  UseSearchConversationProps,
} from './types';

export function useSearchConversation(props: UseSearchConversationProps) {
  const { onClicked, testMode } = props;
  const flatListProps = useFlatList<ConversationSearchModel>({
    isShowAfterLoaded: false,
    onInit: () => init(),
  });
  const { setData, dataRef, isAutoLoad } = flatListProps;

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
      const array = Array.from({ length: 10 }, (_, index) => ({
        id: index.toString(),
      }));
      const testList = array.map((item, i) => {
        return {
          convId: item.id,
          convType: i % 2 === 0 ? 0 : 1,
          convAvatar:
            'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
          convName: 'user',
          unreadMessageCount: 1,
          isPinned: i % 2 === 0,
          id: item.id,
          name: item.id + 'name',
        } as ConversationSearchModel;
      });
      setData(testList);
      return;
    }
    if (isAutoLoad === true) {
      im.getAllConversations({
        onResult: (result) => {
          const { isOk, value: list } = result;
          if (isOk && list) {
            if (list) {
              for (const conv of list) {
                dataRef.current.push({
                  ...conv,
                  id: conv.convId,
                  name: conv.convName,
                  avatar: conv.convAvatar,
                  type:
                    conv.convType === ChatConversationType.GroupChat
                      ? 'group'
                      : 'user',
                });
              }
              setData([...dataRef.current]);
            }
          }
        },
      });
    }
  };

  return {
    ...flatListProps,
    onClicked,
  };
}
