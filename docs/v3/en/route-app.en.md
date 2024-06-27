[Return to Parent Document](./index.en.md)

# Routing

The official React-Native platform does not provide a built-in routing tool. Currently, the mainstream routing third-party libraries are `react-navigation` and `react-native-navigation`.

In the example project `example`, `react-navigation` is used for routing.

Its name indicates that this library supports web routing related to `react` and also mobile routing. It offers a `native-stack` sub-component library.

The library is also encapsulated in the `example`, mainly for handling cases where parameters are returned.

This reduces the cost of demo development. Refer to `example/src/demo/hooks/useNavigationRoute.tsx` for more details.

Further details can be found in the `example/src/demo/screens` directory.
