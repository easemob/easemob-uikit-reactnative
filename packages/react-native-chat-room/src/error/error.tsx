import type { ErrorCode } from './code';
import type { ErrorDescription } from './desc';
import { getDescription } from './error.impl';

/**
 * Error Object.
 *
 * The object can be returned to the user through a callback method or by throwing.
 */
export class UIKitError extends Error {
  code: ErrorCode;
  desc: ErrorDescription | string;
  /**
   * Constructor of UIKitError.
   * @params
   * - code: {@link ErrorCode}
   * - desc: {@link ErrorDescription}
   * - extra: string
   * - options: {@link ErrorOptions}
   */
  constructor(params: {
    code: ErrorCode;
    desc?: string;
    extra?: string;
    options?: ErrorOptions;
  }) {
    super(params.extra, params.options);
    this.code = params.code;
    this.desc = params.desc ?? getDescription(this.code);

    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, UIKitError);
    // } else {
    //   this.stack = new Error(this.toString()).stack;
    // }
    // console.log(this.stack);
  }

  /**
   * Format `UIKitError` object.
   * @returns `UIKitError` of type string.
   */
  public toString(): string {
    return `code: ${this.code}\n
    desc: ${this.desc}\n
    extra: ${this.message}`;
  }
}
