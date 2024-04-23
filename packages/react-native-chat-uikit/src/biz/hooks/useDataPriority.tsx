import * as React from 'react';
import type { ChatMessage } from 'react-native-chat-sdk';

import { DataModel, useChatContext, userInfoFromMessage } from '../../chat';

export type useDataPriorityProps = {};
export function useDataPriority(props: useDataPriorityProps) {
  const {} = props;
  const im = useChatContext();
  const getContactInfo = React.useCallback(
    (id: string): DataModel => {
      const r1 = im.user(id);
      const r2 = im.getRequestData(id);
      const name =
        r1?.userName && r1.userName.length > 0
          ? r1.userName
          : r2?.name && r2.name.length > 0
          ? r2.name
          : undefined;
      const remark =
        r1?.remark && r1.remark.length > 0
          ? r1.remark
          : r2?.remark && r2.remark.length > 0
          ? r2.remark
          : undefined;
      const avatar =
        r1?.avatarURL && r1.avatarURL.length > 0
          ? r1.avatarURL
          : r2?.avatar && r2.avatar.length > 0
          ? r2.avatar
          : undefined;
      return {
        id: id,
        name: name,
        remark: remark,
        avatar: avatar,
        type: 'user',
      } as DataModel;
    },
    [im]
  );
  const getGroupInfo = React.useCallback(
    (id: string): DataModel => {
      const r2 = im.getRequestData(id);
      return {
        id: id,
        name: r2?.name && r2.name.length > 0 ? r2.name : undefined,
        avatar: r2?.avatar && r2.avatar.length > 0 ? r2.avatar : undefined,
        type: 'group',
      } as DataModel;
    },
    [im]
  );
  const getConvInfo = React.useCallback(
    (id: string, type: number): DataModel => {
      if (type === 0) {
        return getContactInfo(id);
      } else if (type === 1) {
        return getGroupInfo(id);
      } else {
        return {
          id: id,
          type: type === 0 ? 'user' : 'group',
        } as DataModel;
      }
    },
    [getContactInfo, getGroupInfo]
  );
  const getGroupMemberInfo = React.useCallback(
    (id: string) => {
      return getContactInfo(id);
    },
    [getContactInfo]
  );
  const getMsgInfo = React.useCallback(
    (msg: ChatMessage) => {
      const r1 = userInfoFromMessage(msg);
      const r2 = getContactInfo(msg.from);
      const name =
        r2?.name && r2.name.length > 0
          ? r2.name
          : r1?.userName && r1.userName.length > 0
          ? r1.userName
          : undefined;
      const remark =
        r2?.remark && r2.remark.length > 0
          ? r2.remark
          : r1?.remark && r1.remark.length > 0
          ? r1.remark
          : undefined;
      const avatar =
        r2?.avatar && r2.avatar.length > 0
          ? r2.avatar
          : r1?.avatarURL && r1.avatarURL.length > 0
          ? r1.avatarURL
          : undefined;
      return {
        id: msg.from,
        name: name,
        remark: remark,
        avatar: avatar,
        type: 'user',
      } as DataModel;
    },
    [getContactInfo]
  );

  return {
    getContactInfo,
    getGroupInfo,
    getConvInfo,
    getGroupMemberInfo,
    getMsgInfo,
  };
}
