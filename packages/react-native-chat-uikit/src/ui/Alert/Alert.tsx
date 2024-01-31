import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

import { useConfigContext } from '../../config';
import { ErrorCode, UIKitError } from '../../error';
import { useColors, useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { SlideModal, SlideModalRef } from '../Modal';
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
    const modalRef = React.useRef<SlideModalRef>({} as any);
    const { width: winWidth } = useWindowDimensions();
    const { style: themeStyle, cornerRadius: corner } = useThemeContext();
    const { colors, cornerRadius } = usePaletteContext();
    const { getBorderRadius } = useGetStyleProps();
    const { fontFamily } = useConfigContext();
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
      text2: {
        light: colors.neutral[7],
        dark: colors.neutral[6],
      },
    });
    const isShow = React.useRef(false);
    const onRequestModalClose = React.useCallback(() => {
      modalRef?.current?.startHide?.();
    }, []);
    const {
      props: updatedProps,
      getButton,
      onUpdate,
      value,
      onChangeText,
      setTextCount,
      textCount,
    } = useAlert(props);
    const {
      buttons,
      message,
      title,
      supportInput = false,
      supportInputStatistics,
      inputMaxCount,
      isSaveInput = true,
      enableClearButton = false,
      autoFocus,
    } = updatedProps;
    const count = buttons?.length ?? 1;
    if (count > 3) {
      throw new UIKitError({
        code: ErrorCode.max_count,
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
            if (isSaveInput === false) {
              onChangeText?.('');
            }
            modalRef?.current?.startHide?.(onFinished);
          },
        };
      },
      [isSaveInput, onChangeText, onUpdate]
    );

    React.useEffect(() => {
      if (isShow.current === true) {
        modalRef?.current?.startShow?.();
      }
    }, [updatedProps]);

    return (
      <SlideModal
        propsRef={modalRef}
        modalAnimationType={'fade'}
        onRequestModalClose={onRequestModalClose}
        modalStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        enableSlideComponent={false}
        enabledKeyboardAdjust={true}
      >
        <View
          style={[
            {
              backgroundColor: getColor('bg'),
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 16,
              borderRadius: getBorderRadius({
                height: 32,
                crt: corner.alert,
                cr: cornerRadius,
                style: containerStyle,
              }),
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
            <View
              style={{
                width: '100%',
                minHeight: supportInputStatistics === true ? 48 + 22 : 48,
                paddingBottom: supportInputStatistics === true ? 22 : undefined,
                backgroundColor: getColor('bg2'),
                justifyContent: 'center',
              }}
            >
              <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardAppearance={themeStyle === 'light' ? 'light' : 'dark'}
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  // borderRadius: getBorderRadius({
                  //   height: 48,
                  //   crt: corner.input,
                  //   cr: cornerRadius,
                  //   style: containerStyle,
                  // }),
                  // minHeight: 48,
                  width: '100%',
                  minHeight: 36,
                  paddingVertical: 7,
                  maxHeight: Platform.OS === 'ios' ? 96 : 96,
                }}
                style={{
                  paddingHorizontal: 20,
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: 22,
                  fontFamily: fontFamily,
                }}
                numberOfLines={4}
                multiline={true}
                unitHeight={Platform.OS === 'ios' ? 24 : 22}
                statistics={
                  supportInputStatistics === true
                    ? {
                        count: textCount,
                        maxCount: inputMaxCount ?? 200,
                        onCountChange: setTextCount,
                        textStyles: {
                          color: getColor('text2'),
                          paddingRight: 12,
                        },
                      }
                    : undefined
                }
                enableClearButton={enableClearButton}
                autoFocus={autoFocus}
              />
            </View>
          ) : null}

          {supportInput === true ? <View style={{ height: 24 }} /> : null}

          <View
            style={{
              width: '100%',
              minHeight: 1,
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
      </SlideModal>
    );
  }
);
