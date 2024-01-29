import * as React from 'react';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import type { IconNameType } from '../../assets';
import { g_border_bottom_width } from '../../const';
import { useDispatchContext } from '../../dispatch';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon, IconResolutionType } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { gItemHeight } from './BottomSheetMenu.const';

type ButtonInitState = 'enabled' | 'disabled' | 'warned';
type ButtonState = 'disabled' | 'enabled' | 'pressed' | 'warned';

export type BottomSheetMenuItemProps = {
  /**
   * suggestion: seqId('_bsm').toString()
   */
  id: string;
  initState: ButtonInitState;
  text: string;
  iconName?: IconNameType;
  onPress?: () => void;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
  iconResolution?: IconResolutionType;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function BottomSheetMenuItem(props: BottomSheetMenuItemProps) {
  const {
    id,
    initState,
    iconName,
    onPress,
    preventHighFrequencyClicks,
    frequencyInterval,
    containerStyle,
  } = props;
  const clicked = React.useRef(false);
  const { colors } = usePaletteContext();
  const { emit } = useDispatchContext();
  const { getColor } = useColors({
    disabled: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    enabled: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    pressed: {
      light: colors.neutral[95],
      dark: colors.neutral[0],
    },
  });
  const disabled = initState === 'disabled' ? true : false;

  const onPressInternal = () => {
    if (preventHighFrequencyClicks === true) {
      if (onPress) {
        if (clicked.current === false) {
          setTimeout(() => {
            clicked.current = false;
          }, frequencyInterval);
          clicked.current = true;
          onPress?.();
        }
      }
    } else {
      onPress?.();
    }
  };

  const onChangeStateColor = (
    state: PressableStateCallbackType
  ): StyleProp<ViewStyle> => {
    let buttonColors;
    if (state.pressed === true) {
      buttonColors = getColor('pressed');
      emit(
        `_$${ItemContent.name}`,
        initState === 'warned' ? 'warned' : 'pressed',
        id
      );
    } else {
      if (disabled === true) {
        buttonColors = getColor('disabled');
        emit(`_$${ItemContent.name}`, 'disabled', id);
      } else {
        buttonColors = getColor('enabled');
        emit(
          `_$${ItemContent.name}`,
          initState === 'warned' ? 'warned' : 'enabled',
          id
        );
      }
    }
    return [
      {
        backgroundColor: buttonColors,
        justifyContent: iconName ? 'flex-start' : 'center',
        alignItems: 'center',
        height: gItemHeight,
        width: '100%',
      },
      containerStyle,
    ];
  };

  return (
    <Pressable
      key={id}
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        return onChangeStateColor(state);
      }}
    >
      <ItemContent {...props} />
      <ItemDivider />
    </Pressable>
  );
}

const ItemDivider = () => {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    borderBottomColor: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
  });
  return (
    <View
      style={{
        width: '80%',
        borderBottomColor: getColor('borderBottomColor'),
        borderBottomWidth: g_border_bottom_width,
        justifyContent: 'flex-end',
      }}
    />
  );
};

const ItemContent = (props: BottomSheetMenuItemProps) => {
  const {
    initState,
    text,
    iconName,
    iconResolution,
    id: pid,
    textStyle,
  } = props;

  const { colors } = usePaletteContext();
  const { addListener, removeListener } = useDispatchContext();
  const { getColor } = useColors({
    disabled: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    enabled: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    pressed: {
      light: colors.primary[4],
      dark: colors.primary[6],
    },
    warned: {
      light: colors.error[5],
      dark: colors.error[6],
    },
  });

  const disabled = initState === 'disabled' ? true : false;
  const warned = initState === 'warned' ? true : false;

  const [buttonState, setButtonState] = React.useState<ButtonState>(
    disabled === true ? 'disabled' : warned === true ? 'warned' : 'enabled'
  );

  React.useEffect(() => {
    const listener = (state: ButtonState, id: string) => {
      if (id === pid) {
        setButtonState(state);
      }
    };
    addListener(`_$${ItemContent.name}`, listener);
    return () => {
      removeListener(`_$${ItemContent.name}`, listener);
    };
  }, [addListener, removeListener, pid]);

  const getContentText = () => {
    return (
      <Text
        paletteType={'body'}
        textType={'large'}
        style={[{ color: getColor(buttonState) }, textStyle]}
      >
        {text}
      </Text>
    );
  };

  if (iconName) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            alignItems: 'center',
            paddingLeft: 16,
          }}
        >
          <Icon
            name={iconName}
            style={[
              {
                tintColor: getColor(buttonState),
                height: 22,
                width: 22,
              },
            ]}
            resolution={iconResolution}
          />
          <View style={{ width: 2 }} />
          {getContentText()}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {getContentText()}
      </View>
    );
  }
};
