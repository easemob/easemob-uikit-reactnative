import * as React from 'react';
import { ColorValue, View } from 'react-native';

import { useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';

type DelButtonProps = {
  getColor: (key: string) => ColorValue | undefined;
  emojiHeight: number;
  onClicked: () => void;
};
export function DelButton(params: DelButtonProps) {
  const { getColor, emojiHeight, onClicked } = params;
  const { shadow } = useThemeContext();
  const b = (
    <View
      style={{
        //  WARN  (ADVICE) View #3647 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
        // backgroundColor: getColor('backgroundColor'),
        ...shadow.style.small[0],
      }}
    >
      <View
        style={{
          //  WARN  (ADVICE) View #3645 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
          // backgroundColor: getColor('backgroundColor'),
          ...shadow.style.small[1],
        }}
      >
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            backgroundColor: getColor('backgroundColor'),
            borderRadius: 40,
          }}
        >
          <IconButton
            iconName={'arrow_left_thick'}
            style={{
              width: 40,
              height: 40,
            }}
            onPress={onClicked}
            frequencyInterval={200}
          />
        </View>
      </View>
    </View>
  );
  if (emojiHeight === 0) {
    return null;
  }
  return b;
}

const DelButtonCompare = (
  prevProps: Readonly<DelButtonProps>,
  nextProps: Readonly<DelButtonProps>
) => {
  if (prevProps.emojiHeight !== nextProps.emojiHeight) {
    return false;
  }
  return true;
};

export const DelButtonMemo = React.memo(DelButton, DelButtonCompare);
