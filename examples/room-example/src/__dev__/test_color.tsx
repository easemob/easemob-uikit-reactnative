import * as React from 'react';
import { View } from 'react-native';

import {
  changeOpacity,
  getOpacity,
  hexAToHSLA,
  hexAToRGBA,
  hexToHSL,
  hexToRGB,
  HSLAToHexA,
  HSLAToRGBA,
  HSLToHex,
  HSLToRGB,
  RGBAToHexA,
  RGBAToHSLA,
  RGBToHex,
  RGBToHSL,
} from '../rename.room';

function test1() {
  // const v1 = 'rgba(51, 255, 51, 0.5)';
  // let v2 = '#33ff3380';
  // const v1 = 'rgba(51, 255, 51, 0.354)';
  // let v2 = '#33ff335a';
  const src_rgb = 'rgb(50%, 80%, 30%)';
  let src_hex = '#80cc4d';
  const hex = RGBToHex(src_rgb, false);
  const rgb = hexToRGB(hex, false);
  const hsl = RGBToHSL(src_rgb);
  const rgb2 = HSLToRGB(hsl, false);
  const hsl2 = hexToHSL(src_hex);
  const hex2 = HSLToHex(hsl2);
  console.log(
    'test_color:test1:',
    `src_rgb:${src_rgb}\n, src_hex:${src_hex}\n, hex:${hex}\n, rgb:${rgb}\n, hsl:${hsl}\n, rgb:${rgb2}\n, hsl:${hsl2}\n, hex:${hex2}\n`
  );
}

function test2() {
  // const v1 = 'rgba(51, 255, 51, 0.5)';
  // let v2 = '#33ff3380';
  // const v1 = 'rgba(51, 255, 51, 0.354)';
  // let v2 = '#33ff335a';
  const src_rgba = 'rgba(50%, 80%, 30%, 0.654)';
  let src_hex = '#80cc4da7';
  const hex = RGBAToHexA(src_rgba, false);
  const rgba = hexAToRGBA(hex, false);
  const hsla = RGBAToHSLA(src_rgba);
  const rgba2 = HSLAToRGBA(hsla, false);
  const hsla2 = hexAToHSLA(src_hex);
  const hex2 = HSLAToHexA(hsla2);
  console.log(
    'test_color:test2:',
    `src_rgba:${src_rgba}\n, src_hex:${src_hex}\n, hex:${hex}\n, rgba:${rgba}\n, hsla:${hsla}\n, rgba:${rgba2}\n, hsla2:${hsla2}\n, hex:${hex2}\n`
  );
}

function test3() {
  const v1 = 'hsla(96, 55%, 55%, 0.65)';
  const rgba = HSLAToRGBA(v1, false);
  const hsla = RGBAToHSLA(rgba);
  console.log('test_color:test3:', v1, rgba, hsla);
}

function test4() {
  const v1 = 'hsla(96, 55%, 55%, 0.65)';
  const rgba = HSLAToRGBA(v1, false);
  const hsla = RGBAToHSLA(rgba);
  const hexa = HSLAToHexA(v1);
  const r1 = getOpacity(v1);
  const r2 = getOpacity(rgba);
  const r3 = getOpacity(hexa);
  console.log('test_color:test4:', v1, rgba, hsla, hexa, r1, r2, r3);
}
function test5() {
  const v1 = 'hsla(96, 55%, 55%, 0.65)';
  const rgba = HSLAToRGBA(v1, false);
  const hsla = RGBAToHSLA(rgba);
  const hexa = HSLAToHexA(v1);
  const r1 = changeOpacity(v1, 0.35);
  const r2 = changeOpacity(rgba, 0.35);
  const r3 = changeOpacity(hexa, 0.35);
  const r4 = hexAToHSLA(r3);
  console.log('test_color:test5:', v1, rgba, hsla, hexa, r1, r2, r3, r4);
}

export default function test_color() {
  const onColor = () => {
    test1();
    test2();
    test3();
    test4();
    test5();
  };
  return (
    <View
      style={{ height: 100, width: 100, backgroundColor: 'blue' }}
      onTouchEnd={onColor}
    />
  );
}
