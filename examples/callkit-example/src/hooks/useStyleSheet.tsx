import { useColors, usePaletteContext } from '../rename.uikit';

export const useStyleSheet = (): { safe: any } => {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return {
    safe: { flex: 1, backgroundColor: getColor('bg') },
  };
};
