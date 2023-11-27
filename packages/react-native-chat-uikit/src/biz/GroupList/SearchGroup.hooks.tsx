import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { UseSearchReturn } from '../ListSearch';
import type { UseFlatListReturn } from '../types';
import type { GroupSearchModel, UseSearchGroupProps } from './types';

export function useSearchGroup(
  props: UseSearchGroupProps
): UseFlatListReturn<GroupSearchModel> & UseSearchReturn<GroupSearchModel> {
  const { testMode, onClicked } = props;
  const flatListProps = useFlatList<GroupSearchModel>({
    isShowAfterLoaded: false,
    onInit: () => init(),
  });
  const { setData } = flatListProps;
  const im = useChatContext();

  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      im.getAllGroups({
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              setData(
                value.map((v) => {
                  return {
                    ...v,
                    id: v.groupId,
                    name: v.groupName ?? v.groupId,
                  };
                })
              );
            }
          } else {
            if (error) {
              console.log('test:zuoyu:getAllGroups:error', error);
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
