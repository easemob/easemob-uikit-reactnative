import * as React from 'react';
import type { ChatMultiDeviceEvent } from 'react-native-chat-sdk';
import {
  ChatServiceListener,
  DataModel,
  DataModelType,
  getChatService,
  UIGroupListListener,
  UIKitError,
  UIListenerType,
} from 'react-native-chat-uikit';

export function useApp() {
  const im = getChatService();
  const list = React.useRef<Map<string, DataModel>>(new Map());

  const onRequestMultiData = React.useCallback(
    (params: {
      ids: Map<DataModelType, string[]>;
      result: (
        data?: Map<DataModelType, DataModel[]>,
        error?: UIKitError
      ) => void;
    }) => {
      const userIds = params.ids.get('user');
      const noExistedIds = [] as string[];
      userIds?.forEach((id) => {
        const isExisted = list.current.get(id);
        if (isExisted && isExisted.avatar && isExisted.name) return;
        noExistedIds.push(id);
      });
      const users = noExistedIds?.map<DataModel>((id) => {
        return {
          id,
          name: id + 'name',
          // avatar: 'https://i.pravatar.cc/300',
          avatar:
            'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
          type: 'user' as DataModelType,
        };
      });
      const groupIds = params.ids.get('group');
      const noExistedGroupIds = [] as string[];
      groupIds?.forEach((id) => {
        const isExisted = list.current.get(id);
        if (isExisted && isExisted.avatar && isExisted.name) return;
        noExistedGroupIds.push(id);
      });
      const groups = noExistedGroupIds?.map<DataModel>((id) => {
        return {
          id,
          name: id + 'name',
          avatar:
            'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
          type: 'group' as DataModelType,
        };
      });
      for (const user of users ?? []) {
        const isExisted = list.current.get(user.id);
        list.current.set(user.id, isExisted ? { ...user, ...isExisted } : user);
      }
      for (const group of groups ?? []) {
        const isExisted = list.current.get(group.id);
        list.current.set(
          group.id,
          isExisted
            ? {
                ...group,
                ...isExisted,
                avatar: isExisted.avatar ?? group.avatar,
              }
            : group
        );
      }
      const finalUsers = userIds?.map<DataModel>((id) => {
        return list.current.get(id) as DataModel;
      });
      const finalGroups = groupIds?.map<DataModel>((id) => {
        return list.current.get(id) as DataModel;
      });
      params?.result(
        new Map([
          ['user', finalUsers ?? []],
          ['group', finalGroups ?? []],
        ])
      );
    },
    []
  );

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onUpdatedEvent: (data) => {
        const isExisted = list.current.get(data.groupId);
        if (isExisted) {
          if (data.groupName) {
            isExisted.name = data.groupName;
          }
        }
      },
      onAddedEvent: (data) => {
        const isExisted = list.current.get(data.groupId);
        if (isExisted) {
          if (data.groupName) {
            isExisted.name = data.groupName;
          }
        }
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [im]);

  const listenerRef = React.useRef<ChatServiceListener>({
    onDetailChanged: (group) => {
      const isExisted = list.current.get(group.groupId);
      if (isExisted) {
        if (group.groupName) {
          isExisted.name = group.groupName;
        }
      }
    },
    onGroupEvent: (
      _event?: ChatMultiDeviceEvent,
      _target?: string,
      _usernames?: Array<string>
    ): void => {},
  });
  React.useEffect(() => {
    const listener = listenerRef.current;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im]);

  return {
    onRequestMultiData,
  };
}
