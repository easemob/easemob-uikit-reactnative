import type { Colors } from './types';

export type HSLA = {
  h: number;
  s: string;
  l: string;
  a: string;
};

function generateColor(hsla: HSLA): string {
  const { h, s, l, a } = hsla;
  return `hsla(${h}, ${s}, ${l}, ${a})`;
}

/**
 * Generate the hsla format color group based on hue color.
 *
 * @param hue [0 - 360].
 * @returns color array.
 */
export function generatePrimaryColor(hue: number): Colors {
  return {
    0: generateColor({ h: hue, s: '100%', l: '0%', a: '1.0' }),
    1: generateColor({ h: hue, s: '100%', l: '10%', a: '1.0' }),
    2: generateColor({ h: hue, s: '100%', l: '20%', a: '1.0' }),
    3: generateColor({ h: hue, s: '100%', l: '30%', a: '1.0' }),
    4: generateColor({ h: hue, s: '100%', l: '40%', a: '1.0' }),
    5: generateColor({ h: hue, s: '100%', l: '50%', a: '1.0' }),
    6: generateColor({ h: hue, s: '100%', l: '60%', a: '1.0' }),
    7: generateColor({ h: hue, s: '100%', l: '70%', a: '1.0' }),
    8: generateColor({ h: hue, s: '100%', l: '80%', a: '1.0' }),
    9: generateColor({ h: hue, s: '100%', l: '90%', a: '1.0' }),
    95: generateColor({ h: hue, s: '100%', l: '95%', a: '1.0' }),
    98: generateColor({ h: hue, s: '100%', l: '98%', a: '1.0' }),
    100: generateColor({ h: hue, s: '100%', l: '100%', a: '1.0' }),
  };
}

/**
 * Generate the hsla format color group based on hue color.
 *
 * @param hue [0 - 360].
 * @returns color array.
 */
export function generateNeutralColor(hue: number): Colors {
  return {
    0: generateColor({ h: hue, s: '8%', l: '0%', a: '1.0' }),
    1: generateColor({ h: hue, s: '8%', l: '10%', a: '1.0' }),
    2: generateColor({ h: hue, s: '8%', l: '20%', a: '1.0' }),
    3: generateColor({ h: hue, s: '8%', l: '30%', a: '1.0' }),
    4: generateColor({ h: hue, s: '8%', l: '40%', a: '1.0' }),
    5: generateColor({ h: hue, s: '8%', l: '50%', a: '1.0' }),
    6: generateColor({ h: hue, s: '8%', l: '60%', a: '1.0' }),
    7: generateColor({ h: hue, s: '8%', l: '70%', a: '1.0' }),
    8: generateColor({ h: hue, s: '8%', l: '80%', a: '1.0' }),
    9: generateColor({ h: hue, s: '8%', l: '90%', a: '1.0' }),
    95: generateColor({ h: hue, s: '8%', l: '95%', a: '1.0' }),
    98: generateColor({ h: hue, s: '8%', l: '98%', a: '1.0' }),
    100: generateColor({ h: hue, s: '8%', l: '100%', a: '1.0' }),
  };
}

/**
 * Generate the hsla format color group based on hue color.
 *
 * @param hue [0 - 360].
 * @returns color array.
 */
export function generateNeutralSpecialColor(hue: number): Colors {
  return {
    0: generateColor({ h: hue, s: '36%', l: '0%', a: '1.0' }),
    1: generateColor({ h: hue, s: '36%', l: '10%', a: '1.0' }),
    2: generateColor({ h: hue, s: '36%', l: '20%', a: '1.0' }),
    3: generateColor({ h: hue, s: '36%', l: '30%', a: '1.0' }),
    4: generateColor({ h: hue, s: '36%', l: '40%', a: '1.0' }),
    5: generateColor({ h: hue, s: '36%', l: '50%', a: '1.0' }),
    6: generateColor({ h: hue, s: '36%', l: '60%', a: '1.0' }),
    7: generateColor({ h: hue, s: '36%', l: '70%', a: '1.0' }),
    8: generateColor({ h: hue, s: '36%', l: '80%', a: '1.0' }),
    9: generateColor({ h: hue, s: '36%', l: '90%', a: '1.0' }),
    95: generateColor({ h: hue, s: '36%', l: '95%', a: '1.0' }),
    98: generateColor({ h: hue, s: '36%', l: '98%', a: '1.0' }),
    100: generateColor({ h: hue, s: '36%', l: '100%', a: '1.0' }),
  };
}

/**
 * Generate hsla format barrage color group.
 *
 * @returns color array.
 */
export function generateBarrageColor(type: 'light' | 'dark'): Colors {
  if (type === 'light') {
    return {
      0: generateColor({ h: 0, s: '0%', l: '0%', a: '0.0' }),
      1: generateColor({ h: 0, s: '0%', l: '0%', a: '0.1' }),
      2: generateColor({ h: 0, s: '0%', l: '0%', a: '0.2' }),
      3: generateColor({ h: 0, s: '0%', l: '0%', a: '0.3' }),
      4: generateColor({ h: 0, s: '0%', l: '0%', a: '0.4' }),
      5: generateColor({ h: 0, s: '0%', l: '0%', a: '0.5' }),
      6: generateColor({ h: 0, s: '0%', l: '0%', a: '0.6' }),
      7: generateColor({ h: 0, s: '0%', l: '0%', a: '0.7' }),
      8: generateColor({ h: 0, s: '0%', l: '0%', a: '0.8' }),
      9: generateColor({ h: 0, s: '0%', l: '0%', a: '0.9' }),
      95: generateColor({ h: 0, s: '0%', l: '0%', a: '0.95' }),
      98: generateColor({ h: 0, s: '0%', l: '0%', a: '0.98' }),
      100: generateColor({ h: 0, s: '0%', l: '0%', a: '1.0' }),
    };
  } else {
    return {
      0: generateColor({ h: 0, s: '0%', l: '100%', a: '0.0' }),
      1: generateColor({ h: 0, s: '0%', l: '100%', a: '0.1' }),
      2: generateColor({ h: 0, s: '0%', l: '100%', a: '0.2' }),
      3: generateColor({ h: 0, s: '0%', l: '100%', a: '0.3' }),
      4: generateColor({ h: 0, s: '0%', l: '100%', a: '0.4' }),
      5: generateColor({ h: 0, s: '0%', l: '100%', a: '0.5' }),
      6: generateColor({ h: 0, s: '0%', l: '100%', a: '0.6' }),
      7: generateColor({ h: 0, s: '0%', l: '100%', a: '0.7' }),
      8: generateColor({ h: 0, s: '0%', l: '100%', a: '0.8' }),
      9: generateColor({ h: 0, s: '0%', l: '100%', a: '0.9' }),
      95: generateColor({ h: 0, s: '0%', l: '100%', a: '0.95' }),
      98: generateColor({ h: 0, s: '0%', l: '100%', a: '0.98' }),
      100: generateColor({ h: 0, s: '0%', l: '100%', a: '1.0' }),
    };
  }
}
