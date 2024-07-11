import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors } from '../../hook';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import type { BottomVoiceBarProps, BottomVoiceBarRef } from './types';
import { VoiceBar } from './VoiceBar';

export const BottomVoiceBar = React.forwardRef<
  BottomVoiceBarRef,
  BottomVoiceBarProps
>(function (
  props: BottomVoiceBarProps,
  ref?: React.ForwardedRef<BottomVoiceBarRef>
) {
  const { onRequestModalClose, ...others } = props;
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const { getColor } = useColors();

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startHide: (onFinished?: () => void) => {
          modalRef?.current?.startHide?.(onFinished);
        },
        startShow: () => {
          modalRef?.current?.startShow?.();
        },
      };
    },
    []
  );

  return (
    <SlideModal
      propsRef={modalRef}
      modalAnimationType={'slide'}
      onRequestModalClose={onRequestModalClose}
      enableSlideComponent={false}
    >
      <SafeAreaView
        style={{
          backgroundColor: getColor('bg'),
          alignItems: 'center',
          width: '100%',
        }}
      >
        <VoiceBar {...others} />
      </SafeAreaView>
    </SlideModal>
  );
});
