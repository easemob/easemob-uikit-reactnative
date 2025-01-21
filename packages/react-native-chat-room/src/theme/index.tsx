export * from './palette';
export * from './palette.preset';
export * from './theme';
export * from './theme.dark';
export * from './theme.light';
export * from './types';

/**
 * Preface
 *
 * Theme service mainly consists of two parts, `Palette` and `Theme` components. Among them, the `Palette` component is responsible for providing basic color templates, text templates, linear gradient templates, etc. The `Theme` component provides `light` and `dark` modes based on the capabilities provided by the `Palette` component.
 *
 * For details on the `Palette` component, see `palette.tsx`
 *
 * For details on the `Theme` component, see `theme.tsx`
 */
export const ThemePreface = 'Preface';
