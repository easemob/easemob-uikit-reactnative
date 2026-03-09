import { ChatServiceImpl } from './chat.impl';
import type { ChatService } from './types';

/**
 * Get the built-in single instance IM object.
 * @returns The IM service.
 */
export function getChatService(): ChatService {
  return getChatServiceImpl();
}

let gIMService: ChatService;
export function getChatServiceImpl(): ChatService {
  if (gIMService === undefined) {
    gIMService = new ChatServiceImpl();
  }
  return gIMService;
}
