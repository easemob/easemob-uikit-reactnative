import React from 'react';

import { ChatOptions } from '../rename.chat';
import { once2 } from '../utils';
import { getRoomService as _getRoomService } from './room.impl';
import type { RoomService, RoomServiceInit } from './types';

/**
 * Context of the IM.
 */
export const RoomContext = React.createContext<RoomService | undefined>(
  undefined
);
RoomContext.displayName = 'UIKitIMContext';

/**
 * Properties of the IM context.
 */
type RoomContextProps = React.PropsWithChildren<{
  value: RoomServiceInit & { im?: RoomService };
}>;

/**
 * The IM context's provider.
 *
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
 *
 * For example: if `chat uikit sdk` and `chat room uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 *
 * It can only be initialized once. Even if it is initialized multiple times, parameters modified in time will not take effect again. The reason is that `CHAT SDK` uses the native platform.
 */
export function RoomContextProvider({ value, children }: RoomContextProps) {
  const { appKey, debugMode, opt, im, onInitialized } = value;
  const _im = im ?? _getRoomService();
  initRoom(_im, appKey, debugMode, opt, onInitialized);
  // _im.init({
  //   appKey: appKey,
  //   debugMode: debugMode,
  //   autoLogin: false,
  //   result: ({ isOk, error }) => {
  //     if (isOk === false) {
  //       if (error) _im.sendError({ error: error });
  //     } else {
  //       onInitialized?.();
  //       _im.sendFinished({ event: 'init' });
  //     }
  //   },
  // });
  return <RoomContext.Provider value={_im}>{children}</RoomContext.Provider>;
}

/**
 * Get the IM context's value.
 * @returns The IM context's value.
 */
export function useRoomContext(): RoomService {
  const im = React.useContext(RoomContext);
  if (!im) throw Error(`${RoomContext.displayName} is not provided`);
  return im;
}

/**
 * Get the built-in single instance IM object.
 * @returns The IM service.
 */
export function getRoomService(): RoomService {
  return _getRoomService();
}

const initRoom = once2(
  (
    im: RoomService,
    appKey: string,
    debugMode: boolean,
    opt: ChatOptions,
    onInitialized?: () => void
  ) => {
    appKey;
    debugMode;
    im.initWithOption({
      options: opt,
      result: ({ isOk, error }) => {
        if (isOk === false) {
          if (error) im.sendError({ error: error });
        } else {
          onInitialized?.();
          im.sendFinished({ event: 'init' });
        }
      },
    });
  }
);
