import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { InitMenuItemsType } from '../types';
import {
  MessageMenuRef,
  MessageNameMenuProps,
  MessageNameMenuRef,
} from '../types';
import { BottomSheetMenu } from './BottomSheetMenu';
import { BottomSheetMenuItem } from './BottomSheetMenu.item';

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
 * const menuRef = React.useRef<MessageNameMenuRef>({} as any);
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
  MessageNameMenuRef,
  MessageNameMenuProps
>(function (
  props: MessageNameMenuProps,
  ref?: React.ForwardedRef<MessageNameMenuRef>
) {
  const { onRequestModalClose, title, header, headerProps } = props;
  const { getItems } = useGetListItems(() => {
    return menuRef?.current?.getData?.();
  });
  const menuRef = React.useRef<MessageMenuRef>({} as any);
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
        startShowWithProps: (props: MessageNameMenuProps) => {
          const { initItems: _, ...others } = props;
          _;
          const items = getItems({
            ...props,
            onRequestModalClose,
          });
          menuRef?.current?.startShowWithProps?.({
            initItems: items,
            ...others,
            onRequestModalClose,
          });
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
      header={header}
      headerProps={headerProps}
    />
  );
});

function useGetListItems(onGetData?: () => any) {
  const { getColor } = useColors();
  const { tr } = useI18nContext();
  const getItems = React.useCallback(
    (props: MessageNameMenuProps) => {
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
