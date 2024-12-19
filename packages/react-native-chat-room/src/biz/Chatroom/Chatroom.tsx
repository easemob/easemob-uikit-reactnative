import * as React from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { Config, ConfigContext } from '../../config';
import type { UIKitError } from '../../error';
import { I18nContext, I18nTr } from '../../i18n';
import { RoomContext, RoomService, RoomServiceListener } from '../../room';
import {
  GiftMessageList,
  GiftMessageListComponent,
  GiftMessageListProps,
  GiftMessageListRef,
} from '../GiftMessageList';
import { gGiftEffectListHeight } from '../GiftMessageList/GiftMessageList.const'; // for test
import {
  GlobalBroadcast,
  GlobalBroadcastComponent,
  GlobalBroadcastProps,
  GlobalBroadcastRef,
} from '../GlobalBroadcast';
import {
  MessageInput,
  MessageInputComponent,
  MessageInputProps,
  MessageInputRef,
} from '../MessageInput';
import { gInputBarStyleHeight } from '../MessageInput/MessageInput.const';
import {
  MessageList,
  MessageListComponent,
  MessageListProps,
  MessageListRef,
} from '../MessageList';
import { gMessageListHeight } from '../MessageList/MessageList.const'; // for test
import {
  MessagePin,
  MessagePinComponent,
  MessagePinProps,
  MessagePinRef,
} from '../MessagePin';
import {
  BottomSheetParticipantList,
  BottomSheetParticipantListComponent,
  BottomSheetParticipantListProps,
  BottomSheetParticipantListRef,
} from '../ParticipantList';
import type { PropsWithError, PropsWithTest } from '../types';

/**
 * Data model for the Chatroom component.
 */
type ChatroomModel = {
  roomId: string;
  ownerId: string;
};

type LayoutMode = {
  /**
   * Layout mode.
   *
   * default: 'relative'
   */
  position?: 'absolute' | 'relative' | undefined;
};
/**
 * Properties of the `Chatroom` component.
 */
export type ChatroomProps = React.PropsWithChildren<
  {
    /**
     * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Style of the MessagePin and GlobalBroadcast.
     */
    messagePinAndBroadcastContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Renderer for the GiftMessageList component. If not set, the built-in one is used.
     *
     * You can set whether to load through `RoomOption.gift`.
     */
    GiftMessageList?: GiftMessageListComponent;
    /**
     * Renderer for the GlobalBroadcast component. If not set, the built-in one is used.
     *
     * You can set whether to load through `RoomOption.globalBroadcast`.
     */
    GlobalBroadcast?: GlobalBroadcastComponent;
    /**
     * Renderer for the MessagePin component. If not set, the built-in one is used.
     *
     * You can set whether to load through `RoomOption.messagePin`.
     */
    MessagePin?: MessagePinComponent;
    /**
     * Renderer for the MessageList component. If not set, the built-in one is used.
     */
    MessageList?: MessageListComponent;
    /**
     * Renderer for the MessageInput component. If not set, the built-in one is used.
     */
    MessageInput?: MessageInputComponent;
    /**
     * Properties of the BottomSheetParticipantList component. If not set, the default value is used.
     */
    BottomSheetParticipantList?: BottomSheetParticipantListComponent;
    /**
     * Properties of the MessageInput component. If not set, the default value is used.
     */
    input?: {
      props?: Omit<
        MessageInputProps,
        'onInputBarWillShow' | 'onInputBarWillHide' | 'onSend'
      >;
    };
    /**
     * Properties of the MessageList component. If not set, the default value is used.
     */
    messageList?: {
      props?: Omit<
        MessageListProps,
        'onRequestCloseInputBar' | 'isInputBarShow' | 'onLongPressItem'
      >;
    };
    /**
     * Properties of the Message pin component. If not set, the default value is used.
     */
    messagePin?: {
      props?: MessagePinProps;
    };
    /**
     * Properties of the GlobalBroadcast component. If not set, the default value is used.
     */
    globalBroadcast?: {
      props?: GlobalBroadcastProps;
    };
    /**
     * Properties of the GiftMessageList component. If not set, the default value is used.
     */
    gift?: {
      props?: GiftMessageListProps;
    };
    /**
     * Properties of the ParticipantList component. If not set, the default value is used.
     */
    participantList?: {
      props?: BottomSheetParticipantListProps;
    };
    /**
     * Renderer for the background view.
     *
     * Typical usage scenarios: placing background images and placing live videos.
     */
    backgroundView?: React.ReactElement;
  } & ChatroomModel &
    LayoutMode &
    PropsWithTest &
    PropsWithError
>;
/**
 * State variable of the `Chatroom` component.
 */
type ChatroomState = {
  isInputBarShow: boolean;
  pageY: number;
};

let GGiftEffect: GiftMessageListComponent;
let GGlobalBroadcast: GlobalBroadcastComponent;
let GMessagePin: MessagePinComponent;
let GMessageList: MessageListComponent;
let GMessageInput: MessageInputComponent;
let GBottomSheetParticipantList: BottomSheetParticipantListComponent;

/**
 * Component for chat room.
 *
 * The ChatroomBase component defines properties and UI styles. The business logic part is separated into `Chatroom`.
 *
 * The Chatroom component is a first-level component, and there are sub-components below. Errors in the request network or caused by business problems will be notified through `RoomServiceListener.onError`. If the request network ends, it will be notified through `RoomServiceListener.onFinished`.
 */
export abstract class ChatroomBase extends React.PureComponent<
  ChatroomProps,
  ChatroomState
> {
  /**
   * Reference to the MessageInput component.
   */
  inputBarRef?: React.RefObject<MessageInputRef>;
  /**
   * Reference to the MessageList component.
   */
  messageRef?: React.RefObject<MessageListRef>;
  /**
   * Reference to the MessagePin component.
   */
  messagePinRef?: React.RefObject<MessagePinRef>;
  /**
   * Reference to the GlobalBroadcast component.
   */
  globalBroadcastRef?: React.RefObject<GlobalBroadcastRef>;
  /**
   * Reference to the GiftMessageList component.
   */
  giftRef?: React.RefObject<GiftMessageListRef>;
  /**
   * Reference to the ParticipantList component.
   */
  memberRef?: React.RefObject<BottomSheetParticipantListRef>;
  /**
   * Reference to the container.
   */
  containerRef?: React.RefObject<View>;
  /**
   * IM service.
   */
  im?: RoomService;
  /**
   * Global Configuration.
   */
  config?: Config;
  /**
   * Internationalization service.
   */
  i18n?: I18nTr;
  /**
   * IM service listener.
   */
  listener?: RoomServiceListener;
  constructor(props: ChatroomProps) {
    super(props);

    this.inputBarRef = React.createRef();
    this.messageRef = React.createRef();
    this.messagePinRef = React.createRef();
    this.globalBroadcastRef = React.createRef();
    this.giftRef = React.createRef();
    this.memberRef = React.createRef();
    this.containerRef = React.createRef();

    GGiftEffect = props.GiftMessageList ?? GiftMessageList;
    GGlobalBroadcast = props.GlobalBroadcast ?? GlobalBroadcast;
    GMessagePin = props.MessagePin ?? MessagePin;
    GMessageList = props.MessageList ?? MessageList;
    GMessageInput = props.MessageInput ?? MessageInput;
    GBottomSheetParticipantList =
      props.BottomSheetParticipantList ?? BottomSheetParticipantList;

    this.state = {
      isInputBarShow: false,
      pageY: 0,
    };
  }

  /**
   * Get the reference of the MessageInput component.
   * @returns GlobalBroadcastRef | null.
   */
  getGlobalBroadcastRef() {
    return this.globalBroadcastRef?.current;
  }

  /**
   * Get the reference of the MessageInput component.
   * @returns GiftMessageListRef | null.
   */
  getGiftMessageListRef() {
    return this.giftRef?.current;
  }

  /**
   * Get the reference of the MessageInput component.
   * @returns BottomSheetParticipantListRef | null.
   */
  getParticipantListRef() {
    return this.memberRef?.current;
  }

  /**
   * Get the reference of the MessageInput component.
   * @returns MessageListRef | null.
   */
  getMessageListRef() {
    return this.messageRef?.current;
  }

  /**
   * Get the reference of the MessagePin component.
   * @returns MessagePinRef | null.
   */
  getMessagePinRef() {
    return this.messagePinRef?.current;
  }

  /**
   * Join chatroom.
   *
   * Different from `RoomService`, it will update the internal state of UI components. It is not recommended to use `RoomService.joinRoom` directly
   *
   * @params
   * - roomId: Room ID.
   * - ownerId: Room owner ID.
   * - result: Callback for joining chatroom.
   */
  abstract joinRoom(params: {
    roomId: string;
    ownerId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void;
  abstract leaveRoom(params: {
    roomId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void;

  _getMessageListTop() {
    const mh = gMessageListHeight;
    const ih = gInputBarStyleHeight;
    if (Platform.OS === 'ios') {
      return (
        Dimensions.get('window').height -
        ih - //
        mh -
        34 - // bottom height
        94
      ); // navigator header height
    } else {
      return (
        Dimensions.get('window').height -
        ih -
        mh -
        0 - // bottom height
        56 - // navigator header height
        (StatusBar.currentHeight ?? 0) // android platform
      );
    }
  }

  _getGiftTop() {
    return this._getMessageListTop() - gGiftEffectListHeight;
  }

  componentDidMount?(): void {}
  componentWillUnmount?(): void {}
  componentDidCatch?(_error: Error, _errorInfo: React.ErrorInfo): void {}

  render() {
    return (
      <RoomContext.Consumer>
        {(im) => {
          this.im = im;
          return (
            <ConfigContext.Consumer>
              {(config) => {
                return (
                  <I18nContext.Consumer>
                    {(t) => {
                      this.i18n = t;
                      this.config = config;
                      const { position = 'relative' } = this.props;
                      if (position === 'absolute') {
                        return this._absolute_render();
                      }
                      return this._relative_render();
                    }}
                  </I18nContext.Consumer>
                );
              }}
            </ConfigContext.Consumer>
          );
        }}
      </RoomContext.Consumer>
    );
  }

  _relative_render(): React.ReactNode {
    const {
      containerStyle,
      messageList,
      globalBroadcast,
      messagePin,
      input,
      gift,
      children,
      backgroundView,
      participantList,
    } = this.props;
    return (
      <View
        ref={this.containerRef}
        style={[
          {
            flex: 1,
            // justifyContent: 'flex-end',
          },
          containerStyle,
        ]}
        onLayout={() => {
          this.containerRef?.current?.measure?.(
            (
              _x: number,
              _y: number,
              _width: number,
              _height: number,
              _pageX: number,
              pageY: number
            ) => {
              this.setState({ pageY: pageY });
            }
          );
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          {backgroundView}

          <View
            style={{ flex: 1 }}
            onTouchEnd={() => {
              if (this.inputBarRef?.current?.close) {
                this.inputBarRef.current.close();
              }
            }}
          >
            {this.config?.roomOption.messagePin.isVisible === true ? (
              <GMessagePin
                ref={this.messagePinRef}
                containerStyle={{ marginTop: 8, left: 8 }}
                {...messagePin?.props}
              />
            ) : null}

            {this.config?.roomOption.globalBroadcast.isVisible === true ? (
              <GGlobalBroadcast
                ref={this.globalBroadcastRef}
                containerStyle={{
                  marginTop: 8,
                  marginHorizontal: 8,
                  width: Dimensions.get('window').width - 16,
                }}
                {...globalBroadcast?.props}
              />
            ) : null}

            <View style={{ flex: 1 }} />

            {this.config?.roomOption.gift.isVisible === true ? (
              <GGiftEffect
                ref={this.giftRef}
                containerStyle={{
                  left: 16,
                  marginTop: 16,
                }}
                {...gift?.props}
              />
            ) : null}

            <GMessageList
              ref={this.messageRef}
              containerStyle={[
                {
                  marginTop: 8,
                },
              ]}
              {...messageList?.props}
            />

            {children}
          </View>

          <GMessageInput
            ref={this.inputBarRef}
            onSended={(_content, message) => {
              this.messageRef?.current?.addSendedMessage?.(message);
            }}
            closeAfterSend={true}
            {...input?.props}
          />

          <GBottomSheetParticipantList
            ref={this.memberRef}
            maskStyle={{ transform: [{ translateY: -this.state.pageY }] }}
            {...participantList?.props}
          />
        </View>
      </View>
    );
  }

  _absolute_render(): React.ReactNode {
    const {
      containerStyle,
      messagePinAndBroadcastContainerStyle,
      messageList,
      messagePin,
      globalBroadcast,
      input,
      gift,
      children,
      backgroundView,
      participantList,
    } = this.props;
    return (
      <View
        ref={this.containerRef}
        style={[
          {
            flex: 1,
            // justifyContent: 'flex-end',
          },
          containerStyle,
        ]}
        onLayout={() => {
          this.containerRef?.current?.measure?.(
            (
              _x: number,
              _y: number,
              _width: number,
              _height: number,
              _pageX: number,
              pageY: number
            ) => {
              this.setState({ pageY: pageY });
            }
          );
        }}
      >
        <View
          style={{
            flex: 1,
          }}
          onTouchEnd={() => {
            if (this.inputBarRef?.current?.close) {
              this.inputBarRef.current.close();
            }
          }}
        >
          {backgroundView}

          <GMessageList
            ref={this.messageRef}
            containerStyle={[
              {
                position: 'absolute',
                top: this._getMessageListTop() - 8,
                // bottom: 54, // !!! Not supported on Android platform.
              },
            ]}
            {...messageList?.props}
          />

          {this.config?.roomOption.gift.isVisible === true ? (
            <GGiftEffect
              ref={this.giftRef}
              containerStyle={{
                left: 16,
                position: 'absolute',
                // bottom: this._getGiftTop(), // The keyboard will push the component up.
                top: this._getGiftTop() - 8 - 8,
              }}
              {...gift?.props}
            />
          ) : null}

          {this.config?.roomOption.messagePin.isVisible === true &&
          this.config?.roomOption.globalBroadcast.isVisible === true ? (
            <View
              style={[
                {
                  position: 'absolute',
                  marginTop: 8,
                  marginHorizontal: 8,
                },
                messagePinAndBroadcastContainerStyle,
              ]}
            >
              <GMessagePin ref={this.messagePinRef} {...messagePin?.props} />
              <View style={{ height: 8 }} />
              <GGlobalBroadcast
                ref={this.globalBroadcastRef}
                containerStyle={{
                  width: Dimensions.get('window').width - 16,
                }}
                {...globalBroadcast?.props}
              />
            </View>
          ) : this.config?.roomOption.messagePin.isVisible === true &&
            this.config?.roomOption.globalBroadcast.isVisible === false ? (
            <GMessagePin
              ref={this.messagePinRef}
              containerStyle={{
                position: 'absolute',
                marginTop: 8,
                marginHorizontal: 8,
              }}
              {...messagePin?.props}
            />
          ) : this.config?.roomOption.messagePin.isVisible === false &&
            this.config?.roomOption.globalBroadcast.isVisible === true ? (
            <GGlobalBroadcast
              ref={this.globalBroadcastRef}
              containerStyle={{
                position: 'absolute',
                marginTop: 8,
                marginHorizontal: 8,
                width: Dimensions.get('window').width - 16,
              }}
              {...globalBroadcast?.props}
            />
          ) : null}

          {children}
        </View>

        <GMessageInput
          ref={this.inputBarRef}
          onSended={(_content, message) => {
            this.messageRef?.current?.addSendedMessage?.(message);
          }}
          closeAfterSend={true}
          {...input?.props}
        />

        <GBottomSheetParticipantList
          ref={this.memberRef}
          maskStyle={{ transform: [{ translateY: -this.state.pageY }] }}
          {...participantList?.props}
        />
      </View>
    );
  }
}
