export * from './getElement';
export * from './useCheckType';
export * from './useColors';
export * from './useCompare';
export * from './useDelayExecTask';
export * from './useForceUpdate';
export * from './useGetObjectName';
export * from './useGetStyleProps';
export * from './useKeyboardHeight';
export * from './useLifecycle';
export * from './usePermissions';

/**
 * Preface
 *
 * Tool collection:
 * 1. `useCheckType`: Check whether the object type is as expected.
 * 2. `useColors`: Simplify the use of theme colors.
 * 3. `useCompare`: Compare whether the objects before and after rendering are the same.
 * 4. `useDelayExecTask`: delayed call. If multiple identical calls are made in a short period of time, they will be merged into one call.
 * 5. `useForceUpdate`: Force component update.
 * 6. `useGetObjectName`: Try to get the name of the component. If it is of other types, it will be parsed accordingly.
 * 7. `useGetStyleProps`: Parse the size in the component properties.
 * 8. `useKeyboardHeight`: Get the keyboard height. Need to be obtained dynamically.
 * 9. `useLifecycle`: Function component life cycle calling tool.
 */
export const HookPreface = 'preface';
