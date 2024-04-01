export type SimpleToastTask = {
  message: string;
  timeout?: number;
  showPosition?: 'top' | 'center' | 'bottom';
};

export type SimpleToastRef = {
  show: (task: SimpleToastTask) => void;
};
export type SimpleToastProps = {
  propsRef: React.RefObject<SimpleToastRef>;
  timeout?: number;
  showPosition?: 'top' | 'center' | 'bottom';
};

export type SimpleToastType = {
  getSimpleToastRef: () => SimpleToastRef;
};

export type ToastViewTask = {
  children: React.ComponentType<any> | React.ReactElement | null | undefined;
  timeout?: number;
  showPosition?: 'top' | 'center' | 'bottom';
};

export type ToastViewRef = {
  show: (task: ToastViewTask) => void;
};
export type ToastViewProps = {
  propsRef: React.RefObject<ToastViewRef>;
  timeout?: number;
  showPosition?: 'top' | 'center' | 'bottom';
};

export type ToastViewType = {
  getToastViewRef: () => ToastViewRef;
};
