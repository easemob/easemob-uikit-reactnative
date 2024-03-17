import type { StyleProp, ViewStyle } from 'react-native';

export type AbsoluteViewRef = {
  /**
   * Shows the last set component.
   */
  show: () => void;
  /**
   * Hides the last set component.
   */
  hide: () => void;

  /**
   * Create and initialize components.
   */
  showWithProps: (props: AbsoluteViewProps) => void;

  /**
   * Destroy the component. Unlike `hide`, the component's life cycle will end. Call the corresponding life cycle interface.
   */
  destroy: () => void;
};

export type AbsoluteViewProps = React.PropsWithChildren<{
  /**
   * Style layout.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Object controller.
   */
  propsRef?: React.RefObject<AbsoluteViewRef>;
}>;

export type AbsoluteViewContextType = {
  /**
   * Get the reference of the AbsoluteView.
   */
  getAbsoluteViewRef: () => AbsoluteViewRef;
};
