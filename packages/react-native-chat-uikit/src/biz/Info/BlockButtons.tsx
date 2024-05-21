import * as React from 'react';
import { StyleSheet, View } from 'react-native';

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
   * Whether to display the search button.
   */
  hasSearch?: boolean;
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
   * Search button callback.
   */
  onSearch?: () => void;
  /**
   * Registrar. Change custom button array component. Implement a custom method, provide a default button array component, and return a new button array component.
   */
  onInitButton?: (
    initButtons: React.ReactElement<BlockButtonProps>[]
  ) => React.ReactElement<BlockButtonProps>[];

  /**
   * The number of buttons displayed in the component.
   */
  itemCount?: number;
};
export const BlockButtons = (props: BlockButtonsProps) => {
  const {
    hasAudioCall = false,
    hasSendMessage = true,
    hasVideoCall = false,
    hasSearch = true,
    onSendMessage,
    onAudioCall,
    onVideoCall,
    onInitButton,
    onSearch,
    itemCount = 2,
  } = props;
  const itemWidth = itemCount <= 3 ? 114 : itemCount <= 4 ? 83.5 : 62.5;
  const { tr } = useI18nContext();
  const items = [] as React.ReactElement<BlockButtonProps>[];
  if (hasSendMessage) {
    items.push(
      <BlockButton
        key={'100'}
        iconName={'bubble_fill'}
        text={tr('_uikit_info_send_msg')}
        containerStyle={[styles.c, { width: itemWidth }]}
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
        containerStyle={[styles.c, { width: itemWidth }]}
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
        containerStyle={[styles.c, { width: itemWidth }]}
        onPress={onVideoCall}
      />
    );
  }
  if (hasSearch) {
    items.push(
      <BlockButton
        key={'103'}
        iconName={'magnifier'}
        text={tr('_uikit_info_search_message')}
        containerStyle={[styles.c, { width: itemWidth }]}
        onPress={onSearch}
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
        alignItems: 'center',
        justifyContent: _items.length > 2 ? 'space-evenly' : 'center',
      }}
    >
      {_items}
    </View>
  );
};

const styles = StyleSheet.create({
  c: {
    height: 62,
    maxWidth: 114,
    flexGrow: 1,
    marginHorizontal: 4,
  },
});
