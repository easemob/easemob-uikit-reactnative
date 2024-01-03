export type Deleter = () => void;
export type MessageInit = {};
export type MessageApi = {
  addListener: (
    onUpdateUserInfo: (params: {
      userId: string;
      userName?: string;
      userAvatar?: string;
    }) => void
  ) => Deleter;
  getUserInfo: (
    userId: string
  ) => { userName?: string; userAvatar?: string } | undefined;
  dispatchUserInfo: (params: {
    userId: string;
    userName?: string;
    userAvatar?: string;
  }) => void;
};
