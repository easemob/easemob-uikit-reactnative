import * as React from 'react';
import { View } from 'react-native';

import type { DataModel } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton, Text2Button } from '../../ui/Button';
import { PressableHighlight } from '../../ui/Pressable';
import { HighText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { ContactSearchModel } from '../ContactList';
import type { ListSearchItemProps } from './types';

export function ListSearchItem<ComponentModel extends DataModel = DataModel>(
  props: ListSearchItemProps<ComponentModel>
) {
  const { searchType } = props;
  if (searchType === 'create-group' || searchType === 'add-group-member') {
    const p = props as any as ListSearchItemProps<ContactSearchModel>;
    return <StateListSearchItem {...p} />;
  } else if (searchType === 'forward-message') {
    const p = props as any as ListSearchItemProps<ContactSearchModel>;
    return <ForwardListSearchItem {...p} />;
  }
  return <DefaultListSearchItem {...props} />;
}
export function DefaultListSearchItem<
  ComponentModel extends DataModel = DataModel
>(props: ListSearchItemProps<ComponentModel>) {
  const { data, keyword, onClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  return (
    <PressableHighlight
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        onClicked?.(data);
      }}
    >
      <View
        style={{
          width: '100%',
          height: 75.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Avatar url={data.avatar} size={50} />
        <HighText
          paletteType={'title'}
          textType={'medium'}
          containerStyle={{
            flexDirection: 'row',
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: '80%',
          }}
          keyword={keyword}
          content={data.name ?? data.id}
        />
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </PressableHighlight>
  );
}
export function StateListSearchItem(
  props: ListSearchItemProps<ContactSearchModel>
) {
  const { data, keyword, onClicked } = props;
  const { checked, onCheckClicked, disable } = data;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  return (
    <PressableHighlight
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        if (checked !== undefined) {
          if (disable !== true) {
            onCheckClicked?.(data);
          }
        } else {
          onClicked?.(data);
        }
      }}
    >
      <View
        style={{
          width: '100%',
          height: 75.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        {checked !== undefined ? (
          <View style={{ marginRight: 12 }}>
            <IconButton
              iconName={
                checked !== false ? 'checked_rectangle' : 'unchecked_rectangle'
              }
              style={{
                height: 28,
                width: 28,
                tintColor: getColor(
                  checked === true && disable !== true ? 'enable' : 'disable2'
                ),
              }}
              onPress={() => {
                if (disable !== true) {
                  onCheckClicked?.(data);
                }
              }}
            />
          </View>
        ) : null}
        <Avatar url={data.avatar} size={50} />
        <HighText
          paletteType={'title'}
          textType={'medium'}
          containerStyle={{
            flexDirection: 'row',
            flexGrow: 1,
            paddingLeft: 12,
          }}
          keyword={keyword}
          content={data.name ?? data.userId}
        />
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </PressableHighlight>
  );
}
export function ForwardListSearchItem(
  props: ListSearchItemProps<ContactSearchModel>
) {
  const { data, keyword, searchType } = props;
  const { forwarded, onClickedForward } = data;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    btn_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
  });

  const _onForwardClicked = React.useCallback(() => {
    if (searchType === 'forward-message' && forwarded !== true) {
      onClickedForward?.(data);
    }
  }, [data, forwarded, onClickedForward, searchType]);

  return (
    <PressableHighlight
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={_onForwardClicked}
    >
      <View
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Avatar url={data.avatar} size={40} />
        <HighText
          paletteType={'title'}
          textType={'medium'}
          containerStyle={{
            flexDirection: 'row',
            flexGrow: 1,
            paddingLeft: 12,
          }}
          keyword={keyword}
          content={data.name ?? data.userId}
        />

        {searchType === 'forward-message' ? (
          <>
            <View style={{ flexGrow: 1 }} />
            <Text2Button
              sizesType={'small'}
              radiusType={'extraSmall'}
              text={tr(forwarded === true ? 'forwarded' : 'forward')}
              style={{
                backgroundColor: getColor('btn_bg'),
              }}
              textStyle={{
                color: getColor(forwarded === true ? 'disable2' : 'fg'),
              }}
              onPress={() => {
                onClickedForward?.(data);
              }}
            />
          </>
        ) : null}
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </PressableHighlight>
  );
}
