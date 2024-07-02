import * as React from 'react';

// import { DeviceEventEmitter } from 'react-native';
import { ContactModel, useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { ContactSearchModel, SearchContactProps } from './types';

/**
 * Search Contacts component.
 */
export function useSearchContact(props: SearchContactProps) {
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
                im.setModelState({
                  tag: searchType,
                  id: data.userId,
                  state: { checked: !data.checked },
                });
              } else if (searchType === 'add-group-member') {
                if (groupId) {
                  im.setModelState({
                    tag: groupId,
                    id: data.userId,
                    state: { checked: !data.checked },
                  });
                }
              }
              setData([...dataRef.current]);
              break;
            }
          }
        }
      }
    },
    [dataRef, groupId, im, searchType, setData]
  );

  const onClickedForwardCallback = React.useCallback(
    (data?: ContactSearchModel) => {
      if (data?.forwarded !== undefined) {
        for (let i = 0; i < dataRef.current.length; i++) {
          const item = dataRef.current[i];
          if (item) {
            if (item.userId === data.userId) {
              dataRef.current[i] = { ...item, forwarded: !data.forwarded };
              setData([...dataRef.current]);
              if (searchType === 'forward-message') {
                im.setModelState({
                  tag: searchType,
                  id: data.userId,
                  state: { forwarded: !data.forwarded },
                });
                onClicked?.(dataRef.current[i]);
              }
              break;
            }
          }
        }
      }
    },
    [dataRef, im, onClicked, searchType, setData]
  );

  const onCancelCallback = React.useCallback(() => {
    if (
      searchType === 'create-group' ||
      searchType === 'add-group-member' ||
      searchType === 'forward-message'
    ) {
      if (onCancel) {
        onCancel([...dataRef.current]);
      }
    } else {
      onCancel?.();
    }
  }, [dataRef, onCancel, searchType]);

  const getNickName = React.useCallback((section: ContactModel) => {
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
      im.getAllContacts2({
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                const getChecked = () => {
                  if (searchType === 'create-group') {
                    return (
                      im.getModelState({
                        tag: searchType,
                        id: item.userId,
                      })?.checked ?? false
                    );
                  } else if (searchType === 'add-group-member') {
                    if (groupId) {
                      const isExisted = im.getGroupMember({
                        groupId,
                        userId: item.userId,
                      });
                      const checked = im.getModelState({
                        tag: groupId,
                        id: item.userId,
                      })?.checked;
                      return (
                        isExisted !== undefined ||
                        (checked !== undefined ? checked : false)
                      );
                    }
                  }
                  return undefined;
                };
                const getForward = () => {
                  if (searchType === 'forward-message') {
                    return (
                      im.getModelState({
                        tag: searchType,
                        id: item.userId,
                      })?.forwarded ?? false
                    );
                  }
                  return false;
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
                  name: getNickName(item),
                  checked: getChecked(),
                  disable: getState(),
                  forwarded: getForward(),
                  onCheckClicked:
                    searchType === 'create-group' ||
                    searchType === 'add-group-member'
                      ? onCheckClickedCallback
                      : undefined,
                  onClickedForward:
                    searchType === 'forward-message'
                      ? onClickedForwardCallback
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

  return {
    ...flatListProps,
    onClicked,
    onCancel: onCancelCallback,
  };
}
