export type CallbackParams = Parameters<Callback>;
export type CallbackReturn = ReturnType<Callback>;
// export type Callback = (...args: any[]) => any;
export type Callback = (...args: any) => any;
export type CallbackT<Params, Return> = (args: Params) => Return;
