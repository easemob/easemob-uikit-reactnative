export type ReportItemModel = {
  /**
   * suggestion: seqId('_rp').toString()
   */
  id: string;
  /**
   * The key to report the content.
   */
  tag: string;
  /**
   * Report content.
   */
  title: string;
  /**
   * Checked or not.
   */
  checked: boolean;
};
