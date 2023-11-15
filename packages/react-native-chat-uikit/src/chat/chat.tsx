import React from 'react';

import { once2 } from '../utils';
import { getChatService as _getChatService } from './chat.impl';
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
  value: ChatServiceInit & { im?: ChatService };
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
  const { appKey, debugMode, im, onInitialized } = value;
  const _im = im ?? _getChatService();
  initChat(_im, appKey, debugMode, onInitialized);
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

/**
 * Get the built-in single instance IM object.
 * @returns The IM service.
 */
export function getChatService(): ChatService {
  return _getChatService();
}

const initChat = once2(
  (
    im: ChatService,
    appKey: string,
    debugMode: boolean,
    onInitialized?: () => void
  ) => {
    im.init({
      appKey: appKey,
      debugMode: debugMode,
      autoLogin: false,
      result: ({ isOk, error }) => {
        if (isOk === false) {
          if (error) im.sendError({ error: error });
        } else {
          onInitialized?.();
          im.sendFinished({ event: 'undefined' });
        }
      },
    });
  }
);