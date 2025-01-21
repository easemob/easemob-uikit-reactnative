import type { UIKitError } from '../error';

export type PropsWithTest = { testMode?: 'only-ui' | undefined };
export type PropsWithError = { onError?: (error: UIKitError) => void };
