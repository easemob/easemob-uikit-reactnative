import * as React from 'react';
import {
  ListRenderItemInfo,
  // Image as RNImage,
  Pressable,
  View,
} from 'react-native';

import { useChatContext } from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { useFlatList } from '../List';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { TopNavigationBar } from '../TopNavigationBar';
import { MessageHistoryListItemMemo } from './MessageHistoryListItem';
import type {
  MessageHistoryListItemProps,
  MessageHistoryListProps,
} from './types';

export function MessageHistoryList(props: MessageHistoryListProps) {
  const { containerStyle, onBack, navigationBarVisible, customNavigationBar } =
    props;
  const FlatList = React.useMemo(
    () => FlatListFactory<MessageHistoryListItemProps>(),
    []
  );
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  const { data, listState } = useMessageHistoryList(props);

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
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={onBack}
              >
                <Icon
                  name={'chevron_left'}
                  style={{ width: 24, height: 24, tintColor: getColor('icon') }}
                />
                <Text
                  paletteType={'title'}
                  textType={'medium'}
                  style={{ color: getColor('text') }}
                >
                  {tr('_uikit_history_record')}
                </Text>
              </Pressable>
            }
            Right={<View style={{ width: 32, height: 32 }} />}
          />
        )
      ) : null}
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          style={[{ flexGrow: 1 }]}
          contentContainerStyle={[{ flexGrow: 1 }]}
          data={data}
          renderItem={(
            info: ListRenderItemInfo<MessageHistoryListItemProps>
          ) => {
            const { item } = info;
            return <MessageHistoryListItemMemo {...item} />;
          }}
          keyExtractor={(item: MessageHistoryListItemProps) => {
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

function useMessageHistoryList(props: MessageHistoryListProps) {
  const { testMode, message } = props;
  const im = useChatContext();
  const flatListProps = useFlatList<MessageHistoryListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
  });
  const { dataRef, setData } = flatListProps;

  const init = React.useCallback(async () => {
    const list = await im.fetchCombineMessageDetail({ msg: message });
    if (list && list.length > 0) {
      list.forEach((item) => {
        dataRef.current.push({
          model: { msg: item, modelType: 'history', userId: item.from },
        });
      });
      setData([...dataRef.current]);
    }
  }, [dataRef, im, message, setData]);

  React.useEffect(() => {
    init();
  }, [init]);

  return {
    ...flatListProps,
  };
}
