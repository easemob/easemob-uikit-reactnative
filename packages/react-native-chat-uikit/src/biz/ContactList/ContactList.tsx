import * as React from 'react';
import {
  DefaultSectionT,
  //   SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
} from 'react-native';

import { g_not_existed_url } from '../../const';
import { IconButton } from '../../ui/Button';
import { SectionListFactory } from '../../ui/SectionList';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useContactListApi2 } from './ContactList.hooks';
import {
  ContactListItemHeaderMemo,
  ContactListItemMemo,
  ContactListItemProps,
} from './ContactList.item';
import { ContactItem } from './ContactList.item';
import type { ContactListProps } from './types';

const SectionList = SectionListFactory<
  ContactListItemProps,
  { indexTitle: string }
>();

export function ContactList(props: ContactListProps) {
  const { containerStyle } = props;
  const {
    ref,
    sections,
    onRefresh,
    refreshing,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    AlphabeticIndex,
  } = useContactListApi2(props);
  return (
    <View
      style={[
        {
          // height: '100%',
          flexGrow: 1,
        },
        containerStyle,
      ]}
    >
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24 }}
              onPress={() => {
                // todo: left
              }}
            />
            <Avatar url={g_not_existed_url} size={24} />
          </View>
        }
        Right={TopNavigationBarRight}
        RightProps={{
          onClicked: () => {
            // todo: right
          },
          iconName: 'person_add',
        }}
        Title={TopNavigationBarTitle({ text: 'Chat' })}
        containerStyle={{ marginHorizontal: 12 }}
      />
      <SearchStyle
        title={'Search'}
        onPress={() => {
          // todo: search
        }}
      />
      <ContactItem
        name={'new invite'}
        count={<Badges count={0} />}
        hasArrow={true}
        onClicked={() => {
          // todo: new invite
        }}
      />
      <ContactItem
        name={'group'}
        count={
          <Text paletteType={'label'} textType={'medium'}>
            {'0'}
          </Text>
        }
        hasArrow={true}
        onClicked={() => {
          // todo: new invite
        }}
      />
      <ContactItem
        name={'balcklist'}
        count={
          <Text paletteType={'label'} textType={'medium'}>
            {'9'}
          </Text>
        }
        hasArrow={true}
        onClicked={() => {
          // todo: new black list
        }}
      />
      <View style={{ flexGrow: 1 }}>
        <SectionList
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
            // backgroundColor: 'red',
          }}
          sections={sections}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(
            info: SectionListRenderItemInfo<
              ContactListItemProps,
              DefaultSectionT
            >
          ) => {
            const { item } = info;
            return <ContactListItemMemo {...item} />;
          }}
          keyExtractor={(item: ContactListItemProps) => {
            return item.id;
          }}
          renderSectionHeader={(info: {
            section: SectionListData<
              ContactListItemProps,
              { indexTitle: string }
            >;
          }) => {
            const { section } = info;
            return <ContactListItemHeaderMemo {...section} />;
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
        {AlphabeticIndex ? (
          <AlphabeticIndex
            indexTitles={['A', 'B', 'C']}
            onIndexSelected={(_index: number) => {
              // todo: index
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
