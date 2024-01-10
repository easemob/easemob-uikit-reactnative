import * as React from 'react';

import { timeoutTask } from '../../utils';
import type { Deleter, MessageApi, MessageInit } from './types';

/**
 * Context of the Message.
 */
export const MessageContext = React.createContext<MessageApi | undefined>(
  undefined
);
MessageContext.displayName = 'UIKitMessageContext';

/**
 * Properties of the Message context.
 */
type MessageContextProps = React.PropsWithChildren<{ value: MessageInit }>;

/**
 * The Message context's provider.
 */
export function MessageContextProvider({
  value,
  children,
}: MessageContextProps) {
  const {} = value;
  const _value = React.useMemo(() => {
    const _list = new Map<string, { userName?: string; userAvatar?: string }>();
    const _listeners = new Set<Function>();
    return {
      addListener: (
        onUpdateUserInfo: (params: {
          userId: string;
          userName?: string;
          userAvatar?: string;
        }) => void
      ): Deleter => {
        _listeners.add(onUpdateUserInfo);
        const deleter = () => {
          _listeners.delete(onUpdateUserInfo);
        };
        return deleter;
      },
      getUserInfo: (
        userId: string
      ): { userName?: string; userAvatar?: string } | undefined => {
        return _list.get(userId);
      },
      dispatchUserInfo: (params: {
        userId: string;
        userName?: string;
        userAvatar?: string;
      }): void => {
        _list.set(params.userId, {
          userName: params.userName,
          userAvatar: params.userAvatar,
        });
        timeoutTask(0, () => {
          _listeners.forEach((listener) => {
            listener(params);
          });
        });
      },
    } as MessageApi;
  }, []);
  return (
    <MessageContext.Provider value={_value}>{children}</MessageContext.Provider>
  );
}

/**
 * Get the Message context's value.
 * @returns The Message context's value.
 */
export function useMessageContext(): MessageApi {
  const msg = React.useContext(MessageContext);
  if (!msg) throw Error(`${MessageContext.displayName} is not provided`);
  return msg;
}
