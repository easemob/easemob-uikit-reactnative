import * as React from 'react';
import { View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { useI18nContext } from '../../i18n';
import { BlockButton, BlockButtonProps } from '../../ui/Button';

export type BlockButtonsProps = {
  hasAudioCall?: boolean;
  hasSendMessage?: boolean;
  hasVideoCall?: boolean;
  onSendMessage?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
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
      code: ErrorCode.common,
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
