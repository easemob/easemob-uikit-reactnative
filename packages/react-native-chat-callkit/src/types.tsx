import type { CallOption, CallUser } from './call';
import type { CallType } from './enums';

/**
 * The property object of the global call component.
 */
export interface CallkitSdkContextType {
  /**
   * important option. See here for details. {@link CallOption}
   */
  option: CallOption;
  /**
   * Whether to activate logging.
   */
  enableLog?: boolean;
  /**
   * The main user gets `rtc token`. See {@link requestRTCToken}
   *
   * Default value is `agora`. Use `agora` if undefined.
   */
  type?: 'easemob' | 'agora' | undefined;
  /**
   * SDK log callback interface.
   */
  logHandler?: (message?: any, ...optionalParams: any[]) => void;
  /**
   * Get the RTC token. It needs to be set by the user during initialization and is called when joining the channel. If you don't set it, you can't make a call normally.
   */
  requestRTCToken: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    /**
     * This value must be set if `type` is `agora`.
     */
    userChannelId?: number;
    /**
     * The default value is `agora`.
     */
    type?: 'easemob' | 'agora' | undefined;
    onResult: (params: { data?: any; error?: any }) => void;
  }) => void;
  /**
   * Get the mapping relationship between user chat id and user rtc id. It needs to be set during initialization. If you don't set it, you can't make a call normally.
   */
  requestUserMap: (params: {
    appKey: string;
    channelId: string;
    userId: string;
    onResult: (params: { data?: any; error?: any }) => void;
  }) => void;
  /**
   * Get current user information. It needs to be set during initialization.
   */
  requestCurrentUser: (params: {
    onResult: (params: { user: CallUser; error?: any }) => void;
  }) => void;
  /**
   * Get user information. If this parameter is not defined, the properties of `SingleCall` ({@link SingleCallProps}) or `MultiCall` ({@link MultiCallProps}), or the default value, will be used. If the result is normal, it will be cached. The cache is destroyed after the UI component is unmounted.
   */
  requestUserInfo?: (params: {
    userId: string;
    onResult: (params: { user: CallUser; error?: any }) => void;
  }) => void;

  /**
   * Get the content of the invitation. If this parameter is not defined, the properties of `SingleCall` ({@link SingleCallProps}) or `MultiCall` ({@link MultiCallProps}), or the default value, will be used.
   */
  requestInviteContent?: (callType: CallType) => string;
}

/**
 * User Info. Mainly used in multi-person calls. as call status information.
 */
export type User = {
  /**
   * The user chat ID.
   */
  userId: string;
  /**
   * The user RTC channel ID.
   */
  userChannelId?: number;
  /**
   * Whether the user has joined the channel.
   */
  userHadJoined: boolean;
  /**
   * Whether the current user is yourself.
   */
  isSelf: boolean;
  /**
   * The user nick name.
   */
  userName?: string;
  /**
   * The user avatar url.
   */
  userAvatar?: string;
  /**
   * Whether the user disabled the microphone.
   */
  muteAudio?: boolean;
  /**
   * Whether the user disabled the camera.
   */
  muteVideo?: boolean;
  /**
   * Whether the user is speaking.
   */
  talking?: boolean;
};
