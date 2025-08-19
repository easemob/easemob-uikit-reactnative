import { NavigationProp, useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';

import type { RootParamsName, RootScreenParamsList } from '../routes';
import type { NavigationParams } from './types';

function navigateFC<Props extends NavigationParams<{}>>(
  navigation: NavigationProp<RootScreenParamsList>,
  params: {
    from?: RootParamsName;
    to: RootParamsName;
    props?: Props;
    merge?: boolean;
  }
) {
  const {
    __from,
    __hash = Date.now(),
    ...others
  } = (params.props as NavigationParams<{}>) ?? ({} as NavigationParams<{}>);
  const routes = navigation.getState().routes;
  __from;
  const _from = params.from ?? routes[routes.length - 1]!.name;
  navigation.navigate({
    name: params.to as any,
    params: {
      params: {
        ...others,
        __from: _from,
        __hash: __hash,
      } as Props,
    },
    merge: params.merge ?? true,
  });
}
function popToFC<Props extends NavigationParams<{}>>(
  navigation: NativeStackNavigationProp<RootScreenParamsList>,
  params: {
    from?: RootParamsName;
    to?: RootParamsName;
    props: Props;
    merge?: boolean;
  }
) {
  const { from, to, props, merge } = params;
  const routes = navigation.getState().routes;
  const _from = from ?? routes[routes.length - 1]!.name;
  let _to = to;
  let _props;
  if (routes.length >= 2) {
    _to = _to ?? routes[routes.length - 2]!.name;
    _props = routes[routes.length - 2]!.params?.params;
  }
  navigation.popTo(
    _to as any,
    {
      params: {
        ...props,
        ..._props,
        __from: _from,
        __hash: Date.now(),
      },
    },
    { merge: merge ?? true }
  );
}
function goBackFC<Props extends NavigationParams<{}>>(
  navigation: NavigationProp<RootScreenParamsList>,
  params?: {
    from?: RootParamsName;
    props?: Props;
    merge?: boolean;
  }
) {
  if (navigation.canGoBack() === false) {
    return;
  }
  const { props, merge } = params ?? {};
  if (props) {
    const routes = navigation.getState().routes;
    const _to = routes[routes.length - 2]!.name;
    const _props = routes[routes.length - 2]!.params?.params;
    navigateFC(navigation, {
      from: params?.from,
      to: _to,
      props: { ..._props, ...props, __hash: Date.now() },
      merge: merge,
    });
  } else {
    navigation.goBack();
  }
}
function replaceFC<Props extends NavigationParams<any>>(
  navigation: NativeStackNavigationProp<RootScreenParamsList>,
  params: {
    from?: RootParamsName;
    to: RootParamsName;
    props?: Props;
  }
) {
  const {
    __from,
    __hash = Date.now(),
    ...others
  } = (params.props as NavigationParams<{}>) ?? ({} as NavigationParams<{}>);
  const routes = navigation.getState().routes;
  __from;
  const _from = params.from ?? routes[routes.length - 1]!.name;
  navigation.replace(
    params.to as any,
    {
      params: {
        ...others,
        __from: _from,
        __hash: __hash,
      },
    } as Props
  );
}
function pushFC<Props extends NavigationParams<any>>(
  navigation: NativeStackNavigationProp<RootScreenParamsList>,
  params: {
    from?: RootParamsName;
    to: RootParamsName;
    props?: Props;
  }
) {
  const {
    __from,
    __hash = Date.now(),
    ...others
  } = (params.props as NavigationParams<{}>) ?? ({} as NavigationParams<{}>);
  const routes = navigation.getState().routes;
  __from;
  const _from = params.from ?? routes[routes.length - 1]!.name;
  navigation.push(
    params.to as any,
    {
      params: {
        ...others,
        __from: _from,
        __hash: __hash,
      },
    } as Props
  );
}

export function useNavigationRoute() {
  const _navigation = useNavigation<NavigationProp<RootScreenParamsList>>();
  const _navigate = React.useCallback(
    <Props extends NavigationParams<any>>(params: {
      from?: RootParamsName;
      to: RootParamsName;
      props?: Props;
      merge?: boolean;
    }) => {
      return navigateFC(_navigation, params as any); // TODO: fix type !!!
    },
    [_navigation]
  );
  const _goBack = React.useCallback(
    <Props extends NavigationParams<any>>(params?: {
      from?: RootParamsName;
      props?: Props;
      merge?: boolean;
    }) => {
      return goBackFC(_navigation, params as any); // TODO: fix type !!!
    },
    [_navigation]
  );
  return {
    navigate: _navigate,
    goBack: _goBack,
    navigation: _navigation,
  };
}
export function useNativeStackRoute() {
  const _navigation =
    useNavigation<NativeStackNavigationProp<RootScreenParamsList>>();
  return useStackScreenRoute({
    navigation: _navigation,
  } as NativeStackScreenProps<RootScreenParamsList>);
}
type useStackScreenRouteProps = NativeStackScreenProps<RootScreenParamsList>;
export function useStackScreenRoute(props: useStackScreenRouteProps) {
  const { navigation: _navigation } = props;
  const basic = useNavigationRoute();
  const _replace = React.useCallback(
    <Props extends NavigationParams<any>>(params: {
      from?: RootParamsName;
      to: RootParamsName;
      props?: Props;
    }) => {
      return replaceFC(_navigation, params);
    },
    [_navigation]
  );
  const _push = React.useCallback(
    <Props extends NavigationParams<any>>(params: {
      from?: RootParamsName;
      to: RootParamsName;
      props?: Props;
    }) => {
      return pushFC(_navigation, params);
    },
    [_navigation]
  );
  const _popTo = React.useCallback(
    <Props extends NavigationParams<any>>(params: {
      from?: RootParamsName;
      to?: RootParamsName;
      props: Props;
      merge?: boolean;
    }) => {
      return popToFC(_navigation, params as any);
    },
    [_navigation]
  );
  return {
    ...basic,
    replace: _replace,
    push: _push,
    navigation: _navigation,
    popTo: _popTo,
    pop: _navigation.pop,
  };
}
