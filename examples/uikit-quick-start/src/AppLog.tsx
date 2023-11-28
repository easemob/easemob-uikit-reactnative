import * as React from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, Text } from 'react-native';

import { dlog } from './AppConfig';

const max_count = 10;
let log_content = '';

dlog.handler = async (message?: any, ...optionalParams: any[]) => {
  const arr = [message, ...optionalParams];
  let str = log_content;
  for (const a of arr) {
    if (a?.toString) {
      str += a.toString() + ' ';
    }
  }
  if (str.trim().length > 0) {
    str += '\n';
  }
  const ret = str.match(/\n/g);
  let count = 0;
  if (ret !== null) {
    for (const {} of ret) {
      ++count;
    }
  }

  if (count > max_count) {
    const pos = str.indexOf('\n');
    if (pos > 0) {
      const t = str.substring(pos + 1);
      log_content = t;
    }
  } else {
    log_content = str;
  }
  DeviceEventEmitter.emit('demo_log', log_content);
};

export const LogMemo = React.memo(() => {
  const [log, setLog] = React.useState('');
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('demo_log', (event) => {
      setLog(event);
    });
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text>{log}</Text>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
});
