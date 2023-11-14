export class Sequence {
  static aa = new Map<string, number>();
  static sequenceId(key: string): number {
    const r = Sequence.aa.get(key);
    let c = 0;
    if (r === undefined) {
      c = 1;
    } else {
      c = r + 1;
      if (c > 65535) {
        c = 1;
      }
    }
    Sequence.aa.set(key, c);
    return c;
  }
}

/**
 * Generate a sequence id.
 * @ref https://beta.reactjs.org/apis/react/useId#useid
 * @returns id
 */
export function seqId(key = '_global'): number {
  return Sequence.sequenceId(key);
}
