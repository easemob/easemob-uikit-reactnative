import * as React from 'react';

import { NewRequestModel, useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu, useContactListMoreActions } from '../hooks';
import { useFlatList } from '../List';
import { NewRequestsItemMemo } from './NewRequests.item';
import type {
  NewRequestsItemComponentType,
  NewRequestsItemProps,
  NewRequestsProps,
} from './types';

export function useNewRequests(props: NewRequestsProps) {
  const {
    onClickedItem,
    onLongPressedItem,
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
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const { closeMenu } = useCloseMenu({ menuRef });
  const { onShowContactListMoreActions } = useContactListMoreActions({
    menuRef,
    alertRef,
  });

  const addContact = React.useCallback(
    (userId: string) => {
      im.addNewContact({
        userId: userId,
      });
    },
    [im]
  );

  const onClickedCallback = React.useCallback(
    (data?: NewRequestModel | undefined) => {
      onClickedItem?.(data);
    },
    [onClickedItem]
  );

  const onLongPressedCallback = React.useCallback(
    (data?: NewRequestModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const onButtonClickedCallback = React.useCallback(
    (data?: NewRequestModel | undefined) => {
      if (onButtonClicked) {
        onButtonClicked(data);
      } else {
        // !!! accept invite. no have reject.
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

  const onAddContact = React.useCallback(() => {
    onShowContactListMoreActions(addContact);
  }, [addContact, onShowContactListMoreActions]);

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressedCallback,
    onButtonClicked: onButtonClickedCallback,
    tr,
    ListItemRender: ListItemRenderRef.current,
    onAddContact,
    menuRef,
    alertRef,
    onRequestCloseMenu: closeMenu,
  };
}
