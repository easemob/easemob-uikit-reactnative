import * as React from 'react';
import { SectionListData } from 'react-native';

import {
  BlockModel,
  ChatServiceListener,
  UIBlockListListener,
  UIListenerType,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import { ChatMultiDeviceEvent } from '../../rename.chat';
import type { AlertRef } from '../../ui/Alert';
import { getPinyin } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { g_index_alphabet_range, g_index_alphabet_range_array } from '../const';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useSectionList } from '../List';
import type { IndexModel, ListIndexProps } from '../ListIndex';
import type { ListStateType } from '../types';
import { BlockListItemHeaderMemo, BlockListItemMemo } from './BlockList.item';
import type {
  BlockListItemComponentType,
  BlockListItemHeaderComponentType,
  BlockListItemProps,
  BlockListProps,
} from './types';

/**
 * Block list hook.
 */
export function useBlockList(props: BlockListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    testMode,
    ListItemRender: propsListItemRender,
    ListItemHeaderRender: propsListItemHeaderRender,
    onInitialized,
    sectionListProps: propsSectionListProps,
    onStateChanged,
    getFullLetter: propsGetFullLetter,
    indexList: propsIndexList = g_index_alphabet_range_array,
    visibleEmptyIndex: propsVisibleEmptyIndex,
  } = props;
  const sectionListProps = useSectionList<
    BlockListItemProps,
    IndexModel,
    ListIndexProps
  >({});
  const {
    isSort,
    setIndexTitles,
    setSection,
    sectionsRef,
    ref: sectionListRef,
    isAutoLoad,
    setListState,
  } = sectionListProps;
  const [blockCount, setBlockCount] = React.useState(0);
  const { tr } = useI18nContext();
  const im = useChatContext();
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const alertRef = React.useRef<AlertRef>(null);
  const { closeMenu } = useCloseMenu({ menuRef });
  const ListItemRenderRef = React.useRef<BlockListItemComponentType>(
    propsListItemRender ?? BlockListItemMemo
  );
  const ListItemHeaderRenderRef =
    React.useRef<BlockListItemHeaderComponentType>(
      propsListItemHeaderRender ?? BlockListItemHeaderMemo
    );

  const updateState = React.useCallback(
    (state: ListStateType) => {
      setListState?.(state);
      onStateChanged?.(state);
    },
    [onStateChanged, setListState]
  );

  const onSort = React.useCallback(
    (prevProps: BlockListItemProps, nextProps: BlockListItemProps): number => {
      return _sortBlock(prevProps, nextProps);
    },
    []
  );

  const onClickedCallback = React.useCallback(
    (data?: BlockModel | undefined) => {
      onClickedItem?.(data);
    },
    [onClickedItem]
  );

  const onLongPressCallback = React.useCallback(
    (data?: BlockModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const removeDuplicateData = React.useCallback(
    (list: BlockListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.section.userId === item.section.userId)
      );
      return uniqueList;
    },
    []
  );

  const getNickName = React.useCallback((section: BlockModel) => {
    return _getNickName(section);
  }, []);

  const updatePinyin = React.useCallback(
    (list: BlockListItemProps[]) => {
      list.forEach((item) => {
        const name = getNickName(item.section);
        if (propsGetFullLetter) {
          item.section.pinyin = propsGetFullLetter(name);
        } else {
          item.section.pinyin = getPinyin(name);
        }
      });
    },
    [getNickName, propsGetFullLetter]
  );

  const initIndexList = React.useCallback(
    (
      sortList: (IndexModel & {
        data: BlockListItemProps[];
      })[]
    ) => {
      propsIndexList.forEach((i) => {
        sortList.push({
          indexTitle: i,
          data: [],
        });
      });
    },
    [propsIndexList]
  );
  const filterEmptyIndex = React.useCallback(
    (
      sortList: (IndexModel & {
        data: BlockListItemProps[];
      })[]
    ) => {
      return sortList.filter((item) => {
        return item.data.length > 0;
      });
    },
    []
  );

  const refreshToUI = React.useCallback(
    (list: BlockListItemProps[]) => {
      updatePinyin(list);

      if (isSort === true) {
        list.sort(onSort);
      }

      const uniqueList = removeDuplicateData(list);

      const sortList: (IndexModel & { data: BlockListItemProps[] })[] = [];
      initIndexList(sortList);

      uniqueList.forEach((item) => {
        const first = item.section.pinyin?.[0]?.toLocaleUpperCase();
        // const name = getNickName(item.section);
        // const first = getFirst(name?.[0]?.toLocaleUpperCase());
        const indexTitle = first
          ? g_index_alphabet_range.includes(first)
            ? first
            : '#'
          : '#';
        const index = sortList.findIndex((section) => {
          return section.indexTitle === indexTitle;
        });
        if (index === -1) {
          sortList.push({
            indexTitle: indexTitle,
            data: [item],
          });
        } else {
          sortList[index]?.data.push(item);
        }
      });
      if (propsVisibleEmptyIndex !== true) {
        sectionsRef.current = filterEmptyIndex(sortList);
      } else {
        sectionsRef.current = sortList;
      }

      setIndexTitles(sectionsRef.current.map((item) => item.indexTitle));
      setSection(sectionsRef.current);

      setBlockCount(uniqueList.length);
    },
    [
      filterEmptyIndex,
      initIndexList,
      isSort,
      onSort,
      propsVisibleEmptyIndex,
      removeDuplicateData,
      sectionsRef,
      setIndexTitles,
      setSection,
      updatePinyin,
    ]
  );

  const flatList = React.useCallback(
    (sectionList: SectionListData<BlockListItemProps, IndexModel>[]) => {
      return sectionList
        .map((section) => {
          return section.data.map((item) => {
            return item;
          });
        })
        .flat();
    },
    []
  );

  const addBlockToUI = React.useCallback(
    (data: BlockModel) => {
      const list = flatList(sectionsRef.current);
      list.push({
        id: data.userId,
        section: data,
      } as BlockListItemProps);
      refreshToUI(list);
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const removeBlockToUI = React.useCallback(
    (userId: string) => {
      sectionsRef.current = sectionsRef.current.filter((section) => {
        section.data = section.data.filter((item) => {
          return item.section.userId !== userId;
        });
        return section.data.length > 0;
      });
      refreshToUI(flatList(sectionsRef.current));
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const updateBlockToUI = React.useCallback(
    (data: BlockModel) => {
      const list = flatList(sectionsRef.current);
      const isExisted = list.find((item) => {
        if (item.id === data.userId) {
          item.section = {
            ...item.section,
            ...data,
          };
          return true;
        }
        return false;
      });
      if (isExisted !== undefined) {
        refreshToUI(list);
      }
    },
    [flatList, refreshToUI, sectionsRef]
  );

  const onIndexSelected = React.useCallback(
    (index: number) => {
      sectionListRef?.current?.scrollToLocation?.({
        sectionIndex: index,
        itemIndex: 1,
      });
    },
    [sectionListRef]
  );

  const init = React.useCallback(
    async (params: { isForce?: boolean }) => {
      const { isForce = false } = params;
      if (testMode === 'only-ui') {
        return;
      }
      if (isAutoLoad === true) {
        const s = await im.loginState();
        if (s === 'logged') {
          im.getAllBlockList({
            isForce: isForce,
            onResult: (res) => {
              if (res.isOk && res.value) {
                const list = res.value.map((item) => {
                  return {
                    id: item.userId,
                    section: item,
                  } as BlockListItemProps;
                });
                if (list.length > 0) {
                  refreshToUI(list);
                  onInitialized?.(list);
                } else {
                  updateState('empty');
                }
              }
            },
          });
          updateState('loading');
        } else {
          updateState('error');
        }
      }
    },
    [im, isAutoLoad, onInitialized, refreshToUI, testMode, updateState]
  );

  useChatListener(
    React.useMemo(() => {
      return {
        onContactEvent: (event) => {
          if (event === ChatMultiDeviceEvent.CONTACT_ALLOW) {
            init({ isForce: true });
          }
        },
      } as ChatServiceListener;
    }, [init])
  );

  const onError = React.useCallback(() => {
    init({ isForce: true });
  }, [init]);

  React.useEffect(() => {
    const listener: UIBlockListListener = {
      onAddedEvent: (data) => {
        addBlockToUI(data);
      },
      onDeletedEvent: (data) => {
        removeBlockToUI(data.userId);
      },
      onUpdatedEvent: (data) => {
        updateBlockToUI(data);
      },
      onRequestRefreshEvent: () => {
        refreshToUI(flatList(sectionsRef.current));
      },
      onRequestReloadEvent: () => {
        init({ isForce: true });
      },
      type: UIListenerType.Block,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [
    addBlockToUI,
    flatList,
    im,
    init,
    onInitialized,
    refreshToUI,
    removeBlockToUI,
    sectionsRef,
    updateBlockToUI,
  ]);

  React.useEffect(() => {
    init({});
  }, [init]);

  return {
    ...sectionListProps,
    sectionListProps: propsSectionListProps,
    propsSectionListProps,
    onIndexSelected,
    onRequestCloseMenu: closeMenu,
    menuRef,
    alertRef,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressCallback,
    tr,
    ListItemRender: ListItemRenderRef.current,
    ListItemHeaderRender: ListItemHeaderRenderRef.current,
    onError,
    blockCount,
  };
}

const _getNickName = (section: BlockModel) => {
  if (section.remark && section.remark.length > 0) {
    return section.remark;
  } else if (section.userName && section.userName.length > 0) {
    return section.userName;
  } else {
    return section.userId;
  }
};

const _sortBlock = (
  prevProps: BlockListItemProps,
  nextProps: BlockListItemProps
): number => {
  if (
    prevProps.section.pinyin &&
    prevProps.section.pinyin.length > 0 &&
    nextProps.section.pinyin &&
    nextProps.section.pinyin.length > 0
  ) {
    const prevFirstLetter = prevProps.section.pinyin;
    const nextFirstLetter = nextProps.section.pinyin;

    if (prevFirstLetter < nextFirstLetter) {
      return -1;
    } else if (prevFirstLetter > nextFirstLetter) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
