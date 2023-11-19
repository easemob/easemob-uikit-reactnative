import * as React from 'react';
import {
  DefaultSectionT,
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
  View,
} from 'react-native';

import { getElement } from '../../hook';

export type SectionListRef<ItemT, SectionT> = RNSectionList<ItemT, SectionT>;

export type SectionListProps<ItemT, SectionT> = RNSectionListProps<
  ItemT,
  SectionT
> & {
  /**
   * Rendered when the list is error. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListErrorComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  /**
   * Rendered when the list is loading. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListLoadingComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
};

export const _SectionList = <ItemT, SectionT>(
  props: SectionListProps<ItemT, SectionT>,
  ref?: React.ForwardedRef<SectionListRef<ItemT, SectionT>>
) => {
  const { ListErrorComponent, ListLoadingComponent } = props;

  return (
    <View style={{ flexGrow: 1 }}>
      <RNSectionList ref={ref} {...props} />
      {getElement(ListErrorComponent)}
      {getElement(ListLoadingComponent)}
    </View>
  );
};

/**
 * @example
 *
 * export const SectionList = SectionListFactory<{ id: string }>();
 * export function SectionList() {}
 */
export function SectionListFactory<
  ItemT = any,
  SectionT extends DefaultSectionT = DefaultSectionT
>() {
  return React.forwardRef<
    SectionListRef<ItemT, SectionT>,
    SectionListProps<ItemT, SectionT>
  >(_SectionList);
}

export type SectionListFactoryReturn<
  ItemT,
  SectionT extends DefaultSectionT = DefaultSectionT
> = ReturnType<typeof SectionListFactory<ItemT, SectionT>>;
