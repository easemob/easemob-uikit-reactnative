import * as React from 'react';
import { View } from 'react-native';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { BottomSheetMenu, BottomSheetMenuRef } from './BottomSheetMenu';
import { BottomSheetMenuItem } from './BottomSheetMenu.item';

export type InitMenuItemsType = {
  /**
   * The text to be displayed.
   */
  name: string;
  /**
   * Whether the text is highlighted.
   */
  isHigh: boolean;
  /**
   * The icon to be displayed.
   */
  icon?: IconNameType;
  /**
   * The callback function when the text is clicked.
   *
   * @param name The text to be displayed.
   * @param others Other parameters. You can pass in the parameters you need. For example, you can pass in the user ID.
   */
  onClicked?: (name: string, others?: any) => void;
};
export type BottomSheetNameMenuRef = Omit<
  BottomSheetMenuRef,
  'startShowWithInit'
> & {
  startShowWithInit: (initItems: InitMenuItemsType[], others?: any) => void;
  startShowWithProps: (props: BottomSheetNameMenuProps) => void;
};
export type BottomSheetNameMenuProps = {
  /**
   * To request to close the component, you usually need to call the `startHide` method here.
   */
  onRequestModalClose: () => void;
  /**
   * If no title is specified, it will not be displayed.
   */
  title?: string;
  /**
   * The maximum number should not exceed 6.
   */
  initItems?: InitMenuItemsType[];
  /**
   * The layout type of the component.
   */
  layoutType?: 'left' | 'center';
  /**
   * Whether to display the cancel button.
   */
  hasCancel?: boolean;
};

/**
 * The BottomSheetNameMenu component provides menu functionality.
 *
 * Compared with `BottomSheetMenu`, it is simpler to use, you only need to enter a text array.
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/57b8f2ea9b24cd0e4fb8606dc3b246b3fd91d52f/src/biz/ParticipantList/ParticipantContextMenu.tsx}
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/57b8f2ea9b24cd0e4fb8606dc3b246b3fd91d52f/src/biz/MessageList/MessageList.tsx}
 *
 * @example
 * ```tsx
 * const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
 * // ...
 * <BottomSheetNameMenu
 *   ref={menuRef}
 *   initItems={[]}
 *   onRequestModalClose={() => {
 *     menuRef?.current?.startHide?.();
 *   }}
 * />
 * // ...
 * menuRef?.current?.startShowWithInit([
 *   {
 *     name: 'Mute',
 *     isHigh: false,
 *     onClicked: () => {
 *       if (userId !== im.userId) {
 *         muteMember(userId, true);
 *       }
 *       menuRef?.current?.startHide?.();
 *     },
 *   },
 *   {
 *     name: 'Remove',
 *     isHigh: true,
 *     onClicked: () => {
 *       if (userId !== im.userId) {
 *         removeMember(userId);
 *       }
 *       menuRef?.current?.startHide?.();
 *     },
 *   },
 * ]);
 * ```
 */
export const BottomSheetNameMenu = React.forwardRef<
  BottomSheetNameMenuRef,
  BottomSheetNameMenuProps
>(function (
  props: BottomSheetNameMenuProps,
  ref?: React.ForwardedRef<BottomSheetNameMenuRef>
) {
  const { onRequestModalClose, title } = props;
  const { getItems } = useGetListItems(() => {
    return menuRef?.current?.getData?.();
  });
  const menuRef = React.useRef<BottomSheetMenuRef>({} as any);
  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          menuRef?.current?.startShow?.();
        },
        startHide: (onFinished?: () => void) => {
          menuRef?.current?.startHide?.(onFinished);
        },
        startShowWithInit: (initItems: InitMenuItemsType[], others?: any) => {
          const items = getItems({ initItems, onRequestModalClose });
          menuRef?.current?.startShowWithInit?.(items, others);
        },
        startShowWithProps: (props: BottomSheetNameMenuProps) => {
          const items = getItems({ ...props, onRequestModalClose });
          menuRef?.current?.startShowWithInit?.(items);
        },
        getData: () => {
          return menuRef?.current?.getData?.();
        },
      };
    },
    [getItems, onRequestModalClose]
  );
  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={onRequestModalClose}
      initItems={getItems(props)}
      title={title}
    />
  );
});

function useGetListItems(onGetData?: () => any) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const { tr } = useI18nContext();
  const getItems = React.useCallback(
    (props: BottomSheetNameMenuProps) => {
      const {
        initItems,
        onRequestModalClose,
        hasCancel = true,
        layoutType,
      } = props;
      if (!initItems) {
        return [];
      }
      const d = initItems
        .map((v, i) => {
          if (v.isHigh !== true) {
            return (
              <BottomSheetMenuItem
                key={i}
                id={i.toString()}
                initState={'enabled'}
                text={tr(v.name)}
                onPress={() => {
                  v.onClicked?.(v.name, onGetData?.());
                }}
                iconName={v.icon}
                containerStyle={{
                  alignItems: layoutType !== 'left' ? 'center' : 'flex-start',
                }}
              />
            );
          } else {
            return (
              <BottomSheetMenuItem
                key={i}
                id={i.toString()}
                initState={'warned'}
                text={tr(v.name)}
                onPress={() => {
                  v.onClicked?.(v.name, onGetData?.());
                }}
                iconName={v.icon}
                containerStyle={{
                  alignItems: layoutType !== 'left' ? 'center' : 'flex-start',
                }}
              />
            );
          }
        })
        .filter((v) => v !== null) as JSX.Element[];

      if (hasCancel === false) {
        const data = [...d];
        return data;
      } else {
        const data = [
          ...d,
          <View
            key={99}
            style={{
              height: 8,
              width: '100%',
              backgroundColor: getColor('divider'),
            }}
          />,
          <BottomSheetMenuItem
            key={100}
            id={'100'}
            initState={'enabled'}
            text={tr('cancel')}
            onPress={onRequestModalClose}
            textStyle={{
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: 22,
            }}
          />,
        ];
        return data;
      }
    },
    [getColor, onGetData, tr]
  );
  return {
    getItems,
  };
}
