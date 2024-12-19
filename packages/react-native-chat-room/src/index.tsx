import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-chat-room' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ChatRoom = NativeModules.ChatRoom
  ? NativeModules.ChatRoom
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return ChatRoom.multiply(a, b);
}

export * from './assets';
export * from './biz/Avatar';
export * from './biz/BottomSheetMenu';
export * from './biz/Chatroom';
export * from './biz/EmojiList';
export * from './biz/GiftIcon';
export * from './biz/GiftList';
export * from './biz/GiftMessageList';
export * from './biz/GlobalBroadcast';
export * from './biz/MessageInput';
export * from './biz/MessageList';
export * from './biz/MessagePin';
export * from './biz/MessageReport';
export * from './biz/ParticipantList';
export * from './biz/Placeholder';
export * from './biz/types';
export * from './config';
export * from './container';
export * from './dispatch';
export * from './error';
export * from './hook';
export * from './i18n';
export * from './rename.chat';
export * from './room';
export * from './theme';
export * from './ui/Alert';
export * from './ui/Button';
export * from './ui/FlatList';
export * from './ui/Image';
export * from './ui/Keyboard';
export * from './ui/Modal';
export * from './ui/Switch';
export * from './ui/TabPage';
export * from './ui/Text';
export * from './ui/TextInput';
export * from './ui/Toast';
export * from './utils';
