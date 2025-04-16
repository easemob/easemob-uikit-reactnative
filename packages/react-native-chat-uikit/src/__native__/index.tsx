import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-chat-uikit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
export const isTurboModuleEnabled = global.__turboModuleProxy != null;

try {
  console.log('isTurboModuleEnabled', isTurboModuleEnabled);
  console.log('NativeModules', NativeModules, Object.keys(NativeModules));
  console.log('NativeModules.ChatUikit', NativeModules.ChatUikit);
  console.log('ChatUikitModule', require('./NativeChatUikit').default);
} catch (e) {
  console.log('ChatUikitModule', e);
}

const ChatUikitModule = isTurboModuleEnabled
  ? require('./NativeChatUikit').default
  : NativeModules.ChatUikit;

export const ChatUikitModuleRN = ChatUikitModule
  ? ChatUikitModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const eventEmitter = new NativeEventEmitter(ChatUikitModuleRN);

export function multiply(a: number, b: number): number {
  return ChatUikitModuleRN.multiply(a, b);
}
