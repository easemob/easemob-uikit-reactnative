import { NavigationProp, useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';

import type { RootParamsName, RootScreenParamsList } from '../routes';
import type { NavigationParams } from './types';

// export class LastScreenParams {
//   static _props: any;
//   static _from: string | null;
//   static _hash: number | null;
//   static setParams<Props = any>(props: Props, from: string, hash?: number) {
//     this._props = props;
//     this._from = from;
//     this._hash = hash ?? Date.now();
//   }
//   static getParams<Props = any>(): NavigationParams<Props> {
//     const ret = {
//       ...this._props,
//       from: this._from,
//       hash: this._hash,
//     } as NavigationParams<Props>;
//     return ret;
//   }
//   static clearParams() {
//     this._props = null;
//     this._from = null;
//     this._hash = null;
//   }
// }

// export function createParams<Props>(props: Props, from: string) {
//   return {
//     ...props,
//     __from: from,
//     __hash: Date.now(),
//   } as NavigationParams<Props>;
// }

function navigateFC<Props extends NavigationParams<any>>(
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
function goBackFC<Props extends NavigationParams<any>>(
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

// export function useCreateParams<Props>() {
//   const createParams = React.useCallback((props: Props, from: string) => {
//     return {
//       ...props,
//       from: from,
//       hash: Date.now(),
//     } as NavigationParams<Props>;
//   }, []);
//   return {
//     createParams,
//   };
// }

export function useRoute() {
  const _navigation = useNavigation<NavigationProp<RootScreenParamsList>>();
  const _navigate = React.useCallback(
    <Props extends NavigationParams<any>>(params: {
      from?: RootParamsName;
      to: RootParamsName;
      props?: Props;
      merge?: boolean;
    }) => {
      return navigateFC(_navigation, params);
    },
    [_navigation]
  );
  const _goBack = React.useCallback(
    <Props extends NavigationParams<any>>(params?: {
      from?: RootParamsName;
      props?: Props;
      merge?: boolean;
    }) => {
      return goBackFC(_navigation, params);
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
  const basic = useRoute();
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
  return {
    ...basic,
    replace: _replace,
    push: _push,
    navigation: _navigation,
  };
}
type useStackScreenRouteProps = NativeStackScreenProps<RootScreenParamsList>;
export function useStackScreenRoute(props: useStackScreenRouteProps) {
  const { navigation: _navigation } = props;
  const basic = useRoute();
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
  return {
    ...basic,
    replace: _replace,
    push: _push,
    navigation: _navigation,
  };
}
