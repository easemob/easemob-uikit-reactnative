import React from 'react';

// import { once2 } from '../utils';
import type { ChatService, ChatServiceInit } from './types';

/**
 * Context of the IM.
 */
export const ChatContext = React.createContext<ChatService | undefined>(
  undefined
);
ChatContext.displayName = 'UIKitIMContext';

/**
 * Properties of the IM context.
 */
type ChatContextProps = React.PropsWithChildren<{
  value: ChatServiceInit;
}>;

/**
 * The IM context's provider.
 *
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
 *
 * For example: if `chat uikit sdk` and `chat uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 *
 * It can only be initialized once. Even if it is initialized multiple times, parameters modified in time will not take effect again. The reason is that `CHAT SDK` uses the native platform.
 */
export function ChatContextProvider({ value, children }: ChatContextProps) {
  const {
    options,
    onInitialized,
    onUsersHandler,
    onGroupsHandler,
    onGetChatService,
  } = value;
  const _getChatService = require('./chatFactory')
    .getChatService as () => ChatService;
  const _im = onGetChatService ? onGetChatService() : _getChatService();
  React.useEffect(() => {
    _im.init({
      options: options,
      result: ({ isOk, error }) => {
        if (isOk === false) {
          if (error) _im.sendError({ error: error });
        } else {
          onInitialized?.(_im);
          _im.sendFinished({ event: 'init' });
        }
      },
    });
    _im.getDataFileProvider().registerUserProfile(onUsersHandler);
    _im.getDataFileProvider().registerGroupProfile(onGroupsHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <ChatContext.Provider value={_im}>{children}</ChatContext.Provider>;
}

/**
 * Get the IM context's value.
 * @returns The IM context's value.
 */
export function useChatContext(): ChatService {
  const im = React.useContext(ChatContext);
  if (!im) throw Error(`${ChatContext.displayName} is not provided`);
  return im;
}
