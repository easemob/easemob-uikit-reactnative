import * as React from 'react';

import { useDispatchListener } from '../../dispatch';
import { useRoomContext } from '../../room';
import { Alert, AlertRef } from '../../ui/Alert';
import {
  BottomSheetNameMenu,
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import type { PropsWithError, PropsWithTest } from '../types';
import type { ParticipantListType } from './types';

export type ParticipantContextMenuProps = PropsWithTest &
  PropsWithError & {
    memberType: ParticipantListType;
    muteMember: (memberId: string, isMuted: boolean) => void;
    removeMember: (memberId: string) => void;
    onGetMenuItems: () => InitMenuItemsType[];
    onGetMenuRef: (
      menuRef: React.MutableRefObject<BottomSheetNameMenuRef>
    ) => void;
  };

/**
 * Member list menu. Currently, it includes functions such as banning, unbanning, translation, and message reporting.
 * @param props {@link ParticipantContextMenuProps}
 * @returns JSX.Element
 */
export const ParticipantContextMenu = (props: ParticipantContextMenuProps) => {
  const { muteMember, removeMember, memberType, onGetMenuItems, onGetMenuRef } =
    props;
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const [userName, setUserName] = React.useState('');
  const im = useRoomContext();
  const userIdRef = React.useRef('');
  React.useEffect(() => {
    onGetMenuRef(menuRef);
  }, [onGetMenuRef]);
  const listener = React.useRef(
    (
      _memberType: ParticipantListType, // current mute list
      isOwner: boolean, // current user role
      userId: string // current member id
      // isMuted: boolean // current member mute state
    ) => {
      if (isOwner === true) {
        if (_memberType === 'member') {
          if (memberType === _memberType) {
            setUserName(im.getUserInfo(userId)?.nickname ?? userId);
            let items: InitMenuItemsType[] = [
              {
                name: 'Mute',
                isHigh: false,
                onClicked: () => {
                  if (userId !== im.userId) {
                    muteMember(userId, true);
                  }
                  menuRef?.current?.startHide?.();
                },
              },
              {
                name: 'Remove',
                isHigh: true,
                onClicked: () => {
                  if (userId !== im.userId) {
                    removeMember(userId);
                  }
                  menuRef?.current?.startHide?.();
                },
              },
            ];
            if (onGetMenuItems) {
              const propsItems = onGetMenuItems();
              for (const propsItem of propsItems) {
                // !!! example:
                // const s = propsItem;
                // items.push({
                //   name: s.name,
                //   isHigh: s.isHigh,
                //   onClicked: () => {
                //     s.onClicked?.(s.name, userId);
                //   },
                // });
                items.push(propsItem);
              }
            }
            menuRef?.current?.startShowWithInit(items, userId);
          }
        } else if (_memberType === 'muted') {
          if (memberType === _memberType) {
            setUserName(im.getUserInfo(userId)?.nickname ?? userId);
            menuRef?.current?.startShowWithInit([
              {
                name: 'Unmute',
                isHigh: false,
                onClicked: () => {
                  if (userId !== im.userId) {
                    muteMember(userId, false);
                  }
                  menuRef?.current?.startHide?.();
                },
              },
            ]);
          }
        }
      }
    }
  );
  useDispatchListener(
    `_$useParticipantListAPI_participantListContextMenu`,
    listener.current
  );
  return (
    <>
      <BottomSheetNameMenu
        ref={menuRef}
        initItems={[]}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
      />
      <Alert
        ref={alertRef}
        title={`Want to remove '${userName}'`}
        buttons={[
          {
            text: 'Cancel',
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: 'Confirm',
            onPress: () => {
              removeMember(userIdRef.current);
              alertRef.current?.close?.();
            },
          },
        ]}
      />
    </>
  );
};
