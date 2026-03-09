import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { gHeaderHeight, gIndicatorHeight } from './TabPage.const';
import { useHeaderStartScrolling } from './TabPage.hooks';
import {
  TabPageBody,
  type TabPageBodyProps,
  type TabPageBodyRef,
} from './TabPageBody';
import { TabPageBodyT, type TabPageBodyTProps } from './TabPageBody.T';
import {
  TabPageHeader,
  type TabPageHeaderProps,
  type TabPageHeaderRef,
} from './TabPageHeader';

type OmitTabPageHeaderProps = Omit<
  TabPageHeaderProps,
  'propRef' | 'onClicked' | 'width' | 'initIndex'
>;
type OmitTabPageBodyProps = Omit<
  TabPageBodyProps,
  'propsRef' | 'height' | 'width' | 'initIndex' | 'onCurrentIndex'
>;
type OmitTabPageBodyTProps = Omit<
  TabPageBodyTProps,
  | 'propsRef'
  | 'height'
  | 'width'
  | 'childrenCount'
  | 'initIndex'
  | 'onCurrentIndex'
>;

export type TabPageProps = {
  header: {
    Header?: typeof TabPageHeader;
    HeaderProps: OmitTabPageHeaderProps;
  };
  body:
    | {
        type: 'TabPageBody';
        Body?: typeof TabPageBody;
        BodyProps: OmitTabPageBodyProps;
      }
    | {
        type: 'TabPageBodyT';
        Body?: typeof TabPageBodyT;
        BodyProps: OmitTabPageBodyTProps;
      };
  height?: number;
  width?: number;
  headerPosition?: 'up' | 'down';
  initIndex?: number;
  onCurrentIndex?: (currentIndex: number) => void;
};

export function TabPage(props: TabPageProps) {
  const {
    header,
    body,
    height,
    width: initWidth,
    headerPosition = 'up',
    initIndex = 0,
    onCurrentIndex,
  } = props;
  const { Header, HeaderProps } = header;
  const { titles: headerTitles } = HeaderProps;
  const { Body, BodyProps, type: bodyType } = body;
  const {
    children: bodyChildren,
    onMomentumScrollEnd,
    scrollEventThrottle,
    ...BodyOtherProps
  } = BodyProps as OmitTabPageBodyProps;
  const {
    RenderChildren,
    RenderChildrenProps,
    onMomentumScrollEnd: onMomentumScrollEndT,
    scrollEventThrottle: scrollEventThrottleT,
    ...BodyOtherPropsT
  } = BodyProps as OmitTabPageBodyTProps;
  const { width: winWidth } = useWindowDimensions();
  const headerRef = React.useRef<TabPageHeaderRef>({} as any);
  const bodyRef = React.useRef<TabPageBodyRef>({} as any);
  const count = headerTitles.length;
  const TabPageHeaderWrapper = Header ?? TabPageHeader;
  const TabPageBodyWrapper = (Body as typeof TabPageBody) ?? TabPageBody;
  const TabPageBodyTWrapper = (Body as typeof TabPageBodyT) ?? TabPageBodyT;

  const width = initWidth ?? winWidth;
  const { headerStartScrolling } = useHeaderStartScrolling(
    count,
    headerRef,
    initIndex
  );

  if (
    headerTitles.length <= 0 ||
    (bodyType === 'TabPageBody' && headerTitles.length !== bodyChildren?.length)
  ) {
    throw new UIKitError({ code: ErrorCode.params });
  }

  const getHeader = () => {
    return (
      <TabPageHeaderWrapper
        propRef={headerRef}
        onClicked={(index: number) => {
          bodyRef.current?.scrollTo(index);
          if (Platform.OS === 'android') {
            headerStartScrolling(width, width * index);
          }
        }}
        width={width}
        initIndex={initIndex}
        {...HeaderProps}
      />
    );
  };

  return (
    <View
      style={{
        // flex: 1,
        flexGrow: 1,
        width: width,
      }}
    >
      {headerPosition === 'up' ? getHeader() : null}

      {bodyType === 'TabPageBody' ? (
        <TabPageBodyWrapper
          propsRef={bodyRef}
          onMomentumScrollEnd={(e) => {
            // !!! On the android platform, when using `scrollTo`, this callback is not triggered. shit.
            onMomentumScrollEnd?.(e);
            headerStartScrolling(width, e.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={scrollEventThrottle ?? 16}
          height={
            height ? height - (gHeaderHeight + gIndicatorHeight) : undefined
          }
          width={width}
          children={bodyChildren}
          initIndex={initIndex}
          onCurrentIndex={onCurrentIndex}
          {...BodyOtherProps}
        />
      ) : (
        <TabPageBodyTWrapper
          propsRef={bodyRef}
          onMomentumScrollEnd={(e) => {
            // !!! On the android platform, when using `scrollTo`, this callback is not triggered. shit.
            onMomentumScrollEndT?.(e);
            headerStartScrolling(width, e.nativeEvent.contentOffset.x);
          }}
          scrollEventThrottle={scrollEventThrottleT ?? 16}
          height={
            height ? height - (gHeaderHeight + gIndicatorHeight) : undefined
          }
          width={width}
          childrenCount={count}
          RenderChildren={RenderChildren}
          RenderChildrenProps={RenderChildrenProps}
          initIndex={initIndex}
          onCurrentIndex={onCurrentIndex}
          {...BodyOtherPropsT}
        />
      )}

      {headerPosition !== 'up' ? getHeader() : null}
    </View>
  );
}

TabPage.DefaultHeader = TabPageHeader;
TabPage.DefaultBody = TabPageBody;
