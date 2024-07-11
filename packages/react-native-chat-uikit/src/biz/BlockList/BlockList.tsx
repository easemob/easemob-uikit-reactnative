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
import { Alert } from '../../ui/Alert';
import { SectionListFactory } from '../../ui/SectionList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import type { IndexModel } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { useBlockList } from './BlockList.hooks';
import { BlockListNavigationBar } from './BlockList.navi';
import type { BlockListItemProps, BlockListProps } from './types';

const SectionList = SectionListFactory<BlockListItemProps, IndexModel>();

/**
 * The block list component mainly consists of four parts, including navigation component, search style component, individual list item component, and list component. Supports displaying bottom menu components and warning components. The navigation bar component can be set to display or not, customize the style, or even replace it as a whole. The search style component supports whether to display, and the individual list item component supports whether to display, add or replace any multiple components. List components support more property settings.
 */
export function BlockList(props: BlockListProps) {
  const {
    containerStyle,
    onBack,
    navigationBarVisible,
    customNavigationBar,
    searchStyleVisible,
    customSearch,
    onClickedSearch,
    isVisibleIndex = true,
    isVisibleItemHeader = true,
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
    alertRef,
    onClicked,
    onLongPressed,
    tr,
    ListItemRender,
    ListItemHeaderRender,
    sectionListProps,
    blockCount,
    onError,
  } = useBlockList(props);
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
  const { getColor } = useColors({});

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
        <BlockListNavigationBar
          blockCount={blockCount}
          onBack={onBack}
          customNavigationBar={customNavigationBar}
        />
      ) : null}

      {searchStyleVisible !== false ? (
        customSearch ? (
          <>{customSearch}</>
        ) : (
          <SearchStyle
            title={tr('_uikit_block_search_placeholder')}
            onPress={() => {
              onClickedSearch?.();
            }}
          />
        )
      ) : null}

      <View style={{ flex: 1 }}>
        <SectionList
          // ListHeaderComponent={ListHeaderComponent}
          ref={ref}
          style={[{ flexGrow: 1 }, style]}
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          sections={sections}
          // !!! https://github.com/facebook/react-native/issues/42967
          // !!! https://github.com/facebook/react-native/issues/36766
          initialNumToRender={9999}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? false}
          refreshing={propsRefreshing ?? refreshing}
          onRefresh={propsOnRefresh ?? onRefresh}
          renderItem={(
            info: SectionListRenderItemInfo<BlockListItemProps, DefaultSectionT>
          ) => {
            const { item } = info;
            return (
              <ListItemRender
                {...item}
                onClicked={onClicked}
                onLongPressed={onLongPressed}
              />
            );
          }}
          keyExtractor={(item: BlockListItemProps) => {
            return item.id;
          }}
          renderSectionHeader={
            isVisibleItemHeader === true
              ? (info: {
                  section: SectionListData<BlockListItemProps, IndexModel>;
                }) => {
                  const { section } = info;
                  return <ListItemHeaderRender {...section} />;
                }
              : undefined
          }
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
                  onError?.();
                }}
              />
            ) : null
          }
          {...others}
        />
        {isVisibleIndex === true && AlphabeticIndex ? (
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
