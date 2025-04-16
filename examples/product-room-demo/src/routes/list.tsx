export type RootParamsList = {
  Splash: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Login: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  ChannelList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Chatroom: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  SearchMember: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
};
export type RootParamsName = Extract<keyof RootParamsList, string>;
export type RootParamsNameList = RootParamsName[];
export type RootScreenParamsList<
  T extends {} = RootParamsList,
  U extends string = 'option',
> = {
  [K in keyof T]: Omit<T[K], U>;
};

export const SCREEN_LIST: RootParamsList = {
  Splash: {
    option: undefined,
    params: undefined,
  },
  Login: {
    option: undefined,
    params: undefined,
  },
  ChannelList: {
    option: undefined,
    params: undefined,
  },
  Chatroom: {
    option: undefined,
    params: undefined,
  },
  SearchMember: {
    option: undefined,
    params: undefined,
  },
};
export const SCREEN_NAME_LIST: RootParamsNameList = Object.keys(
  SCREEN_LIST
) as (keyof RootParamsList)[];
