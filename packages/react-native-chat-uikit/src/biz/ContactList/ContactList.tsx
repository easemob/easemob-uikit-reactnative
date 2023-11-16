import * as React from 'react';
import {
  DefaultSectionT,
  //   SectionList as RNSectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
  ViewToken,
} from 'react-native';

import { g_not_existed_url } from '../../const';
import type { UIKitError } from '../../error';
import { useDelayExecTask } from '../../hook';
import { IconButton } from '../../ui/Button';
import { SectionListFactory, SectionListRef } from '../../ui/SectionList';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import { ListIndex } from '../ListIndex';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useContactListApi } from './ContactList.hooks';
import {
  ContactItem,
  ContactListItemHeaderMemo,
  ContactListItemMemo,
  ContactListItemProps,
} from './ContactList.item';
import type { ContactListProps } from './types';

const SectionList = SectionListFactory();

export function ContactList<DataT = any>(props: ContactListProps<DataT>) {
  const { onRequestData, containerStyle } = props;
  const ref = React.useRef<SectionListRef<ContactListItemProps<DataT>>>(
    {} as any
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const viewabilityConfigRef = React.useRef({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    viewablePercentThreshold: 50,
    waitForInteraction: false,
  });
  const {
    data,
    pageState,
    onRefresh: _onRefresh,
    onData,
    onMore,
  } = useContactListApi<DataT>(props);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      _onRefresh();
      setRefreshing(false);
    }, 1000);
  };
  const onEndReached = () => {
    onMore();
  };
  const { delayExecTask: onViewableItemsChanged } = useDelayExecTask(
    500,
    React.useCallback(
      (info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => {
        const ids = info.viewableItems.map((v) => {
          return (v.item as ContactListItemProps<DataT>).id;
        });
        onRequestData?.({
          ids,
          result: (
            data?: DataT[] | undefined,
            error?: UIKitError | undefined
          ) => {
            if (data) {
              onData(data);
            } else if (error) {
              console.warn(error);
            }
          },
        });
      },
      [onData, onRequestData]
    )
  );

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
          // todo: new invite
        }}
      />
      <View style={{ flexGrow: 1 }}>
        <SectionList
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
            // backgroundColor: 'red',
          }}
          sections={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(
            info: SectionListRenderItemInfo<
              ContactListItemProps<DataT>,
              DefaultSectionT
            >
          ) => {
            const { item } = info;
            return <ContactListItemMemo {...item} />;
          }}
          keyExtractor={(item: ContactListItemProps<DataT>) => {
            return item.id;
          }}
          renderSectionHeader={(info: {
            section: SectionListData<
              ContactListItemProps<DataT>,
              DefaultSectionT
            >;
          }) => {
            const { section } = info;
            return <ContactListItemHeaderMemo {...(section as any)} />;
          }}
          onEndReached={onEndReached}
          viewabilityConfig={viewabilityConfigRef.current}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            pageState === 'error' ? (
              <ErrorPlaceholder
                onClicked={() => {
                  onRefresh();
                }}
              />
            ) : null
          }
        />
        <ListIndex
          indexTitles={['A', 'B', 'C']}
          onIndexSelected={(_index: number) => {
            // todo: index
          }}
        />
      </View>
    </View>
  );
}
