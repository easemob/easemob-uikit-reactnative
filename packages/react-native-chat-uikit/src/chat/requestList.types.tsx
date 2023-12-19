import type { CommonManager } from './commonManager.types';
import type { NewRequestModel, ResultCallback } from './types';

export type RequestListListener = {
  onNewRequestListChanged: (list: NewRequestModel[]) => void;
};

export interface RequestList extends CommonManager<RequestListListener> {
  emitNewRequestListChanged(): void;
  getRequestList(params: { onResult: ResultCallback<NewRequestModel[]> }): void;
  updateRequest(request: NewRequestModel): void;
  removeRequest(request: NewRequestModel): void;
}
