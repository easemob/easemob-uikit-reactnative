import * as React from 'react';
import { View } from 'react-native';

import { useMessagePin } from './MessagePin.hook';
import { MessagePinItem } from './MessagePin.item';
import { MessagePinProps, MessagePinRef } from './types';

export const MessagePin = React.forwardRef<MessagePinRef, MessagePinProps>(
  (props: MessagePinProps, ref?: React.ForwardedRef<MessagePinRef>) => {
    const { visible = true } = props;
    const {
      isShow,
      popTask,
      pushTask,
      id,
      msgRef,
      tagRef,
      avatarRef,
      nicknameRef,
      init,
    } = useMessagePin(props);

    React.useImperativeHandle(
      ref,
      () => {
        return {
          init: () => {
            init();
          },
          pushTask: (task) => {
            pushTask(task);
          },
          popTask: () => {
            popTask();
          },
        };
      },
      [init, popTask, pushTask]
    );

    return (
      <View
        style={[
          {
            // flex: 1,
            // flexShrink: 1,
            display: visible === true && isShow === true ? 'flex' : 'none',
          },
        ]}
      >
        <MessagePinItem
          {...props}
          id={id ?? ''}
          msg={msgRef.current}
          avatar={avatarRef.current}
          nickname={nicknameRef.current}
          tag={tagRef.current}
        />
      </View>
    );
  }
);

export type MessagePinComponent = typeof MessagePin;
