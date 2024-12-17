import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  useWindowDimensions,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import type { UserServiceData } from '../../room';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { Image } from '../../ui/Image';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import type { PropsWithError, PropsWithTest } from '../types';
import { useSearchParticipantListAPI } from './ParticipantList.hooks';
import {
  ParticipantListItemMemo,
  ParticipantListItemProps,
} from './ParticipantList.item';
import { Search } from './Search';
import type { ParticipantListType } from './types';

/**
 * Properties of the `ParticipantList` component.
 */
export type SearchParticipantProps = {
  /**
   * List type. {@link ParticipantListType}
   */
  memberType: ParticipantListType;
  /**
   * Callback function when cancel button is clicked.
   */
  onRequestClose: () => void;
  /**
   * Search type.
   */
  searchType?: keyof UserServiceData;
  /**
   * Callback function when mute operator is finished.
   */
  onMuteOperatorFinished?: () => void;
} & PropsWithTest &
  PropsWithError;

/**
 * Search member components.
 * @param props {@link SearchParticipantProps}
 * @returns JSX.Element
 */
export function SearchParticipant(props: SearchParticipantProps) {
  const { onRequestClose, memberType, searchType, onMuteOperatorFinished } =
    props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    backgroundColor2: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
  });
  const {
    _data,
    deferSearch,
    menuRef,
    value,
    setValue,
    alertRef,
    removedUser,
    onRemoveMember,
  } = useSearchParticipantListAPI({
    memberType,
    searchType,
    onMuteOperatorFinished,
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: getColor('backgroundColor'),
      }}
    >
      <Search
        value={value}
        onChangeText={(v) => {
          setValue(v);
          deferSearch(v);
        }}
        onCancel={function () {
          onRequestClose();
        }}
      />
      <FlatList
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={_data}
        renderItem={(info: ListRenderItemInfo<ParticipantListItemProps>) => {
          const { item } = info;
          return <ParticipantListItemMemo {...item} />;
        }}
        keyExtractor={(item: ParticipantListItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyBlank}
      />
      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
        initItems={[]}
      />
      <Alert
        ref={alertRef}
        title={tr(
          'Want to remove ${0} from the chatroom?',
          removedUser?.nickname
        )}
        buttons={[
          {
            text: tr('Cancel'),
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: tr('Confirm'),
            onPress: onRemoveMember,
          },
        ]}
      />
    </View>
  );
}

const EmptyBlank = () => {
  const { height: winHeight } = useWindowDimensions();
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: winHeight - 94,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../assets/bg/blank.png')}
        style={{ height: 140 }}
        resizeMode={'contain'}
      />
    </View>
  );
};
