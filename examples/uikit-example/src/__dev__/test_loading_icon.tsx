import * as React from 'react';
import { Text, View } from 'react-native';

import { LoadingIcon } from '../rename.uikit';

export default function Test(): React.ReactElement {
  const [tick, setTick] = React.useState(false);
  const onPress = React.useCallback(() => {
    setTick((v) => !v);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
      }}
      onTouchEnd={onPress}
    >
      <Text style={{ marginBottom: 20, fontSize: 16 }}>
        点击切换显示/隐藏动画
      </Text>

      {tick ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ marginBottom: 10 }}>原版 LoadingIcon</Text>
            <LoadingIcon
              name={'loading'}
              style={{
                height: 40,
                width: 40,
                backgroundColor: 'yellow',
              }}
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ marginBottom: 10 }}>优化版 LoadingIcon2</Text>
          </View>
        </View>
      ) : (
        <Text style={{ fontSize: 14, color: 'gray' }}>动画已隐藏</Text>
      )}
    </View>
  );
}
