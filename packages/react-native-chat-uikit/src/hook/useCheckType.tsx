import * as React from 'react';

import { useGetObjectName } from './useGetObjectName';

type ExpectedType = {};

/**
 * Check whether the object type is as expected.
 *
 * @example
 *
 * ```tsx
 * export function TestComponent({
 *    containerStyle,
 *  }: {
 *    containerStyle?: StyleProp<ViewStyle> | undefined;
 *  }) {
 *    const { getStyleSize } = useGetStyleProps();
 *    const size = getStyleSize(containerStyle);
 *    const { checkType } = useCheckType();
 *    checkType(size.width, 'string');
 *    return (
 *      <View
 *        style={[
 *          { width: 100, height: 100, backgroundColor: 'red' },
 *          containerStyle,
 *        ]}
 *      >
 *        <Text>{'I am a striking color block.'}</Text>
 *      </View>
 *    );
 *  }
 * ```
 */
export function useCheckType(params?: { enabled?: boolean }) {
  const { getObjectName } = useGetObjectName();
  const ret = React.useMemo(() => {
    return {
      checkType: (
        object: any,
        expectedType: ExpectedType,
        others?: { callerName?: string; objectName?: string }
      ) => {
        if (params?.enabled !== true) {
          return;
        }
        const log = `{
          toolName: '${useCheckType.name}',
          callerName: '${others?.callerName ?? useCheckType?.caller?.name}',
          objectName: '${others?.objectName ?? getObjectName(object)}',
          expectedType: '${expectedType}',
          equalResult: '${typeof object === expectedType}',
        }`;
        if (typeof object !== expectedType) {
          console.warn(log);
        } else {
          console.log(log);
        }
      },
    };
  }, [getObjectName, params?.enabled]);
  return ret;
}
