import {
  ChatService,
  ChatServiceImpl,
  ResultCallback,
} from '../../rename.uikit';
import { RestApi } from './rest.api';

class ChatServiceDemo extends ChatServiceImpl {
  constructor() {
    super();
  }

  override addNewContact(params: {
    userId: string;
    reason?: string;
    onResult?: ResultCallback<void>;
  }): void {
    const processAsync = async () => {
      const chatUserName = await this.client.getCurrentUsername();
      const userToken = await this.client.getAccessToken();
      RestApi.requestGetUserByPhone({
        phone: params.userId,
        chatUserName: chatUserName ?? '',
        userToken: userToken ?? '',
      })
        .then((result) => {
          if (result.isOk || result.value?.code === 200) {
            super.addNewContact(
              params && ({ userId: result.value?.chatUserName } as any)
            );
          } else {
            params.onResult?.({ isOk: false, error: result.error });
          }
        })
        .catch((error) => {
          params.onResult?.({ isOk: false, error });
        });
    };
    processAsync();
  }
}

let chatServiceDemo: ChatServiceDemo | null = null;

export function getChatServiceDemo(): ChatService {
  if (!chatServiceDemo) {
    chatServiceDemo = new ChatServiceDemo();
  }
  return chatServiceDemo;
}
