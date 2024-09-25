import * as React from 'react';
import { Dimensions, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Icon } from '../../ui/Image';
import { PressableHighlight } from '../../ui/Pressable';
import { TabPage } from '../../ui/TabPage';
import { SingleLineText } from '../../ui/Text';
import { useMessageInputBarNameMenu } from '../hooks';
import { InitMenuItemsType } from '../types';
import { ContextNameMenuProps, ContextNameMenuRef } from '../types';

/**
 * The MessageInputBarExtensionNameMenu component provides menu functionality.
 *
 */
export const MessageInputBarExtensionNameMenu = React.forwardRef<
  ContextNameMenuRef,
  ContextNameMenuProps
>(function (
  props: ContextNameMenuProps,
  ref?: React.ForwardedRef<ContextNameMenuRef>
) {
  const { getColor } = useColors();
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const {
    items,
    updateItems,
    updateProps,
    maxRowCount = 2,
    unitCountPerRow = 4,
  } = useMessageInputBarNameMenu(props);
  const perPageMaxCount = maxRowCount * unitCountPerRow;
  const pageCount = React.useMemo(() => {
    return Math.ceil(items.length / perPageMaxCount);
  }, [items.length, perPageMaxCount]);
  const pageIndexes = React.useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i),
    [pageCount]
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          setIsShow(true);
        },
        startHide: (onFinished?: () => void) => {
          setIsShow(false);
          onFinished?.();
        },
        startShowWithInit: (initItems: InitMenuItemsType[], _?: any) => {
          setIsShow(true);
          updateItems(initItems);
        },
        startShowWithProps: (props: ContextNameMenuProps) => {
          setIsShow(true);
          updateProps(props);
        },
        getData: () => {
          return undefined;
        },
      };
    },
    [updateItems, updateProps]
  );

  return (
    <View
      style={{
        height: 220,
        backgroundColor: getColor('bg'),
        display: isShow === true ? 'flex' : 'none',
      }}
    >
      {pageCount <= 1 ? (
        <ItemsRender
          {...props}
          initItems={items}
          maxRowCount={maxRowCount}
          unitCountPerRow={unitCountPerRow}
          startPageIndex={0}
        />
      ) : (
        <TabPage
          header={{
            Header: TabPage.DotHeader,
            HeaderProps: {
              titles: pageIndexes.map((v) => {
                return {
                  title: v.toString(),
                };
              }),
            },
          }}
          body={{
            type: 'TabPageBodyT',
            BodyProps: {
              RenderChildren: BodyPagesT,
              RenderChildrenProps: {
                ...props,
                initItems: items,
                maxRowCount,
                unitCountPerRow,
                index: 0,
                currentIndex: 0,
              } as any,
            },
          }}
          height={220}
          headerPosition="down"
        />
      )}
    </View>
  );
});

function BodyPagesT(
  props: ContextNameMenuProps & {
    index: number;
    currentIndex: number;
    startPageIndex: number;
  }
) {
  const { index } = props;
  return <ItemsRender key={index} {...props} startPageIndex={index} />;
}

const ItemsRender = (
  props: ContextNameMenuProps & { startPageIndex: number }
) => {
  const {
    initItems,
    maxRowCount = 2,
    unitCountPerRow = 4,
    startPageIndex,
  } = props;
  const { tr } = useI18nContext();
  const { getColor } = useColors();
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = 64;
  const itemHeight = 88;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 19,
        marginVertical: 12,
      }}
    >
      {initItems
        ? initItems.map((item, index) => {
            if (
              index >= (startPageIndex + 1) * maxRowCount * unitCountPerRow ||
              index < startPageIndex * maxRowCount * unitCountPerRow
            ) {
              return null;
            }
            return (
              <PressableHighlight
                key={index}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal:
                    (screenWidth - itemWidth * unitCountPerRow - 19 * 2) /
                    (unitCountPerRow * 2),
                  marginBottom: index !== initItems.length - 1 ? 12 : 0,
                }}
                onPress={() => item.onClicked?.(item.name)}
              >
                <View
                  style={{
                    padding: 16,
                    backgroundColor: getColor('bg2'),
                    borderRadius: 12,
                  }}
                >
                  <Icon
                    name={item.icon ?? 'star_fill'}
                    style={{
                      width: 32,
                      height: 32,
                      tintColor: getColor('fg'),
                    }}
                  />
                </View>

                <View style={{ marginTop: 8, height: 16 }}>
                  <SingleLineText
                    paletteType={'label'}
                    textType={'small'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr(item.name)}
                  </SingleLineText>
                </View>
              </PressableHighlight>
            );
          })
        : ([] as JSX.Element[])}
    </View>
  );
};
