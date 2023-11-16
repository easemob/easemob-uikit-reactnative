import * as React from 'react';
import {
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
  View,
} from 'react-native';

import { getElement } from '../../hook';

export type SectionListRef<ItemT> = RNSectionList<ItemT>;

export type SectionListProps<ItemT> = RNSectionListProps<ItemT> & {
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

export const _SectionList = <ItemT,>(
  props: SectionListProps<ItemT>,
  ref?: React.ForwardedRef<SectionListRef<ItemT>>
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
export function SectionListFactory<ItemT = any>() {
  return React.forwardRef<SectionListRef<ItemT>, SectionListProps<ItemT>>(
    _SectionList
  );
}

export type SectionListFactoryReturn<ItemT> = ReturnType<
  typeof SectionListFactory<ItemT>
>;
