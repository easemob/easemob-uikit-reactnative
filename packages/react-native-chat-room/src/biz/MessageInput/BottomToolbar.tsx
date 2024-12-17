import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import {
  gInputBarStyleHeight,
  gInputBarStyleItemHeight,
} from './MessageInput.const';

/**
 * Properties of the `BottomToolbar` component.
 */
export type BottomToolbarProps = {
  /**
   * Callback function when the input box is clicked.
   */
  onClickInput: () => void;
  /**
   * Custom component in front of input component
   */
  first?: React.ReactNode;
  /**
   * Custom component list after input component
   */
  after?: React.ReactNode[];
  /**
   * Callback function when the layout changes.
   */
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  /**
   * Whether to display the input box style
   */
  isShow?: boolean;
};

/**
 * Input style components. Custom buttons can be added to implement custom events. For example: add a gift button and display the gift list when the gift button is clicked.
 * @param props {@link BottomToolbarProps}
 * @returns JSX.Element
 */
export function BottomToolbar(props: BottomToolbarProps) {
  const { onClickInput, first, after, onLayout, isShow } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.barrage.onLight[2],
      dark: colors.barrage.onDark[1],
    },
    tintColor: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const { tr } = useI18nContext();

  if (after && after?.length > 3) {
    throw new UIKitError({ code: ErrorCode.params, extra: 'after count > 3' });
  }

  return (
    <View
      style={[
        styles.container,
        {
          // paddingBottom: bottom,
          // marginBottom: bottom,
          display: isShow === true ? 'flex' : 'none',
        },
      ]}
      onLayout={onLayout}
    >
      {first ? <View style={styles.button}>{first}</View> : null}

      <View
        style={[
          styles.input,
          {
            backgroundColor: getColor('backgroundColor'),
          },
        ]}
        onTouchEnd={() => {
          onClickInput();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}
        >
          <Icon
            name={'bubble_fill'}
            style={{
              width: 20,
              height: 20,
              tintColor: getColor('tintColor'),
            }}
          />
          <View style={{ width: 4 }} />
          <Text
            paletteType="body"
            textType="large"
            style={{
              color: getColor('tintColor'),
            }}
          >
            {tr("Let's Chat!")}
          </Text>
        </View>
      </View>

      {after?.map((v, i) => {
        return (
          <View key={i} style={styles.button}>
            {v}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: gInputBarStyleHeight,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  button: {
    height: gInputBarStyleItemHeight,
    width: gInputBarStyleItemHeight,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    height: gInputBarStyleItemHeight,
    borderRadius: 38,
    marginHorizontal: 12,
  },
});
