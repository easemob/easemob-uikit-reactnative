export type GiftMessageListItemData = {
  /**
   * suggestion: seqId('_gf').toString()
   */
  id: string;
  /**
   * The avatar of the sender.
   */
  avatar?: string;
  /**
   * The nickname of the sender.
   */
  nickname: string;
  /**
   * The content of the message.
   */
  content: string;
  /**
   * The icon of the gift.
   */
  giftIcon: string;
  /**
   * The count of the gift.
   * Default number 1.
   */
  giftCount?: number;
};
export type GiftMessageListTask = {
  model: GiftMessageListItemData;
};
