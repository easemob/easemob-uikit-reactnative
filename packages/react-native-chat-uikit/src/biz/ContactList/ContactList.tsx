import * as React from 'react';
import {
  DefaultSectionT,
  //   SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { SectionListFactory } from '../../ui/SectionList';
import { Text } from '../../ui/Text';
import { Badges } from '../Badges';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import type { IndexModel } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { useContactList } from './ContactList.hooks';
import {
  ContactListItemHeaderMemo,
  ContactListItemMemo,
} from './ContactList.item';
import { ContactItem } from './ContactList.item';
import { _ContactListNavigationBar } from './ContactList.navi';
import type { ContactListItemProps, ContactListProps } from './types';

const SectionList = SectionListFactory<ContactListItemProps, IndexModel>();

export function ContactList(props: ContactListProps) {
  const {
    containerStyle,
    contactType,
    isHasGroupList = true,
    isHasNewRequest = true,
    onContextMenuMoreActions,
    onSearch,
    onBack,
    onClickedNewRequest,
    onClickedGroupList,
    enableNavigationBar,
    NavigationBar: propsNavigationBar,
    enableSearch,
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
    onClickedNewContact,
    alertRef,
    onClicked,
    onLongPressed,
    onCheckClicked,
    selectedCount,
    onClickedCreateGroup,
    selectedMemberCount,
    onClickedAddGroupParticipant,
    requestCount,
    groupCount,
    avatarUrl,
    tr,
  } = useContactList(props);
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
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  const items = () => {
    if (contactType === 'contact-list') {
      return (
        <>
          {isHasNewRequest === true ? (
            <ContactItem
              name={tr('_uikit_contact_new_request')}
              count={<Badges count={requestCount} />}
              hasArrow={true}
              onClicked={onClickedNewRequest}
            />
          ) : null}
          {isHasGroupList === true ? (
            <ContactItem
              name={tr('_uikit_contact_group_list')}
              count={
                <Text paletteType={'label'} textType={'medium'}>
                  {groupCount}
                </Text>
              }
              hasArrow={true}
              onClicked={onClickedGroupList}
            />
          ) : null}
          {onContextMenuMoreActions}
        </>
      );
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
      {enableNavigationBar !== false ? (
        <_ContactListNavigationBar
          contactType={contactType}
          selectedCount={selectedCount}
          selectedMemberCount={selectedMemberCount}
          avatarUrl={avatarUrl}
          onClickedNewContact={onClickedNewContact}
          onBack={onBack}
          onClickedCreateGroup={onClickedCreateGroup}
          onClickedAddGroupParticipant={onClickedAddGroupParticipant}
          NavigationBar={propsNavigationBar}
        />
      ) : null}

      {enableSearch !== false ? (
        <SearchStyle
          title={tr('search')}
          onPress={() => {
            onSearch?.();
          }}
        />
      ) : null}

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
            return (
              <ContactListItemMemo
                {...item}
                onClicked={onClicked}
                onLongPressed={onLongPressed}
                onCheckClicked={onCheckClicked}
              />
            );
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
      <Alert ref={alertRef} />
    </View>
  );
}
