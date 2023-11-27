import * as React from 'react';
import {
  DefaultSectionT,
  Pressable,
  //   SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
} from 'react-native';

import { g_not_existed_url } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { SectionListFactory } from '../../ui/SectionList';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import type { IndexModel } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useContactList } from './ContactList.hooks';
import {
  ContactListItemHeaderMemo,
  ContactListItemMemo,
} from './ContactList.item';
import { ContactItem } from './ContactList.item';
import type { ContactListItemProps, ContactListProps } from './types';

const SectionList = SectionListFactory<ContactListItemProps, IndexModel>();

export function ContactList(props: ContactListProps) {
  const {
    containerStyle,
    type,
    isHasGroupList,
    isHasNewRequest,
    onContextMenuMoreActions,
    onSearch,
    onCancel,
    onNavigationBarMoreActions,
  } = props;
  const {
    ref,
    sections,
    indexTitles,
    onRefresh,
    refreshing,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    AlphabeticIndex,
    onIndexSelected,
    onRequestModalClose,
    menuRef,
    onShowMenu,
  } = useContactList(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  const navigationBar = () => {
    if (type === 'contact-list') {
      return (
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
              if (onNavigationBarMoreActions) {
                onNavigationBarMoreActions();
              } else {
                onShowMenu?.();
              }
            },
            iconName: 'person_add',
          }}
          Title={TopNavigationBarTitle({ text: 'Contacts' })}
          containerStyle={{ paddingHorizontal: 12 }}
        />
      );
    } else if (type === 'new-contact-list') {
      return (
        <TopNavigationBar
          Left={
            <Pressable
              style={{ flexDirection: 'row' }}
              onPress={() => {
                onCancel?.();
              }}
            >
              <Text paletteType={'label'} textType={'medium'}>
                {'Cancel'}
              </Text>
            </Pressable>
          }
          Right={<View style={{ width: 32, height: 32 }} />}
          Title={TopNavigationBarTitle({ text: 'New Conversation' })}
          containerStyle={{ paddingHorizontal: 12 }}
        />
      );
    } else {
      return null;
    }
  };

  const items = () => {
    if (type === 'contact-list') {
      return (
        <>
          {isHasNewRequest === true ? (
            <ContactItem
              name={'new invite'}
              count={<Badges count={0} />}
              hasArrow={true}
              onClicked={() => {
                // todo: new invite
              }}
            />
          ) : null}
          {isHasGroupList === true ? (
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
          ) : null}
          {onContextMenuMoreActions}
        </>
      );
    } else if (type === 'new-contact-list') {
      return null;
    } else {
      return null;
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          flexGrow: 1,
        },
        containerStyle,
      ]}
    >
      {navigationBar()}

      <SearchStyle
        title={'Search'}
        onPress={() => {
          onSearch?.();
        }}
      />

      {items()}

      <View style={{ flex: 1 }}>
        <SectionList
          ref={ref}
          style={{
            flexGrow: 1,
          }}
          contentContainerStyle={{
            flexGrow: 1,
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
            section: SectionListData<ContactListItemProps, IndexModel>;
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
            indexTitles={indexTitles}
            onIndexSelected={onIndexSelected}
          />
        ) : null}
      </View>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestModalClose}
      />
    </View>
  );
}
