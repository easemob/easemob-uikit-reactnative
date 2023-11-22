import * as React from 'react';
import { AlertButton, View } from 'react-native';

import { BorderButton, CmnButton } from '../Button';
import type { AlertProps } from './types';

export function useAlert(props: AlertProps) {
  const [_props, setProps] = React.useState(props);
  const getButton = (
    buttons: Omit<AlertButton, 'isPreferred'>[] | undefined,
    onRequestModalClose: () => void
  ) => {
    const count = buttons?.length ?? 1;
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
  const onUpdate = (props: AlertProps) => {
    setProps({ ...props });
  };
  return {
    getButton,
    onUpdate,
    props: _props,
  };
}
