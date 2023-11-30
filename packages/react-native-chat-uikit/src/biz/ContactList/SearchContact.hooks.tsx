import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { UseSearchReturn } from '../ListSearch';
import type { UseFlatListReturn } from '../types';
import type { ContactSearchModel, UseSearchContactProps } from './types';

export function useSearchContact(
  props: UseSearchContactProps
): UseFlatListReturn<ContactSearchModel> &
  UseSearchReturn<ContactSearchModel> & {
    onCancel?: () => void;
  } {
  const { onClicked, testMode, searchType, onCancel } = props;
  const flatListProps = useFlatList<ContactSearchModel>({
    isShowAfterLoaded: false,
    onInit: () => init(),
  });
  const { setData, isAutoLoad, dataRef } = flatListProps;
  const [initialized, setInitialized] = React.useState(false);

  const onCheckClickedCallback = React.useCallback(
    (checked?: boolean, data?: ContactSearchModel) => {
      if (checked !== undefined && data) {
        for (let i = 0; i < dataRef.current.length; i++) {
          const item = dataRef.current[i];
          if (item) {
            if (item.userId === data.userId) {
              dataRef.current[i] = { ...item, checked: !checked };
              setData([...dataRef.current]);
              // DeviceEventEmitter.emit(
              //   '_$response_contact_state',
              //   dataRef.current[i]
              // );
              break;
            }
          }
        }
      }
    },
    [dataRef, setData]
  );

  const onCancelCallback = React.useCallback(() => {
    if (searchType === 'create-group') {
      if (onCancel) {
        onCancel([...dataRef.current]);
      }
    } else {
      onCancel?.();
    }
  }, [dataRef, onCancel, searchType]);

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      im.getAllContacts({
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                return {
                  ...item,
                  id: item.userId,
                  name: item.nickName
                    ? item.nickName
                    : item.remark.length === 0 || item.remark === undefined
                    ? item.userId
                    : item.remark,
                  checked: searchType === 'create-group' ? false : undefined,
                  onCheckClicked: 'create-group'
                    ? onCheckClickedCallback
                    : undefined,
                } as ContactSearchModel;
              });
              setData([...dataRef.current]);
              setInitialized(true);
            }
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  };

  React.useEffect(() => {
    if (searchType === 'create-group') {
      if (initialized === true) {
        DeviceEventEmitter.emit(
          '_$request_contact_state',
          (
            list: {
              convId: string;
              checked: boolean | undefined;
            }[]
          ) => {
            list.forEach((item) => {
              dataRef.current.forEach((v) => {
                if (v.userId === item.convId) {
                  v.checked = item.checked;
                }
              });
            });
            setData([...dataRef.current]);
          }
        );
      }
    }
  }, [initialized, dataRef, searchType, setData]);

  return {
    ...flatListProps,
    onClicked,
    onCancel: onCancelCallback,
  };
}
