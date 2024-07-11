import * as React from 'react';
import type { GestureResponderHandlers, ViewProps } from 'react-native';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';

export type ModalType = 'simu-modal' | 'modal';
export type SlideProps = ViewProps &
  GestureResponderHandlers & { modalType: ModalType };
export const DefaultSlide = (props: SlideProps) => {
  if (props.modalType === 'simu-modal') {
    return <Internal {...props} />;
  } else {
    return (
      <Pressable>
        <Internal {...props} />
      </Pressable>
    );
  }
};
const Internal = (props: SlideProps) => {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg3: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
  });
  return (
    <View
      style={[
        {
          height: 32,
          width: '100%',
          backgroundColor: getColor('bg'),
          alignItems: 'center',
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          transform: [{ translateY: 15 }],
        },
      ]}
      {...props}
    >
      <View
        style={{
          width: 36,
          height: 5,
          marginTop: 6,
          backgroundColor: getColor('bg3'),
          borderRadius: 2.5,
        }}
      />
    </View>
  );
};
