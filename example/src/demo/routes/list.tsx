import type { SearchType } from 'react-native-chat-uikit';

export type RootParamsList = {
  TopMenu: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  Config: {
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
  ConversationList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  SearchConversation: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  ContactList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  SearchContact: {
    option?: {} | undefined;
    params?: { searchType: SearchType } | undefined;
  };
  GroupList: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  SearchGroup: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  GroupParticipantList: {
    option?: {} | undefined;
    params?: { groupId: string } | undefined;
  };
  SearchGroupParticipant: {
    option?: {} | undefined;
    params?: { groupId: string } | undefined;
  };
  NewConversation: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  NewRequests: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  CreateGroup: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  ContactInfo: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  GroupInfo: {
    option?: {} | undefined;
    params?: {} | undefined;
  };
  GroupParticipantInfo: {
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
  Config: {
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
  ConversationList: {
    option: undefined,
    params: undefined,
  },
  SearchConversation: {
    option: undefined,
    params: undefined,
  },
  ContactList: {
    option: undefined,
    params: undefined,
  },
  SearchContact: {
    option: undefined,
    params: undefined,
  },
  GroupList: {
    option: undefined,
    params: undefined,
  },
  SearchGroup: {
    option: undefined,
    params: undefined,
  },
  GroupParticipantList: {
    option: undefined,
    params: undefined,
  },
  SearchGroupParticipant: {
    option: undefined,
    params: undefined,
  },
  NewConversation: {
    option: undefined,
    params: undefined,
  },
  NewRequests: {
    option: undefined,
    params: undefined,
  },
  CreateGroup: {
    option: undefined,
    params: undefined,
  },
  ContactInfo: {
    option: undefined,
    params: undefined,
  },
  GroupInfo: {
    option: undefined,
    params: undefined,
  },
  GroupParticipantInfo: {
    option: undefined,
    params: undefined,
  },
};
export const SCREEN_NAME_LIST: RootParamsNameList = Object.keys(
  SCREEN_LIST
) as (keyof RootParamsList)[];
