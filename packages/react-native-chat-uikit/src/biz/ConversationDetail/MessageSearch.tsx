import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useChatContext } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { useFlatList } from '../List';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { Search } from '../Search';
import { MessageSearchItemMemo } from './MessageSearchItem';
import type {
  MessageSearchItemProps,
  MessageSearchModel,
  MessageSearchProps,
} from './types';

export function MessageSearch(props: MessageSearchProps) {
  const { containerStyle, onCancel } = props;
  const FlatList = React.useMemo(
    () => FlatListFactory<MessageSearchItemProps>(),
    []
  );
  const {} = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const { data, listState, value, setValue, deferSearch, onClickedItem } =
    useMessageSearch(props);

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          flex: 1,
        },
        containerStyle,
      ]}
    >
      <Search
        onCancel={onCancel}
        onChangeText={(v) => {
          setValue(v);
          deferSearch?.(v);
        }}
        value={value}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          style={[{ flexGrow: 1 }]}
          contentContainerStyle={[{ flexGrow: 1 }]}
          data={data}
          renderItem={(info: ListRenderItemInfo<MessageSearchItemProps>) => {
            const { item } = info;
            return (
              <MessageSearchItemMemo {...item} onClicked={onClickedItem} />
            );
          }}
          keyExtractor={(item: MessageSearchItemProps) => {
            return item.model.msg.msgId;
          }}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder onClicked={() => {}} />
            ) : null
          }
          ListLoadingComponent={
            listState === 'loading' ? <LoadingPlaceholder /> : null
          }
        />
      </View>
    </View>
  );
}

function useMessageSearch(props: MessageSearchProps) {
  const { testMode, convType } = props;
  const flatListProps = useFlatList<MessageSearchItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
  });
  const { setOnSearch, dataRef, setData } = flatListProps;
  const [value, setValue] = React.useState('');
  const im = useChatContext();

  const onClickedItem = React.useCallback((_model: MessageSearchModel) => {
    // todo: jump to message position.
  }, []);

  const onUpdate = React.useCallback(
    (keyword: string) => {
      im.getMessagesByKeyword({
        keyword: keyword,
        convId: undefined as any, // !!! need to fix
        convType,
        onResult: (res) => {
          if (res.isOk && res.value) {
            dataRef.current = [];
            res.value.forEach((item) => {
              const isExisted = dataRef.current.find(
                (d) => d.model.msg.msgId === item.msgId
              );
              if (isExisted) {
                isExisted.model = { ...isExisted.model, keyword: keyword };
              } else {
                dataRef.current.push({
                  model: {
                    msg: item,
                    userId: item.from,
                    modelType: 'message',
                    keyword: keyword,
                  },
                });
              }
            });
            setData([...dataRef.current]);
          }
        },
      });
    },
    [convType, dataRef, im, setData]
  );

  const onSearch = React.useCallback(
    (keyword: string) => {
      if (keyword.trim() === '') {
        dataRef.current = [];
        setData([]);
        return;
      }
      onUpdate(keyword);
    },
    [dataRef, onUpdate, setData]
  );

  React.useEffect(() => {
    setOnSearch(onSearch);
  }, [onSearch, setOnSearch]);

  return {
    ...flatListProps,
    value,
    setValue,
    onClickedItem,
  };
}
