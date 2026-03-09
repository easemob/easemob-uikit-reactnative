import type { CallManager } from './CallManager';
import { CallManagerImpl } from './CallManagerImpl';
/**
 * Create a signaling manager.
 *
 * Please initialize before use, and reset resources please de-initialize. {@link CallManager.init} {@link CallManager.unInit}
 *
 * @returns
 */
export function createManager(): CallManager {
  return createManagerImpl();
}

let gCallManager: CallManagerImpl;
export function createManagerImpl(): CallManagerImpl {
  if (gCallManager === undefined) {
    gCallManager = new CallManagerImpl();
  }
  return gCallManager;
}
