import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Modal, ModalRef } from '../Modal';
import { Text } from '../Text';
import { TextInput } from '../TextInput';
import { useAlert } from './Alert.hooks';
import type { AlertProps } from './types';

export type AlertRef = {
  alert: () => void;
  alertWithInit: (props: AlertProps) => void;
  close: (onFinished?: () => void) => void;
};

export const Alert = React.forwardRef<AlertRef, AlertProps>(
  (props: AlertProps, ref?: React.ForwardedRef<AlertRef>) => {
    const { containerStyle } = props;
    const [value, onChangeText] = React.useState('');
    const modalRef = React.useRef<ModalRef>({} as any);
    const { width: winWidth } = useWindowDimensions();
    const { style: themeStyle } = useThemeContext();
    const { colors } = usePaletteContext();
    const { getColor } = useColors({
      bg: {
        light: colors.neutral[98],
        dark: colors.neutral[1],
      },
      bg2: {
        light: colors.neutral[95],
        dark: colors.neutral[2],
      },
      text: {
        light: colors.neutral[1],
        dark: colors.neutral[98],
      },
    });
    const isShow = React.useRef(false);
    const onRequestModalClose = React.useCallback(() => {
      modalRef?.current?.startHide?.();
    }, []);
    const { props: updatedProps, getButton, onUpdate } = useAlert(props);
    const { buttons, message, title, supportInput = false } = updatedProps;
    const count = buttons?.length ?? 1;
    if (count > 3) {
      throw new UIKitError({
        code: ErrorCode.common,
        desc: 'Alert buttons count must less than 3',
      });
    }

    React.useImperativeHandle(
      ref,
      () => {
        return {
          alert: () => {
            isShow.current = true;
            modalRef?.current?.startShow?.();
          },
          alertWithInit: (props: AlertProps) => {
            isShow.current = true;
            onUpdate(props);
          },
          close: (onFinished) => {
            isShow.current = false;
            modalRef?.current?.startHide?.(onFinished);
          },
        };
      },
      [onUpdate]
    );

    React.useEffect(() => {
      if (isShow.current === true) {
        modalRef?.current?.startShow?.();
      }
    }, [updatedProps]);

    return (
      <Modal
        propsRef={modalRef}
        modalAnimationType={'fade'}
        onRequestModalClose={onRequestModalClose}
        modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View
          style={[
            {
              backgroundColor: getColor('bg'),
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 16,
              borderRadius: 16,
              width: winWidth - 50,
              alignItems: 'center',
            },
            containerStyle,
          ]}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              textType={'large'}
              paletteType={'title'}
              style={{
                color: getColor('text'),
              }}
            >
              {title}
            </Text>
          </View>
          {message ? (
            <>
              <View style={{ height: 12 }} />
              <View style={{ alignItems: 'center' }}>
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  style={{
                    color: getColor('text'),
                  }}
                >
                  {message}
                </Text>
              </View>
            </>
          ) : null}
          <View style={{ height: 24 }} />
          {supportInput === true ? (
            <>
              <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardAppearance={themeStyle === 'light' ? 'light' : 'dark'}
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  borderRadius: 48,
                  height: 48,
                  width: '100%',
                }}
                style={{
                  paddingHorizontal: 20,
                  height: 24,
                }}
              />
              <View style={{ height: 24 }} />
            </>
          ) : null}

          <View
            style={{
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: count === 2 ? 'row' : 'column',
                justifyContent: count === 2 ? 'space-between' : 'center',
                alignItems: count === 2 ? undefined : 'center',
                // backgroundColor: 'red',
                flexGrow: count === 2 ? 1 : undefined,
              }}
            >
              {getButton(buttons, onRequestModalClose)}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
