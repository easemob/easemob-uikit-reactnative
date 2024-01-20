import * as React from 'react';
import { View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { useI18nContext } from '../../i18n';
import { BlockButton, BlockButtonProps } from '../../ui/Button';

/**
 * Block Buttons Component properties.
 *
 * There are three built-in buttons, including send message button, send audio button, and send video button.
 */
export type BlockButtonsProps = {
  /**
   * Whether to display the audio call button.
   */
  hasAudioCall?: boolean;
  /**
   * Whether to display the send message button.
   */
  hasSendMessage?: boolean;
  /**
   * Whether to display the video call button.
   */
  hasVideoCall?: boolean;
  /**
   * Send message button callback.
   */
  onSendMessage?: () => void;
  /**
   * Audio call button callback.
   */
  onAudioCall?: () => void;
  /**
   * Video call button callback.
   */
  onVideoCall?: () => void;
  /**
   * Registrar. Change custom button array component. Implement a custom method, provide a default button array component, and return a new button array component.
   */
  onInitButton?: (
    initButtons: React.ReactElement<BlockButtonProps>[]
  ) => React.ReactElement<BlockButtonProps>[];
};
export const BlockButtons = (props: BlockButtonsProps) => {
  const {
    hasAudioCall = false,
    hasSendMessage = true,
    hasVideoCall = false,
    onSendMessage,
    onAudioCall,
    onVideoCall,
    onInitButton,
  } = props;
  const { tr } = useI18nContext();
  const items = [] as React.ReactElement<BlockButtonProps>[];
  if (hasSendMessage) {
    items.push(
      <BlockButton
        key={'100'}
        iconName={'bubble_fill'}
        text={tr('_uikit_info_send_msg')}
        containerStyle={{ height: 62, width: 114 }}
        onPress={onSendMessage}
      />
    );
  }
  if (hasAudioCall) {
    items.push(
      <BlockButton
        key={'101'}
        iconName={'phone_pick'}
        text={tr('_uikit_info_send_audio')}
        containerStyle={{ height: 62, width: 114 }}
        onPress={onAudioCall}
      />
    );
  }
  if (hasVideoCall) {
    items.push(
      <BlockButton
        key={'102'}
        iconName={'video_camera'}
        text={tr('_uikit_info_send_video')}
        containerStyle={{ height: 62, width: 114 }}
        onPress={onVideoCall}
      />
    );
  }
  const _items = onInitButton ? onInitButton(items) : items;
  if (_items.length > 5) {
    throw new UIKitError({
      code: ErrorCode.max_count,
      desc: 'BlockButtons: items.length > 5',
    });
  }
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}
    >
      {_items}
    </View>
  );
};
