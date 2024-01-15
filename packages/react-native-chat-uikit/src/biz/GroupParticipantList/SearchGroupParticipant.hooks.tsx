import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type {
  GroupParticipantSearchModel,
  SearchGroupParticipantProps,
} from './types';

export function UseSearchGroupParticipant(props: SearchGroupParticipantProps) {
  const { groupId, onClicked, testMode } = props;
  const flatListProps = useFlatList<GroupParticipantSearchModel>({
    onInit: () => init(),
  });
  const { dataRef } = flatListProps;

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
    } else {
      const owner = await im.getGroupOwner({ groupId });
      im.getGroupAllMembers({
        groupId: groupId,
        owner,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true && value) {
            dataRef.current = value.map((item) => {
              return {
                ...item,
                memberId: item.memberId,
                memberName: item.memberName ?? item.memberId,
                isOwner: item.memberId === owner?.memberId,
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
