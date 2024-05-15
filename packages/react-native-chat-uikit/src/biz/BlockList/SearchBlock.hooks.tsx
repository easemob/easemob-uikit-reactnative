import * as React from 'react';

// import { DeviceEventEmitter } from 'react-native';
import { BlockModel, useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { BlockSearchModel, SearchBlockProps } from './types';

/**
 * Search Blocks component.
 */
export function useSearchBlock(props: SearchBlockProps) {
  const { onClicked, testMode, onCancel } = props;
  const flatListProps = useFlatList<BlockSearchModel>({
    isShowAfterLoaded: false,
    onInit: () => init(),
  });
  const im = useChatContext();
  const { setData, isAutoLoad, dataRef } = flatListProps;
  // const [initialized, setInitialized] = React.useState(false);

  const onCancelCallback = React.useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const getNickName = React.useCallback((section: BlockModel) => {
    if (section.remark && section.remark.length > 0) {
      return section.remark;
    } else if (section.userName && section.userName.length > 0) {
      return section.userName;
    } else {
      return section.userId;
    }
  }, []);

  const init = async () => {
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      im.getAllBlockList({
        onResult: (res) => {
          if (res.isOk && res.value) {
            res.value.forEach((item) => {
              dataRef.current.push({
                ...item,
                id: item.userId,
                name: getNickName(item),
                type: 'user',
              });
            });
            setData([...dataRef.current]);
          }
        },
      });
    }
  };

  return {
    ...flatListProps,
    onClicked,
    onCancel: onCancelCallback,
  };
}
