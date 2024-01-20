/**
 * CommonManager
 */
export interface CommonManager<Listener = {}> {
  /**
   * Add listener
   */
  addListener(key: string, listener: Listener): void;
  /**
   * Remove listener
   */
  removeListener(key: string): void;
  /**
   * Init
   */
  init(): void;
  /**
   * Uninit
   */
  unInit(): void;
}
