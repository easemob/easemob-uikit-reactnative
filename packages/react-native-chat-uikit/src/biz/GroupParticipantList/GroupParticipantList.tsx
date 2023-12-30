import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { useGroupParticipantList } from './GroupParticipantList.hooks';
import { GroupParticipantListItemMemo } from './GroupParticipantList.item';
import { _GroupParticipantListNavigationBar } from './GroupParticipantList.navi';
import type {
  GroupParticipantListItemProps,
  GroupParticipantListProps,
} from './types';

const FlatList = FlatListFactory<GroupParticipantListItemProps>();

export function GroupParticipantList(props: GroupParticipantListProps) {
  const { containerStyle, onBack, participantType } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    onClicked,
    participantCount,
    onClickedAddParticipant,
    onClickedDelParticipant,
    deleteCount,
    onDelParticipant,
    alertRef,
    onCheckClicked,
    tr,
  } = useGroupParticipantList(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.error[5],
      dark: colors.error[6],
    },
  });

  return (
    <View
      style={[
        {
          flexGrow: 1,
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      <_GroupParticipantListNavigationBar
        participantType={participantType}
        onBack={onBack}
        tr={tr}
        onDelParticipant={onDelParticipant}
        deleteCount={deleteCount}
        participantCount={participantCount}
        onClickedAddParticipant={onClickedAddParticipant}
        onClickedDelParticipant={onClickedDelParticipant}
      />

      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
            // height: '100%',
            // height: 400,
            // backgroundColor: 'yellow',
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(
            info: ListRenderItemInfo<GroupParticipantListItemProps>
          ) => {
            const { item } = info;
            return (
              <GroupParticipantListItemMemo
                {...item}
                onClicked={onClicked}
                onCheckClicked={onCheckClicked}
              />
            );
          }}
          keyExtractor={(item: GroupParticipantListItemProps) => {
            return item.id;
          }}
          onEndReached={onMore}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder
                onClicked={() => {
                  onRefresh?.();
                }}
              />
            ) : null
          }
        />
      </View>
      <Alert ref={alertRef} />
    </View>
  );
}
