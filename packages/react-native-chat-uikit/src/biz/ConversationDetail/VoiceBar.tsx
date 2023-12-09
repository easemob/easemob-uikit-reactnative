import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useI18nContext } from '../../i18n';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';

export type VoiceBarProps = {};
export function VoiceBar(props: VoiceBarProps) {
  const {} = props;
  const { tr } = useI18nContext();
  return (
    <View style={{ height: 200, width: '100%' }}>
      <View style={{}} />
      <View style={{ height: 70 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <IconButton
          iconName={'trash'}
          style={{ height: 20, width: 20, padding: 8, borderRadius: 24 }}
          onPress={() => {}}
        />
        <Pressable style={{ height: 48, width: 80 }}>
          <View>
            <Icon name={'mic_on'} style={{ width: 24, height: 24 }} />
            <Text>{'sdf'}</Text>
          </View>
        </Pressable>
        <IconButton
          iconName={'airplane'}
          style={{ height: 20, width: 20, padding: 8, borderRadius: 24 }}
          onPress={() => {}}
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <Text>{tr('playing')}</Text>
        <Text>{tr('left seconds')}</Text>
      </View>
    </View>
  );
}
