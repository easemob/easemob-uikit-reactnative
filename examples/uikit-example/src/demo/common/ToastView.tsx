import * as React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import {
  ChatEventType,
  SimpleToast,
  SimpleToastRef,
  UIKitError,
  useChatListener,
} from 'react-native-chat-uikit';

import { useOnErrorParser, useOnFinishedParser } from './useToastParser';

export type ToastViewProps = {};
export function ToastView(props: ToastViewProps) {
  const {} = props;
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { parseError } = useOnErrorParser();
  const { parseFinished } = useOnFinishedParser();

  useChatListener(
    React.useMemo(() => {
      return {
        onError: (params: {
          error: UIKitError;
          from?: string;
          extra?: any;
        }) => {
          console.log('ToastViewProps:onError:', JSON.stringify(params));
          const ret = parseError(params.error);
          if (ret) {
            if (Platform.OS === 'ios') {
              toastRef.current.show({
                message: ret,
                timeout: 3000,
              });
            } else {
              ToastAndroid.show(ret, 3000);
            }
          }
        },
        onFinished: (params: { event: ChatEventType; extra?: any }) => {
          console.log('ToastViewProps:onFinished:', params);
          const ret = parseFinished(params.event);
          if (ret) {
            if (Platform.OS === 'ios') {
              toastRef.current.show({
                message: ret,
                timeout: 3000,
              });
            } else {
              ToastAndroid.show(ret, 3000);
            }
          }
        },
      };
    }, [parseError, parseFinished])
  );

  return <SimpleToast propsRef={toastRef} />;
}
