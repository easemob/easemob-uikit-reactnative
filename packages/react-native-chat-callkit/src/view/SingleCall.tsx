import { BlurView } from '@react-native-community/blur';
import * as React from 'react';
import { Dimensions, Platform, Pressable, Text, View } from 'react-native';
import {
  RtcSurfaceView,
  RtcTextureView,
  VideoViewSetupMode,
} from 'react-native-agora';

import { calllog, KeyTimeout } from '../call/CallConst';
import { createManagerImpl } from '../call/CallManagerImpl';
import type { CallUser } from '../call/CallUser';
import { CallEndReason, CallState } from '../enums';
import {
  BasicCall,
  BasicCallProps,
  BasicCallState,
  BottomButtonType,
  StateBarHeight,
} from './BasicCall';
import { DefaultAvatar, DefaultAvatarMemo } from './components/Avatar';
import Draggable from './components/Draggable';
import { Elapsed } from './components/Elapsed';
import { IconButton } from './components/IconButton';
import { MiniButton } from './components/MiniButton';

/**
 * Single call attribute object.
 */
export type SingleCallProps = BasicCallProps & {
  /**
   * The invitee ID.
   */
  inviteeId: string;
  /**
   * The invitee Name.
   */
  inviteeName?: string;
  /**
   * The invitee Avatar url.
   */
  inviteeAvatar?: string;
  /**
   * Notification that the other party has joined.
   */
  onPeerJoined?: () => void;
};

/**
 * Single call status object.
 */
export type SingleCallState = BasicCallState & {
  /**
   * Whether the peer has joined.
   */
  peerJoinChannelSuccess: boolean;
  /**
   * Whether the peer has disables the camera.
   */
  peerMuteVideo: boolean;
  /**
   * Whether the peer has disabled the microphone.
   */
  peerMuteAudio: boolean;
  /**
   * The peer RTC channel ID.
   */
  peerUid: number;
  /**
   * Whether to switch the local camera.
   */
  isSwitchVideo: boolean;
  /**
   * The peer information. Include name and avatar.
   */
  peerInfo?: CallUser;
};

/**
 * Single call UI component. The common part is detailed here. {@link BasicCall}
 */
export class SingleCall extends BasicCall<SingleCallProps, SingleCallState> {
  constructor(props: SingleCallProps) {
    super(props);
    this.state = {
      isMinimize: props.isMinimize ?? false,
      callState: props.callState ?? CallState.Connecting,
      bottomButtonType:
        props.bottomButtonType ??
        (this.isInviter
          ? props.callType === 'audio'
            ? 'inviter-audio'
            : 'inviter-video'
          : props.callType === 'audio'
          ? 'invitee-audio-init'
          : 'invitee-video-init'),
      muteVideo: props.muteVideo ?? false,
      joinChannelSuccess: false,
      peerJoinChannelSuccess: false,
      elapsed: 0,
      selfUid: 0,
      peerUid: 1,
      setupMode: VideoViewSetupMode.VideoViewSetupAdd,
      isSwitchVideo: false,
      muteMicrophone: false,
      isInSpeaker: true,
      peerMuteVideo: false,
      peerMuteAudio: false,
    };
  }

  protected init(): void {
    if (this.props.isTest === true) {
      return;
    }
    this.manager = createManagerImpl();
    this.manager?.setCurrentUser({
      userId: this.props.currentId,
      userName: this.props.currentName,
      userAvatarUrl: this.props.currentAvatar,
    });

    this.manager?.initRTC();

    if (this.props.callType === 'audio') {
      this.manager?.enableAudio();
    } else {
      this.manager?.enableVideo();
      this.manager?.startPreview();
      this._startPreview = true;
    }

    this.manager?.addViewListener(this);
    this.props.onInitialized?.();
    if (this.isInviter === true) {
      if (this.state.callState === CallState.Connecting) {
        this.startCall();
      }
    } else {
      this._inviteeTimer = setTimeout(() => {
        this.onClickClose();
      }, this.props.timeout ?? KeyTimeout);
    }

    if (this.props.inviteeName || this.props.inviteeAvatar) {
      this.manager?.setUsers({
        userId: this.props.inviteeId,
        userName: this.props.inviteeName,
        userAvatarUrl: this.props.inviteeAvatar,
      } as CallUser);
    }
    if (this.props.inviterName || this.props.inviterAvatar) {
      this.manager?.setUsers({
        userId: this.props.inviterId,
        userName: this.props.inviterName,
        userAvatarUrl: this.props.inviterAvatar,
      } as CallUser);
    }
    this.getPeerInfo();
  }
  protected unInit(): void {
    if (this.props.isTest === true) {
      return;
    }
    if (this.props.callType === 'audio') {
      // this.manager?.disableAudio();
    } else {
      // this.manager?.disableVideo();
      // this.manager?.stopPreview();
      // this.setState({
      //   startPreview: false,
      //   joinChannelSuccess: false,
      //   peerJoinChannelSuccess: false,
      // });
    }

    this.manager?.unInitRTC();

    this.manager?.removeViewListener(this);
    this.manager?.clear();
  }

  private startCall() {
    if (this.manager) {
      const channelId = this.manager.createChannelId();
      this.channelId = channelId;
      switch (this.props.callType) {
        case 'audio':
          this.manager.startSingleAudioCall({
            inviteeId: this.props.inviteeId,
            channelId: channelId,
            onResult: (params) => {
              calllog.log('SingleCall:startSingleAudioCall:', params);
              if (params.error) {
                this.onCallOccurError({ channelId, error: params.error });
              }
              if (params.callId) {
                this.callId = params.callId;
              }
            },
          });
          break;
        case 'video':
          this.manager.startSingleVideoCall({
            inviteeId: this.props.inviteeId,
            channelId: channelId,
            onResult: (params) => {
              calllog.log('SingleCall:startSingleVideoCall:', params);
              if (params.error) {
                this.onCallOccurError({ channelId, error: params.error });
              }
              if (params.callId) {
                this.callId = params.callId;
              }
            },
          });
          break;
        default:
          break;
      }
    }
  }

  private updateBottomButtons(): void {
    const { peerJoinChannelSuccess, joinChannelSuccess } = this.state;
    if (peerJoinChannelSuccess && joinChannelSuccess) {
      if (this.isInviter === false) {
        let s;
        if (this.props.callType === 'audio') {
          s = 'invitee-audio-calling' as BottomButtonType;
        } else {
          s = 'invitee-video-calling' as BottomButtonType;
        }
        this.setState({ bottomButtonType: s });
      }
    }
  }

  protected renderMiniVideoIsSelf(): boolean | null {
    calllog.log('SingleCall:renderMiniVideoIsSelf:');
    if (this.props.callType === 'audio') {
      return null;
    }
    const { isSwitchVideo, isMinimize, callState } = this.state;
    let ret = null;
    if (callState === CallState.Calling) {
      if (isMinimize === true) {
        ret = false;
      } else {
        if (isSwitchVideo === true) {
          ret = false;
        } else {
          ret = true;
        }
      }
    } else {
      if (isMinimize === true) {
        ret = false;
      } else {
        if (isSwitchVideo === true) {
          ret = true;
        } else {
          ret = false;
        }
      }
    }
    return ret;
  }

  private async getUserInfo(userId: string): Promise<CallUser | undefined> {
    const ret = this.manager?.getUserInfo(userId);
    if (ret === undefined) {
      const _ret = await this.getUserInfoAsync(userId);
      if (_ret) {
        this.manager?.setUsers(_ret);
      }
      return _ret;
    }
    return ret;
  }

  private getName(userId: string): string {
    const { peerInfo } = this.state;
    if (userId === this.props.currentId) {
      return this.props.currentName ?? this.props.currentId;
    } else {
      return peerInfo?.userName ?? userId;
    }
  }

  private getAvatar(userId: string): string | undefined {
    const { peerInfo } = this.state;
    let ret;
    if (userId === this.props.currentId) {
      ret = this.props.currentAvatar ?? this.props.currentAvatar;
    } else {
      ret = peerInfo?.userAvatarUrl;
    }
    return ret;
  }

  private getPeerInfo(): void {
    const userId =
      this.props.currentId === this.props.inviteeId
        ? this.props.inviterId
        : this.props.inviteeId;
    this.getUserInfo(userId)
      .then((user) => {
        if (user) {
          const { peerInfo } = this.state;
          if (peerInfo === undefined) {
            this.setState({
              peerInfo: {
                userId: user?.userId,
                userName: user?.userName,
                userAvatarUrl: user?.userAvatarUrl,
              },
            });
          }
        }
      })
      .catch((e) => {
        calllog.warn(e);
      });
  }

  //////////////////////////////////////////////////////////////////////////////
  //// OnButton ////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onSwitchVideo = () => {
    calllog.log(
      'SingleCall:onClickAccept:onSwitchVideo:',
      this.state.isSwitchVideo
    );
    this.setState({ isSwitchVideo: !this.state.isSwitchVideo });
  };

  //////////////////////////////////////////////////////////////////////////////
  //// CallViewListener ////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onRequestJoin(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    userRTCToken: string;
  }): void {
    calllog.log('SingleCall:onRequestJoin:', params);
    this.manager?.joinChannel(params);
  }

  onRemoteUserJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('SingleCall:onRemoteUserJoined:', params);
    this.setState({
      peerJoinChannelSuccess: true,
      peerUid: params.userChannelId,
    });
    this.updateBottomButtons();
    this.props.onPeerJoined?.();
  }

  onSelfJoined(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
    elapsed: number;
  }): void {
    calllog.log('SingleCall:onSelfJoined:', params);
    this.setState({
      joinChannelSuccess: true,
      elapsed: params.elapsed,
      selfUid: params.userChannelId,
    });
    this.setState({ callState: CallState.Calling });
    this.updateBottomButtons();
    this.props?.onSelfJoined?.();
  }

  onRemoteUserOffline(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('SingleCall:onRemoteUserOffline:', params);
    this.setState({ peerJoinChannelSuccess: false });
  }

  onRemoveRemoteUser(params: {
    channelId: string;
    userChannelId?: number;
    userId: string;
    reason?: CallEndReason;
  }): void {
    calllog.log('SingleCall:onRemoveRemoteUser:', params);
  }

  onSelfLeave(params: {
    channelId: string;
    userChannelId: number;
    userId: string;
  }): void {
    calllog.log('SingleCall:onSelfLeave:', params);
    this.setState({ joinChannelSuccess: false });
  }

  onRemoteUserMuteVideo(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('SingleCall:onRemoteUserMuteVideo:', params);
    this.setState({ peerMuteVideo: params.muted });
  }

  onRemoteUserMuteAudio(params: {
    channelId: string;
    userId: string;
    userChannelId: number;
    muted: boolean;
  }): void {
    calllog.log('SingleCall:onRemoteUserMuteAudio:', params);
    this.setState({ peerMuteAudio: params.muted });
  }

  //////////////////////////////////////////////////////////////////////////////
  //// Render //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  protected renderSelfVideo(): React.ReactNode {
    const {
      isMinimize,
      setupMode,
      joinChannelSuccess,
      callState,
      selfUid,
      muteVideo,
    } = this.state;
    calllog.log('SingleCall:renderSelfVideo:', selfUid);
    if (isMinimize === true) {
      return null;
    }
    if (this.props.callType === 'audio') {
      return null;
    }
    if (callState === CallState.Idle) {
      return null;
    }
    if (this._startPreview !== true && joinChannelSuccess !== true) {
      return null;
    }
    if (muteVideo === true) {
      return null;
    }
    if (Platform.OS === 'android') {
      return (
        <RtcTextureView
          style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          canvas={{
            uid: 0,
            setupMode,
          }}
          key={selfUid}
        />
      );
    } else {
      return (
        <RtcSurfaceView
          style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          canvas={{
            uid: 0,
            setupMode,
          }}
          key={selfUid}
        />
      );
    }
  }

  protected renderPeerVideo(): React.ReactNode {
    const {
      peerUid,
      peerMuteVideo,
      setupMode,
      peerJoinChannelSuccess,
      callState,
    } = this.state;
    calllog.log('SingleCall:renderPeerVideo:', peerUid);
    if (this.props.callType === 'audio') {
      return null;
    }
    if (callState === CallState.Idle) {
      return null;
    }
    if (peerJoinChannelSuccess !== true) {
      return null;
    }
    if (peerMuteVideo === true) {
      return null;
    }
    if (Platform.OS === 'android') {
      return (
        <RtcTextureView
          style={{ flex: 1 }}
          canvas={{
            uid: peerUid,
            setupMode,
          }}
          key={peerUid}
        />
      );
    } else {
      return (
        <RtcSurfaceView
          style={{ flex: 1 }}
          canvas={{
            uid: peerUid,
            setupMode,
          }}
          key={peerUid}
        />
      );
    }
  }

  protected renderMiniVideo(): React.ReactNode {
    calllog.log('SingleCall:renderMiniVideo:');
    const ret = this.renderMiniVideoIsSelf();
    if (ret === null) {
      return null;
    }
    if (ret === true) {
      return this.renderSelfVideo();
    } else {
      return this.renderPeerVideo();
    }
  }

  protected renderFullVideo(): React.ReactNode {
    calllog.log('SingleCall:renderFullVideo:');
    if (this.props.callType === 'audio') {
      return null;
    }
    const { isSwitchVideo, isMinimize, callState } = this.state;
    // let renderType = 0 as 0 | 1 | 2; // 0: no, 1: self, 2: peer
    let ret = null;
    if (callState === CallState.Calling) {
      if (isMinimize === false) {
        if (isSwitchVideo === true) {
          ret = this.renderSelfVideo();
        } else {
          ret = this.renderPeerVideo();
        }
      }
    } else {
      if (isMinimize === false) {
        if (isSwitchVideo === true) {
          ret = this.renderPeerVideo();
        } else {
          ret = this.renderSelfVideo();
        }
      }
    }
    return ret;
  }

  protected renderTopBar(): React.ReactNode {
    const { callType } = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: StateBarHeight,
          // backgroundColor: 'red',
        }}
      >
        <View
          style={{
            marginLeft: 15,
          }}
        >
          <MiniButton
            iconName="chevron_left"
            color="white"
            backgroundColor="rgba(0, 0, 0, 0.0)"
            size={28}
            onPress={() => {
              this.setState({ isMinimize: true });
            }}
          />
        </View>
        <View style={{ flexGrow: 1 }} />
        {callType === 'video' ? (
          <View
            style={{
              marginRight: 15,
            }}
          >
            <IconButton
              iconName="camera_spin"
              color="white"
              backgroundColor="rgba(255, 255, 255, 0.2)"
              size={28}
              containerSize={40}
              onPress={this.switchCamera}
            />
          </View>
        ) : null}
      </View>
    );
  }
  protected renderAvatar(): React.ReactNode {
    const { callType, inviteeId, inviterId, currentId } = this.props;
    const { callState } = this.state;
    return (
      <View
        style={{
          alignItems: 'center',
          // backgroundColor: 'red',
        }}
      >
        <View style={{ height: 60 }} />
        <DefaultAvatar
          userId={currentId === inviterId ? inviteeId : inviterId}
          userAvatar={this.getAvatar(
            currentId === inviterId ? inviteeId : inviterId
          )}
          size={100}
          radius={100}
        />
        <View style={{ marginVertical: 10 }}>
          <Text
            style={{
              fontSize: 24,
              lineHeight: 28.64,
              fontWeight: '600',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {this.getName(currentId === inviterId ? inviteeId : inviterId)}
          </Text>
        </View>
        {callState === CallState.Calling ? (
          <Elapsed timer={this.manager?.elapsed ?? 0} color="white" />
        ) : (
          <Text
            style={{
              fontSize: 16,
              lineHeight: 22,
              fontWeight: '400',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {this.isInviter === true
              ? 'Calling'
              : callType === 'audio'
              ? 'Audio Call'
              : 'Video Call'}
          </Text>
        )}
      </View>
    );
  }

  protected renderFloatAudio(): React.ReactNode {
    const { inviterId, inviteeId, currentId } = this.props;
    const { callState } = this.state;
    const content = 'Calling...';
    return (
      <View
        style={{
          width: 76,
          height: 76,
          // position: 'absolute',
          backgroundColor: 'grey',
          // right: 10,
          // top: 54,
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DefaultAvatar
            userId={currentId === inviterId ? inviteeId : inviterId}
            userAvatar={this.getAvatar(
              currentId === inviterId ? inviteeId : inviterId
            )}
            size={36}
            radius={36}
          />
          {callState === CallState.Calling ? (
            <Elapsed timer={this.manager?.elapsed ?? 0} />
          ) : (
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontWeight: '400',
                textAlign: 'center',
              }}
            >
              {content}
            </Text>
          )}
        </View>
      </View>
    );
  }

  protected renderFloatVideo(): React.ReactNode {
    const { currentId, inviteeId, inviterId } = this.props;
    const { isMinimize, muteVideo, peerMuteVideo } = this.state;
    const content = 'Calling...';

    const _isRenderVideo = () => {
      const isRenderSelf = this.renderMiniVideoIsSelf();
      if (isRenderSelf === true) {
        return muteVideo === false ? true : false;
      } else if (isRenderSelf === false) {
        return peerMuteVideo === false ? true : false;
      } else {
        return false;
      }
    };

    if (isMinimize === true) {
      return (
        <View
          style={{
            width: _isRenderVideo() === true ? 90 : 76,
            height: _isRenderVideo() === true ? 160 : 76,
            // position: 'absolute',
            backgroundColor: 'grey',
            // right: 10,
            // top: 54,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {this.renderMiniVideo()}
          {_isRenderVideo() === true ? (
            <View
              style={{
                flex: 1,
                marginBottom: 10,
                alignSelf: 'center',
                // backgroundColor: 'green',
                position: 'absolute',
                bottom: 7,
              }}
            >
              <Elapsed timer={this.manager?.elapsed ?? 0} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DefaultAvatar
                userId={currentId === inviterId ? inviteeId : inviterId}
                userAvatar={this.getAvatar(
                  currentId === inviterId ? inviteeId : inviterId
                )}
                size={36}
                radius={36}
              />
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontWeight: '400',
                  textAlign: 'center',
                }}
              >
                {content}
              </Text>
            </View>
          )}
        </View>
      );
    } else {
      if (this.state.peerJoinChannelSuccess === false) {
        return null;
      }
      return (
        <Pressable
          onPress={this.onSwitchVideo}
          style={{
            width: _isRenderVideo() === true ? 90 : 76,
            height: _isRenderVideo() === true ? 160 : 76,
            position: 'absolute',
            backgroundColor: 'grey',
            right: 10,
            top: 10,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {this.renderMiniVideo()}
          {_isRenderVideo() === true ? null : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#909090',
                borderRadius: 12,
              }}
            >
              <DefaultAvatar
                userId={currentId === inviterId ? inviteeId : inviterId}
                userAvatar={this.getAvatar(
                  currentId === inviterId ? inviteeId : inviterId
                )}
                size={36}
                radius={36}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 7,
                  right: 7,
                  // backgroundColor: 'red',
                  width: 16,
                  height: 16,
                }}
              >
                <MiniButton
                  iconName="video_slash"
                  size={16}
                  color="white"
                  backgroundColor="rgba(0,0,0,0.0)"
                />
              </View>
            </View>
          )}
        </Pressable>
      );
    }
  }
  protected renderContent(): React.ReactNode {
    const { callType } = this.props;
    const { callState } = this.state;
    let content = null;
    if (
      callType === 'audio' ||
      (this.isInviter === true && callState !== CallState.Calling)
    ) {
      content = this.renderAvatar();
    } else {
      content = this.renderFloatVideo();
    }
    return (
      <View
        style={{
          // flex: 1,
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
          top: 100,
        }}
      >
        {content}
      </View>
    );
  }
  protected renderBlur(): React.ReactNode {
    const { callType, currentId, inviteeId, inviterId } = this.props;
    const { isMinimize, peerInfo } = this.state;
    const { height, width } = Dimensions.get('window');
    if (isMinimize === false && callType === 'audio') {
      return (
        <View
          style={{
            position: 'absolute',
            flex: 1,
            height,
            width,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <DefaultAvatarMemo
            userId={currentId === inviterId ? inviteeId : inviterId}
            userAvatar={peerInfo?.userAvatarUrl}
            size={height > width ? height : width}
          />
          <BlurView
            style={{ position: 'absolute', flex: 1, height, width }}
            blurType="dark" // Values = dark, light, xlight .
            blurAmount={10}
            reducedTransparencyFallbackColor="red"
          />
        </View>
      );
    }
    return null;
  }
  protected renderBody(): React.ReactNode {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('window');
    const { callType } = this.props;
    const { isMinimize } = this.state;
    if (isMinimize) {
      let ret;
      if (callType === 'audio') {
        ret = this.renderFloatAudio();
      } else {
        ret = this.renderFloatVideo();
      }
      return (
        <Draggable
          x={Dimensions.get('window').width - (callType === 'audio' ? 86 : 100)}
          y={54}
          onShortPressRelease={() => {
            this.setState({ isMinimize: false });
          }}
        >
          {ret}
        </Draggable>
      );
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'rgb(199, 197, 208)',
        }}
      >
        {this.renderFullVideo()}
        {/* <View style={{ flex: 1, backgroundColor: 'blue' }} /> */}
        {this.renderBlur()}
        {this.renderContent()}
        {this.renderTopBar()}
        {this.renderBottomMenu()}
      </View>
    );
  }
}
