import type { CommonManager } from './commonManager.types';
import type { ResultCallback } from './types';
import type { NewRequestModel } from './types.ui';

/**
 * Request List Listener.
 */
export type RequestListListener = {
  /**
   * Callback notification of new request list changed.
   */
  onNewRequestListChanged: (list: NewRequestModel[], changed: number) => void;
};

/**
 * Request List.
 */
export interface RequestList extends CommonManager<RequestListListener> {
  /**
   * Send new request list changed.
   *
   * @param count New request list count changed. > 0, = 0, < 0.
   */
  emitNewRequestListChanged(changed: number): void;
  /**
   * Get new request list.
   */
  getRequestList(params: { onResult: ResultCallback<NewRequestModel[]> }): void;
  /**
   * update request.
   */
  updateRequest(request: NewRequestModel): void;
  /**
   * remove request.
   */
  removeRequest(request: NewRequestModel): void;
}
