import * as React from 'react';
import { View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { HighText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { DefaultComponentModel, ListSearchItemProps } from './types';

export function ListSearchItem<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
>(props: ListSearchItemProps<ComponentModel>) {
  const { data, keyword } = props;
  return (
    <View
      style={{
        width: '100%',
        height: 76,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <Avatar url={g_not_existed_url} size={50} />
      <HighText
        paletteType={'title'}
        textType={'medium'}
        containerStyle={{ flexDirection: 'row', flexGrow: 1, paddingLeft: 12 }}
        keyword={keyword}
        content={data.name}
      />
    </View>
  );
}
