import { useColors, usePaletteContext } from 'react-native-chat-uikit';

export function useBackgroundColor() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return {
    getBackgroundColor: getColor,
  };
}
