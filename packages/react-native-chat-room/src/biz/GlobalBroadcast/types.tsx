export type GlobalBroadcastModel = {
  /**
   * suggestion: seqId('_mq').toString()
   */
  id: string;
  content: string;
};
export type GlobalBroadcastTask = {
  model: GlobalBroadcastModel;
};
