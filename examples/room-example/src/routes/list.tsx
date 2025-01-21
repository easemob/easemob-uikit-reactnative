export type RootParamsList = {
  TopMenu: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Login: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  LoginList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  ChatroomList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  TestChatroom: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  TestReport: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  TestSearchParticipant: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Config: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
};
export type RootParamsName = Extract<keyof RootParamsList, string>;
export type RootParamsNameList = RootParamsName[];
export type RootScreenParamsList<
  T extends {} = RootParamsList,
  U extends string = 'option'
> = {
  [K in keyof T]: Omit<T[K], U>;
};

export const SCREEN_LIST: RootParamsList = {
  TopMenu: {
    option: undefined,
    params: undefined,
  },
  Login: {
    option: undefined,
    params: undefined,
  },
  LoginList: {
    option: undefined,
    params: undefined,
  },
  ChatroomList: {
    option: undefined,
    params: undefined,
  },
  TestChatroom: {
    option: undefined,
    params: undefined,
  },
  TestReport: {
    option: undefined,
    params: undefined,
  },
  TestSearchParticipant: {
    option: undefined,
    params: undefined,
  },
  Config: {
    option: undefined,
    params: undefined,
  },
};
export const SCREEN_NAME_LIST: RootParamsNameList = Object.keys(
  SCREEN_LIST
) as (keyof RootParamsList)[];
