import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Agora, Easemob } from '../common';

export function SplashScreen() {
  const appType = require('../env').accountType;
  return (
    <View style={[StyleSheet.absoluteFill]}>
      {appType === 'agora' ? <Agora /> : <Easemob />}
    </View>
  );
}
