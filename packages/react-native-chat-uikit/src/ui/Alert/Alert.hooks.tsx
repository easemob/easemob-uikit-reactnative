import * as React from 'react';
import { AlertButton, View } from 'react-native';

import { useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { BorderButton, CmnButton } from '../Button';
import type { AlertProps } from './types';

export function useAlert(props: AlertProps) {
  const { containerStyle } = props;
  const [_props, setProps] = React.useState(props);
  const { cornerRadius: corner } = useThemeContext();
  const { cornerRadius } = usePaletteContext();
  const { getBorderRadius } = useGetStyleProps();
  const getButton = (
    buttons: AlertButton[] | undefined,
    onRequestModalClose: () => void
  ) => {
    const count = buttons?.length ?? 1;
    const _getButton = (
      Button: typeof BorderButton | typeof CmnButton,
      v: AlertButton,
      i: number
    ) => {
      return (
        <Button
          key={i}
          sizesType={'large'}
          radiusType={'large'}
          contentType={'only-text'}
          onPress={() => v.onPress?.(v.text)}
          text={v.text}
          style={{
            height: 48,
            width: count === 2 ? '48%' : '100%',
            borderRadius: getBorderRadius({
              height: 48,
              crt: corner.input,
              cr: cornerRadius,
              style: containerStyle,
            }),
          }}
        />
      );
    };
    if (buttons) {
      const list = buttons.map((v, i) => {
        const Button = v.isPreferred !== true ? BorderButton : CmnButton;
        return _getButton(Button, v, i);
      });
      const ret = [] as JSX.Element[];
      if (count < 3) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          if (element) {
            ret.push(element);
            // if (index < list.length - 1) {
            //   ret.push(<View key={count + index} style={{ width: 16 }} />);
            // }
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
      _getButton(
        CmnButton,
        { text: 'Confirm', onPress: onRequestModalClose },
        99
      ),
    ];
  };
  const onUpdate = (props: AlertProps) => {
    setProps({ ...props });
  };
  return {
    getButton,
    onUpdate,
    props: _props,
  };
}
