import * as React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import {
  ChatEventType,
  UIKitError,
  useChatListener,
  useSimpleToastContext,
} from 'react-native-chat-uikit';

import { useOnErrorParser, useOnFinishedParser } from '../hooks/useToastParser';

export type ToastViewProps = {};
export function ToastView(props: ToastViewProps) {
  const {} = props;
  useSimpleToast();
  return <></>;
  // const toastRef = React.useRef<SimpleToastRef>({} as any);
  // const { parseError } = useOnErrorParser();
  // const { parseFinished } = useOnFinishedParser();

  // useChatListener(
  //   React.useMemo(() => {
  //     return {
  //       onError: (params: {
  //         error: UIKitError;
  //         from?: string;
  //         extra?: any;
  //       }) => {
  //         console.log('ToastViewProps:onError:', JSON.stringify(params));
  //         const ret = parseError(params.error);
  //         if (ret) {
  //           if (Platform.OS === 'ios') {
  //             toastRef.current.show({
  //               message: ret,
  //               timeout: 1000,
  //             });
  //           } else {
  //             ToastAndroid.show(ret, 1000);
  //           }
  //         }
  //       },
  //       onFinished: (params: { event: ChatEventType; extra?: any }) => {
  //         console.log('ToastViewProps:onFinished:', params);
  //         const ret = parseFinished(params.event);
  //         if (ret) {
  //           if (Platform.OS === 'ios') {
  //             toastRef.current.show({
  //               message: ret,
  //               timeout: 1000,
  //             });
  //           } else {
  //             ToastAndroid.show(ret, 1000);
  //           }
  //         }
  //       },
  //     };
  //   }, [parseError, parseFinished])
  // );

  // return <SimpleToast propsRef={toastRef} />;
}

function useSimpleToast() {
  const { parseError } = useOnErrorParser();
  const { parseFinished } = useOnFinishedParser();
  const { getSimpleToastRef } = useSimpleToastContext();
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
              getSimpleToastRef().show({
                message: ret,
                timeout: 1000,
              });
            } else {
              ToastAndroid.show(ret, 1000);
            }
          }
        },
        onFinished: (params: { event: ChatEventType; extra?: any }) => {
          console.log('ToastViewProps:onFinished:', params);
          const ret = parseFinished(params.event);
          if (ret) {
            if (Platform.OS === 'ios') {
              getSimpleToastRef().show({
                message: ret,
                timeout: 1000,
              });
            } else {
              ToastAndroid.show(ret, 1000);
            }
          }
        },
      };
    }, [getSimpleToastRef, parseError, parseFinished])
  );
}
