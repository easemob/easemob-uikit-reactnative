import * as React from 'react';

import {
  BottomSheetGift as BottomSheetModalGift,
  BottomSheetGiftProps as BottomSheetGiftModalProps,
  BottomSheetGiftRef as BottomSheetGiftModalRef,
} from './BottomSheetGift.modal';
import {
  BottomSheetGift as BottomSheetSimuGift,
  BottomSheetGiftProps as BottomSheetGiftSimuProps,
  BottomSheetGiftRef as BottomSheetGiftSimuRef,
} from './BottomSheetGift.simu';

export {
  BottomSheetGiftProps as BottomSheetGiftModalProps,
  BottomSheetGiftRef as BottomSheetGiftModalRef,
  BottomSheetGift as BottomSheetModalGift,
} from './BottomSheetGift.modal';
export {
  BottomSheetGiftProps as BottomSheetGiftSimuProps,
  BottomSheetGiftRef as BottomSheetGiftSimuRef,
  BottomSheetGift as BottomSheetSimuGift,
} from './BottomSheetGift.simu';

/**
 * BottomSheetGift component.
 *
 * It is a composite independent component of `GiftListMemo` and `SlideModal`, which can be displayed by calling the method `startShow` and hidden by calling the method `startHide`.
 *
 * @param props {@link BottomSheetGiftModalProps}
 * @param ref {@link BottomSheetGiftModalRef}
 * @returns JSX.Element
 *
 */
export const BottomSheetGift = React.forwardRef<
  BottomSheetGiftModalRef,
  BottomSheetGiftModalProps
>(function (
  props: BottomSheetGiftModalProps,
  ref?: React.ForwardedRef<BottomSheetGiftModalRef>
) {
  return <BottomSheetModalGift ref={ref} {...props} />;
});

/**
 * BottomSheetGift component.
 *
 * It is a composite independent component of `GiftListMemo` and `SimuModal`, which can be displayed by calling the method `startShow` and hidden by calling the method `startHide`.
 *
 * @param props {@link BottomSheetGiftSimuProps}
 * @param ref {@link BottomSheetGiftSimuRef}
 * @returns JSX.Element
 *
 * @test {@link example/src/__dev__/test_gift_list.tsx}
 *
 * @example
 *
 * ```tsx
 * const ref = React.useRef<BottomSheetGiftSimuRef>({} as any);
 * // ...
 * <BottomSheetGift2
 *   ref={ref}
 *   gifts={[
 *     { title: 'gift1', gifts },
 *     { title: 'gift2', gifts },
 *   ]}
 * />
 * // ...
 * ref.current?.startShow();
 * ```
 */
export const BottomSheetGift2 = React.forwardRef<
  BottomSheetGiftSimuRef,
  BottomSheetGiftSimuProps
>(function (
  props: BottomSheetGiftSimuProps,
  ref?: React.ForwardedRef<BottomSheetGiftSimuRef>
) {
  return <BottomSheetSimuGift ref={ref} {...props} />;
});
