import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { gHeaderHeight, gIndicatorHeight } from './TabPage.const';
import { useTabPageAPI } from './TabPage.hooks';
import { TabPageBody } from './TabPageBody';
import { TabPageBodyLIST } from './TabPageBody.LIST';
import { TabPageBodyT } from './TabPageBody.T';
import { TabPageHeader } from './TabPageHeader';
import type {
  TabPageBodyLISTProps,
  TabPageBodyProps,
  TabPageBodyTProps,
  TabPageHeaderProps,
} from './types';

export type OmitTabPageHeaderProps = Omit<
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
type OmitTabPageBodyLISTProps = Omit<
  TabPageBodyLISTProps,
  | 'propsRef'
  | 'height'
  | 'width'
  | 'childrenCount'
  | 'initIndex'
  | 'onCurrentIndex'
>;

export type TabPageRef = {
  changeIndex: (index: number, animated?: boolean) => void;
};

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
      }
    | {
        type: 'TabPageBodyLIST';
        Body?: typeof TabPageBodyLIST;
        BodyProps: OmitTabPageBodyLISTProps;
      };
  height?: number;
  width?: number;
  headerPosition?: 'up' | 'down';
  initIndex?: number;
  onCurrentIndex?: (currentIndex: number) => void;
};

interface TabPageComponent
  extends React.ForwardRefExoticComponent<
    TabPageProps & React.RefAttributes<TabPageRef>
  > {
  DefaultHeader: typeof TabPageHeader;
  DefaultBody: typeof TabPageBody;
}

const _TabPage = React.forwardRef<TabPageRef, TabPageProps>(
  (props: TabPageProps, ref?: React.ForwardedRef<TabPageRef>) => {
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
      RenderChildren: RenderChildrenT,
      RenderChildrenProps: RenderChildrenPropsT,
      onMomentumScrollEnd: onMomentumScrollEndT,
      scrollEventThrottle: scrollEventThrottleT,
      ...BodyOtherPropsT
    } = BodyProps as OmitTabPageBodyTProps;
    const {
      RenderChildren: RenderChildrenLIST,
      RenderChildrenProps: RenderChildrenPropsLIST,
      onMomentumScrollEnd: onMomentumScrollEndLIST,
      scrollEventThrottle: scrollEventThrottleLIST,
      ...BodyOtherPropsLIST
    } = BodyProps as OmitTabPageBodyLISTProps;
    const { width: winWidth } = useWindowDimensions();
    const { headerRef, bodyRef, headerStartScrolling } = useTabPageAPI(
      props,
      ref
    );
    const count = headerTitles.length;
    const _TabPageHeader = Header ?? TabPageHeader;
    const _TabPageBody = (Body as typeof TabPageBody) ?? TabPageBody;
    const _TabPageBodyT = (Body as typeof TabPageBodyT) ?? TabPageBodyT;
    const _TabPageBodyLIST =
      (Body as typeof TabPageBodyLIST) ?? TabPageBodyLIST;
    const width = initWidth ?? winWidth;

    if (
      headerTitles.length <= 0 ||
      (bodyType === 'TabPageBody' &&
        headerTitles.length !== bodyChildren?.length)
    ) {
      throw new UIKitError({ code: ErrorCode.params });
    }

    const getHeader = () => {
      return (
        <_TabPageHeader
          {...HeaderProps}
          propRef={headerRef}
          onClicked={(index: number) => {
            bodyRef.current?.scrollTo(index);
            if (Platform.OS === 'android') {
              headerStartScrolling(width, width * index);
            }
          }}
          width={width}
          initIndex={initIndex}
        />
      );
    };

    return (
      <View
        style={{
          // flex: 1,
          flexGrow: 1,
          width: width,
          height: height ? height : '100%',
        }}
      >
        {headerPosition === 'up' ? getHeader() : null}

        {bodyType === 'TabPageBody' ? (
          <_TabPageBody
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
        ) : bodyType === 'TabPageBodyT' ? (
          <_TabPageBodyT
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
            RenderChildren={RenderChildrenT}
            RenderChildrenProps={RenderChildrenPropsT}
            initIndex={initIndex}
            onCurrentIndex={onCurrentIndex}
            {...BodyOtherPropsT}
          />
        ) : (
          <_TabPageBodyLIST
            propsRef={bodyRef}
            onMomentumScrollEnd={(e) => {
              // !!! On the android platform, when using `scrollTo`, this callback is not triggered. shit.
              onMomentumScrollEndLIST?.(e);
              headerStartScrolling(width, e.nativeEvent.contentOffset.x);
            }}
            scrollEventThrottle={scrollEventThrottleLIST ?? 16}
            height={
              height ? height - (gHeaderHeight + gIndicatorHeight) : undefined
            }
            width={width}
            childrenCount={count}
            RenderChildren={RenderChildrenLIST}
            RenderChildrenProps={RenderChildrenPropsLIST}
            initIndex={initIndex}
            onCurrentIndex={onCurrentIndex}
            {...BodyOtherPropsLIST}
          />
        )}

        {headerPosition !== 'up' ? getHeader() : null}
      </View>
    );
  }
) as TabPageComponent;

_TabPage.DefaultHeader = TabPageHeader;
_TabPage.DefaultBody = TabPageBody;

export const TabPage = _TabPage;
