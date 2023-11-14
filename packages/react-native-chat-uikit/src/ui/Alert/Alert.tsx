import * as React from 'react';
import { AlertButton, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { BorderButton, CmnButton } from '../Button';
import { Modal, ModalRef } from '../Modal';
import { Text } from '../Text';
import { TextInput } from '../TextInput';

export type AlertRef = {
  alert: () => void;
  close: (onFinished?: () => void) => void;
};
export type AlertProps = {
  title: string;
  message?: string;
  buttons?: Omit<AlertButton, 'isPreferred'>[];
  supportInput?: boolean;
};
export const Alert = React.forwardRef<AlertRef, AlertProps>(
  (props: AlertProps, ref?: React.ForwardedRef<AlertRef>) => {
    const { title, message, buttons, supportInput = false } = props;
    const count = buttons?.length ?? 1;
    const [value, onChangeText] = React.useState('');
    const modalRef = React.useRef<ModalRef>({} as any);
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
    const getButton = () => {
      if (buttons) {
        const list = buttons.map((v, i) => {
          if (i < count - 1) {
            return (
              <BorderButton
                key={i}
                sizesType={'large'}
                radiusType={'large'}
                contentType={'only-text'}
                onPress={() => v.onPress?.(v.text)}
                text={v.text}
                style={{
                  height: 48,
                  width: count < 3 ? undefined : 308,
                }}
              />
            );
          }
          return (
            <CmnButton
              key={i}
              sizesType={'large'}
              radiusType={'large'}
              contentType={'only-text'}
              onPress={() => v.onPress?.(v.text)}
              text={v.text}
              style={{ height: 48 }}
            />
          );
        });
        const ret = [] as JSX.Element[];
        if (count < 3) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element) {
              ret.push(element);
              if (index < list.length - 1) {
                ret.push(<View key={count + index} style={{ width: 16 }} />);
              }
            }
          }
        } else {
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element) {
              ret.push(element);
              if (index < list.length - 1) {
                ret.push(<View key={count + index} style={{ height: 16 }} />);
              }
            }
          }
        }

        return ret;
      }

      return [
        <CmnButton
          key={99}
          sizesType={'large'}
          radiusType={'large'}
          contentType={'only-text'}
          onPress={onRequestModalClose}
          text={'Confirm'}
          style={{ height: 48 }}
        />,
      ];
    };
    const onRequestModalClose = React.useCallback(() => {
      modalRef?.current?.startHide?.();
    }, []);
    React.useImperativeHandle(
      ref,
      () => {
        return {
          alert: () => {
            modalRef?.current?.startShow?.();
          },
          close: (onFinished) => {
            modalRef?.current?.startHide?.(onFinished);
          },
        };
      },
      []
    );
    return (
      <Modal
        propsRef={modalRef}
        modalAnimationType={'fade'}
        onRequestModalClose={onRequestModalClose}
        modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View
          style={{
            backgroundColor: getColor('bg'),
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            borderRadius: 16,
          }}
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
                  borderRadius: 18,
                  height: 36,
                }}
                style={{
                  paddingHorizontal: 20,
                }}
              />
              <View style={{ height: 24 }} />
            </>
          ) : null}

          <View>
            <View
              style={{
                flexDirection: count < 3 ? 'row' : 'column',
                // justifyContent: 'space-evenly',
              }}
            >
              {getButton()}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
