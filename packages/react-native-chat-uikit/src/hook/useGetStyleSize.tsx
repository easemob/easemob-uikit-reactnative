import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

type SizeType = {
  height?: number | string | undefined;
  width?: number | string | undefined;
};
/**
 * Parse the size in the component properties.
 * @example
 *
 * ```tsx
 * const { getViewStyleSize } = useGetStyleSize();
 * const { width: propsWidth } = getViewStyleSize(containerStyle);
 * const { checkType } = useCheckType();
 * if (propsWidth) {
 *   checkType(propsWidth, 'number');
 * }
 * const getUnitSize = () => {
 *   if (propsWidth) {
 *     return (propsWidth as number) / countPerRow - 1;
 *   }
 *   return winWidth / countPerRow - 1;
 * };
 * ```
 */
export function useGetStyleSize() {
  const ret = React.useMemo(() => {
    return {
      getViewStyleSize: (styles?: StyleProp<ViewStyle>) => {
        const s = styles as any;
        return {
          height: s?.height,
          width: s?.width,
        } as SizeType;
      },
    };
  }, []);
  return ret;
}
