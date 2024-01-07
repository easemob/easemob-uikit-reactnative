import * as React from 'react';

// import { DeviceEventEmitter } from 'react-native';
import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { UseSearchReturn } from '../ListSearch';
import type { UseFlatListReturn } from '../types';
import type { ContactSearchModel, SearchContactProps } from './types';

export function useSearchContact(
  props: SearchContactProps
): UseFlatListReturn<ContactSearchModel> &
  UseSearchReturn<ContactSearchModel> & {
    onCancel?: () => void;
  } {
  const { onClicked, testMode, searchType, onCancel, groupId } = props;
  const flatListProps = useFlatList<ContactSearchModel>({
    isShowAfterLoaded: false,
    onInit: () => init(),
  });
  const im = useChatContext();
  const { setData, isAutoLoad, dataRef } = flatListProps;
  // const [initialized, setInitialized] = React.useState(false);

  const onCheckClickedCallback = React.useCallback(
    (data?: ContactSearchModel) => {
      if (data?.checked !== undefined) {
        for (let i = 0; i < dataRef.current.length; i++) {
          const item = dataRef.current[i];
          if (item) {
            if (item.userId === data.userId) {
              dataRef.current[i] = { ...item, checked: !data.checked };
              if (searchType === 'create-group') {
                im.setContactCheckedState({
                  key: searchType,
                  userId: data.userId,
                  checked: !data.checked,
                });
              } else if (searchType === 'add-group-member') {
                if (groupId) {
                  im.setContactCheckedState({
                    key: groupId,
                    userId: data.userId,
                    checked: !data.checked,
                  });
                }
              }
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
    [dataRef, groupId, im, searchType, setData]
  );

  const onCancelCallback = React.useCallback(() => {
    if (searchType === 'create-group' || searchType === 'add-group-member') {
      if (onCancel) {
        onCancel([...dataRef.current]);
      }
    } else {
      onCancel?.();
    }
  }, [dataRef, onCancel, searchType]);

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
                const getChecked = () => {
                  if (searchType === 'create-group') {
                    return (
                      im.getContactCheckedState({
                        key: searchType,
                        userId: item.userId,
                      }) ?? false
                    );
                  } else if (searchType === 'add-group-member') {
                    if (groupId) {
                      const isExisted = im.getGroupMember({
                        groupId,
                        userId: item.userId,
                      });
                      const checked = im.getContactCheckedState({
                        key: groupId,
                        userId: item.userId,
                      });
                      return (
                        isExisted !== undefined ||
                        (checked !== undefined ? checked : false)
                      );
                    }
                  }
                  return undefined;
                };
                const getState = () => {
                  if (groupId && item.userId) {
                    return (
                      im.getGroupMember({
                        groupId,
                        userId: item.userId,
                      }) !== undefined
                    );
                  }
                  return false;
                };
                return {
                  ...item,
                  id: item.userId,
                  name: item.nickName,
                  checked: getChecked(),
                  disable: getState(),
                  onCheckClicked: 'create-group'
                    ? onCheckClickedCallback
                    : undefined,
                } as ContactSearchModel;
              });
              setData([...dataRef.current]);
              // setInitialized(true);
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

  // React.useEffect(() => {
  //   if (searchType === 'create-group') {
  //     if (initialized === true) {
  //       DeviceEventEmitter.emit(
  //         '_$request_contact_state',
  //         (
  //           list: {
  //             convId: string;
  //             checked: boolean | undefined;
  //           }[]
  //         ) => {
  //           list.forEach((item) => {
  //             dataRef.current.forEach((v) => {
  //               if (v.userId === item.convId) {
  //                 v.checked = item.checked;
  //               }
  //             });
  //           });
  //           setData([...dataRef.current]);
  //         }
  //       );
  //     }
  //   }
  // }, [initialized, dataRef, searchType, setData]);

  return {
    ...flatListProps,
    onClicked,
    onCancel: onCancelCallback,
  };
}
