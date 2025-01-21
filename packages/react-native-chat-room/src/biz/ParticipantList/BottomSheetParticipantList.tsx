import * as React from 'react';
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import type { PropsWithError, PropsWithTest } from '../types';
import { ParticipantList, ParticipantListRef } from './ParticipantList';
import { useIsOwner } from './ParticipantList.hooks';
import type { ParticipantListItemProps } from './ParticipantList.item';
import type { ParticipantListType } from './types';

/**
 * Referencing value of the `ParticipantList` component.
 */
export type BottomSheetParticipantListRef = SimulativeModalRef & {
  /**
   * Show the component.
   */
  startShowWithInit: () => void;

  /**
   * Get member list reference.
   * @param memberType the member type. {@link ParticipantListType}
   * @returns the member list reference.
   */
  getParticipantListRef: (
    memberType: ParticipantListType
  ) => ParticipantListRef;
};

/**
 * Properties of the `ParticipantList` component.
 */
export type BottomSheetParticipantListProps = {
  /**
   * The external style of the component's content can be set from opaque to transparent, as well as color and other properties.
   */
  maskStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * Callback function when the search button is clicked.
   */
  onSearch?: (memberType: ParticipantListType) => void;
  /**
   * Callback function when there is no more member.
   */
  onNoMoreMember?: () => void;
  /**
   * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Custom component for each item in the list. Built-in components are used by default.
   */
  MemberItemComponent?: React.ComponentType<ParticipantListItemProps>;
} & PropsWithTest &
  PropsWithError;

/**
 * Component for displaying the list of members.
 *
 * It is composed of `ParticipantList` and `SimulativeModal`.
 */
export const BottomSheetParticipantList = React.forwardRef<
  BottomSheetParticipantListRef,
  BottomSheetParticipantListProps
>(function (
  props: BottomSheetParticipantListProps,
  ref?: React.ForwardedRef<BottomSheetParticipantListRef>
) {
  const {
    maskStyle,
    testMode,
    onError,
    onSearch,
    onNoMoreMember,
    containerStyle,
    MemberItemComponent,
  } = props;
  const modalRef = React.useRef<SimulativeModalRef>({} as any);
  const participantListRef = React.useRef<ParticipantListRef>({} as any);
  const muterListRef = React.useRef<ParticipantListRef>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const height = (winHeight * 3) / 5;
  const isUsePanResponder = React.useRef(true);
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
  const { isOwnerState } = useIsOwner();
  const { tr } = useI18nContext();

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          modalRef.current.startShow();
        },
        startHide: (onFinished?: () => void) => {
          modalRef.current.startHide(onFinished);
        },
        startShowWithInit: () => {
          modalRef.current.startShow();
        },
        getParticipantListRef: (memberType: ParticipantListType) => {
          if (memberType === 'member') {
            return participantListRef.current;
          } else {
            return muterListRef.current;
          }
        },
      };
    },
    []
  );

  const getTabItemBodies = ({
    isOwner,
    isUsePanResponder,
    testMode,
    onError,
  }: {
    isOwner: boolean;
    isUsePanResponder: React.MutableRefObject<boolean>;
  } & PropsWithTest &
    PropsWithError) => {
    if (isOwner === true) {
      return [
        <ParticipantList
          key={'1'}
          memberType={'member'}
          requestUseScrollGesture={(finished) => {
            isUsePanResponder.current = finished;
          }}
          testMode={testMode}
          onError={onError}
          onSearch={() => {
            onSearch?.('member');
          }}
          onNoMoreMember={onNoMoreMember}
          propsRef={participantListRef}
        />,
        <ParticipantList
          key={'2'}
          memberType={'muted'}
          requestUseScrollGesture={(finished) => {
            isUsePanResponder.current = finished;
          }}
          testMode={testMode}
          onError={onError}
          onSearch={() => {
            onSearch?.('muted');
          }}
          onNoMoreMember={onNoMoreMember}
          propsRef={muterListRef}
        />,
      ];
    }
    return [
      <ParticipantList
        key={'1'}
        memberType={'member'}
        requestUseScrollGesture={(finished) => {
          isUsePanResponder.current = finished;
        }}
        testMode={testMode}
        onError={onError}
        onSearch={() => {
          onSearch?.('member');
        }}
        onNoMoreMember={onNoMoreMember}
        MemberItemComponent={MemberItemComponent}
        propsRef={participantListRef}
      />,
    ];
  };

  const getTabItemTitles = (isOwner: boolean) => {
    if (isOwner === true) {
      return [tr('Participants'), tr('Muted')];
    }
    return [tr('Participants')];
  };

  return (
    <SimulativeModal
      propsRef={modalRef}
      modalAnimationType="slide"
      backgroundColor={g_mask_color}
      backgroundTransparent={false}
      onStartShouldSetPanResponder={() => {
        return isUsePanResponder.current;
      }}
      // onMoveShouldSetPanResponder={() => {
      //   return isUsePanResponder.current;
      // }}
      // onRequestModalClose={() => {
      //   ref.current.startHide();
      // }}
      maskStyle={maskStyle}
    >
      <View
        style={[
          {
            height: height,
            backgroundColor: getColor('backgroundColor'),
            alignItems: 'center',
            width: '100%',
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          },
          containerStyle,
        ]}
      >
        {/* <View
          style={{
            width: 36,
            height: gBottomSheetHeaderHeight - 6 * 2,
            marginVertical: 6,
            backgroundColor: getColor('backgroundColor2'),
            borderRadius: 2.5,
          }}
        /> */}
        {isOwnerState !== undefined ? (
          <TabPage
            header={{
              HeaderProps: {
                titles: getTabItemTitles(isOwnerState),
              },
            }}
            body={{
              type: 'TabPageBody',
              BodyProps: {
                children: getTabItemBodies({
                  isOwner: isOwnerState,
                  isUsePanResponder,
                  testMode,
                  onError,
                }),
              },
            }}
            headerPosition="up"
          />
        ) : null}
      </View>
    </SimulativeModal>
  );
});

const BottomSheetParticipantListCompare = (
  prevProps: BottomSheetParticipantListProps,
  nextProps: BottomSheetParticipantListProps
) => {
  return prevProps === nextProps;
};

export const ParticipantListMemo = React.memo(
  BottomSheetParticipantList,
  BottomSheetParticipantListCompare
);

export type BottomSheetParticipantListComponent =
  typeof BottomSheetParticipantList;
