import type { UIKitError } from 'react-native-chat-uikit';

export function useOnFinishedParser() {
  const parseFinished = (eventType: string) => {
    return eventType;
  };
  return {
    parseFinished,
  };
}

export function useOnErrorParser() {
  const parseError = (error: UIKitError) => {
    return error.toString();
  };
  return {
    parseError,
  };
}
