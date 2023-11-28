import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type {
  GroupParticipantSearchModel,
  UseSearchGroupParticipantProps,
} from './types';

export function UseSearchGroupParticipant(
  props: UseSearchGroupParticipantProps
): UseFlatListReturn<GroupParticipantSearchModel> &
  Omit<
    ListItemActions<GroupParticipantSearchModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > {
  const { groupId, onClicked, testMode } = props;
  const flatListProps = useFlatList<GroupParticipantSearchModel>({
    onInit: () => init(),
  });
  const { dataRef } = flatListProps;

  const im = useChatContext();
  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      im.getAllGroupMembers({
        groupId: groupId,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true && value) {
            dataRef.current = value.map((item) => {
              return {
                ...item,
                id: item.id,
                name: item.name ?? item.id,
              } as GroupParticipantSearchModel;
            });
          } else {
            if (error) {
              im.sendError({ error });
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
