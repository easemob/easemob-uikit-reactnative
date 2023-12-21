import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { IconButton } from '../../ui/Button';
import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
// import { SearchStyle } from '../SearchStyle';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupParticipantList } from './GroupParticipantList.hooks';
import { GroupParticipantListItemMemo } from './GroupParticipantList.item';
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

  const navigationBar = () => {
    if (participantType === 'delete') {
      return (
        <TopNavigationBar
          Left={
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={onBack}
            >
              <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('text') }}
              >{`Remove Group Participant`}</Text>
            </Pressable>
          }
          Right={
            <Pressable
              style={{ flexDirection: 'row' }}
              onPress={onDelParticipant}
            >
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{
                  color: getColor(
                    deleteCount === 0 ? 'text_disable' : 'text_enable'
                  ),
                }}
              >{`Delete(${deleteCount})`}</Text>
            </Pressable>
          }
          containerStyle={{ paddingHorizontal: 12 }}
        />
      );
    } else if (participantType === 'change-owner') {
      return (
        <TopNavigationBar
          Left={
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={onBack}
            >
              <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('text') }}
              >{`Change owner`}</Text>
            </Pressable>
          }
          Right={<View style={{ width: 1, height: 1 }} />}
          containerStyle={{ paddingHorizontal: 12 }}
        />
      );
    } else if (participantType === 'mention') {
      return (
        <TopNavigationBar
          Left={
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={onBack}
            >
              <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('text') }}
              >{`@ mention`}</Text>
            </Pressable>
          }
          Right={<View style={{ width: 1, height: 1 }} />}
          containerStyle={{ paddingHorizontal: 12 }}
        />
      );
    } else {
      return (
        <TopNavigationBar
          Left={
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={onBack}
            >
              <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
              <Text>{`Group Participant List (${participantCount})`}</Text>
            </Pressable>
          }
          Right={
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                iconName={'person_add'}
                style={{ width: 24, height: 24, padding: 6 }}
                onPress={onClickedAddParticipant}
              />
              <View style={{ width: 4 }} />
              <IconButton
                iconName={'person_minus'}
                style={{ width: 24, height: 24, padding: 6 }}
                onPress={onClickedDelParticipant}
              />
            </View>
          }
          containerStyle={{ paddingHorizontal: 12 }}
        />
      );
    }
  };

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
      {navigationBar()}

      {/* <SearchStyle
        title={'Search'}
        onPress={() => {
          onSearch?.();
        }}
      /> */}
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
