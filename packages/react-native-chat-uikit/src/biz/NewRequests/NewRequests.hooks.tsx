import * as React from 'react';

import { NewRequestModel, useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import { NewRequestsItemMemo } from './NewRequests.item';
import type {
  NewRequestsItemComponentType,
  NewRequestsItemProps,
  UseNewRequestsProps,
  UseNewRequestsReturn,
} from './types';

export function useNewRequests(
  props: UseNewRequestsProps
): UseFlatListReturn<NewRequestsItemProps> &
  Omit<
    ListItemActions<NewRequestModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > &
  UseNewRequestsReturn & {
    tr: (key: string, ...args: any[]) => string;
  } {
  const {
    onClicked,
    onButtonClicked,
    testMode,
    onSort: propsOnSort,
    ListItemRender: propsListItemRender,
  } = props;
  const flatListProps = useFlatList<NewRequestsItemProps>({
    listState: 'normal',
    onInit: () => init(),
  });
  const { setData, dataRef } = flatListProps;
  const im = useChatContext();
  const { tr } = useI18nContext();
  const ListItemRenderRef = React.useRef<NewRequestsItemComponentType>(
    propsListItemRender ?? NewRequestsItemMemo
  );

  const onClickedCallback = React.useCallback(
    (data?: NewRequestModel | undefined) => {
      if (onClicked) {
        onClicked(data);
      } else {
        // todo: goto new friend info page.
      }
    },
    [onClicked]
  );

  const onButtonClickedCallback = React.useCallback(
    (data?: NewRequestModel | undefined) => {
      if (onButtonClicked) {
        onButtonClicked(data);
      } else {
        // todo: accept invite. no have reject.
        if (data) {
          im.acceptInvitation({
            userId: data.requestId,
            onResult: () => {
              data.state === 'accepted';
              im.requestList.removeRequest(data);
            },
          });
        }
      }
    },
    [im, onButtonClicked]
  );

  useLifecycle((state) => {
    if (state === 'load') {
      im.requestList.addListener('newRequests', {
        onNewRequestListChanged: (list) => {
          dataRef.current = list.map((item) => {
            return {
              id: item.requestId,
              data: item,
            };
          });
          dataRef.current.sort(onSort);
          setData([...dataRef.current]);
        },
      });
    }
  });

  const init = async () => {
    if (testMode === 'only-ui') {
    } else {
      const state = await im.loginState();
      if (state === 'logged') {
        im.requestList.getRequestList({
          onResult: (result) => {
            if (result.isOk && result.value) {
              dataRef.current = result.value.map((item) => {
                return {
                  id: item.requestId,
                  data: item,
                };
              });
              dataRef.current.sort(onSort);
              setData([...dataRef.current]);
            }
          },
        });
      }
    }
  };

  const onSort = (
    prevProps: NewRequestsItemProps,
    nextProps: NewRequestsItemProps
  ): number => {
    if (propsOnSort) {
      return propsOnSort(prevProps, nextProps);
    } else {
      return sortRequest(prevProps, nextProps);
    }
  };

  const sortRequest = (
    prevProps: NewRequestsItemProps,
    nextProps: NewRequestsItemProps
  ): number => {
    const prevTimestamp = prevProps.data.msg?.localTime;
    const nextTimestamp = nextProps.data.msg?.localTime;
    if (prevTimestamp !== undefined && nextTimestamp !== undefined) {
      return prevTimestamp === nextTimestamp
        ? 0
        : prevTimestamp < nextTimestamp
        ? 1
        : -1;
    } else {
      return 0;
    }
  };

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
    onButtonClicked: onButtonClickedCallback,
    tr,
    ListItemRender: ListItemRenderRef.current,
  };
}
