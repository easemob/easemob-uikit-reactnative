import * as React from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  View,
} from 'react-native';

export type FlatListRef<ItemT> = RNFlatList<ItemT>;

export type FlatListProps<ItemT> = RNFlatListProps<ItemT> & {
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

export const _FlatList = <ItemT,>(
  props: FlatListProps<ItemT>,
  ref?: React.ForwardedRef<FlatListRef<ItemT>>
) => {
  const { ListErrorComponent, ListLoadingComponent } = props;

  const getElement = (
    Component?: React.ComponentType<any> | React.ReactElement | null | undefined
  ) => {
    if (Component === undefined || Component === null) {
      return null;
    }
    const isValid = React.isValidElement(Component);
    if (isValid) {
      return Component as React.ReactElement;
    } else if (
      typeof Component === 'function' ||
      typeof Component === 'object'
    ) {
      const C = Component as any; // !!! error TS2604: JSX element type 'Component' does not have any construct or call signatures.
      return (<C />) as React.ReactElement;
    }
    return null;
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <RNFlatList ref={ref} {...props} />
      {getElement(ListErrorComponent)}
      {getElement(ListLoadingComponent)}
    </View>
  );
};

export function FlatListFactory<ItemT = any>() {
  return React.forwardRef<FlatListRef<ItemT>, FlatListProps<ItemT>>(_FlatList);
}

export type FlatListFactoryReturn<ItemT> = ReturnType<
  typeof FlatListFactory<ItemT>
>;

// export const FlatList = FlatListFactory<{ id: string }>();
// export function FlatList() {}
