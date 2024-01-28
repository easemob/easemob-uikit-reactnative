import * as React from 'react';
import {
  DefaultSectionT,
  //   SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { SectionListFactory } from '../../ui/SectionList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import type { IndexModel } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { useContactList } from './ContactList.hooks';
import { ContactListNavigationBar } from './ContactList.navi';
import type { ContactListItemProps, ContactListProps } from './types';

const SectionList = SectionListFactory<ContactListItemProps, IndexModel>();

/**
 * The contact list component mainly consists of four parts, including navigation component, search style component, individual list item component, and list component. Supports displaying bottom menu components and warning components. The navigation bar component can be set to display or not, customize the style, or even replace it as a whole. The search style component supports whether to display, and the individual list item component supports whether to display, add or replace any multiple components. List components support more property settings.
 */
export function ContactList(props: ContactListProps) {
  const {
    containerStyle,
    contactType,
    onBack,
    navigationBarVisible,
    customNavigationBar,
    searchStyleVisible,
    customSearch,
    onClickedSearch,
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
    onRequestCloseMenu,
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
    avatarUrl,
    tr,
    ListItemRender,
    ListItemHeaderRender,
    sectionListProps,
    ListHeaderComponent,
  } = useContactList(props);
  const {
    style,
    contentContainerStyle,
    refreshing: propsRefreshing,
    onRefresh: propsOnRefresh,
    onEndReached: propsOnEndReached,
    viewabilityConfig: propsViewabilityConfig,
    onViewableItemsChanged: propsOnViewableItemsChanged,
    showsVerticalScrollIndicator,
    ...others
  } = sectionListProps ?? {};
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
      {navigationBarVisible !== false ? (
        <ContactListNavigationBar
          contactType={contactType}
          selectedCount={selectedCount}
          selectedMemberCount={selectedMemberCount}
          avatarUrl={avatarUrl}
          onClickedNewContact={onClickedNewContact}
          onBack={onBack}
          onClickedCreateGroup={onClickedCreateGroup}
          onClickedAddGroupParticipant={onClickedAddGroupParticipant}
          customNavigationBar={customNavigationBar}
        />
      ) : null}

      {searchStyleVisible !== false ? (
        customSearch ? (
          <>{customSearch}</>
        ) : (
          <SearchStyle
            title={tr('search')}
            onPress={() => {
              onClickedSearch?.();
            }}
          />
        )
      ) : null}

      {/* {contactItems({ groupCount, requestCount })} */}

      <View style={{ flex: 1 }}>
        <SectionList
          ListHeaderComponent={ListHeaderComponent}
          ref={ref}
          style={[{ flexGrow: 1 }, style]}
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          sections={sections}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? false}
          refreshing={propsRefreshing ?? refreshing}
          onRefresh={propsOnRefresh ?? onRefresh}
          renderItem={(
            info: SectionListRenderItemInfo<
              ContactListItemProps,
              DefaultSectionT
            >
          ) => {
            const { item } = info;
            return (
              <ListItemRender
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
            return <ListItemHeaderRender {...section} />;
          }}
          onEndReached={propsOnEndReached ?? onMore}
          viewabilityConfig={propsViewabilityConfig ?? viewabilityConfig}
          onViewableItemsChanged={
            propsOnViewableItemsChanged ?? onViewableItemsChanged
          }
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
          {...others}
        />
        {AlphabeticIndex ? (
          <View
            pointerEvents={'box-none'}
            style={[
              StyleSheet.absoluteFill,
              {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                right: 2,
                left: 0,
              },
            ]}
          >
            <AlphabeticIndex
              indexTitles={indexTitles}
              onIndexSelected={onIndexSelected}
            />
          </View>
        ) : null}
      </View>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
