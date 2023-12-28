export interface CommonManager<Listener = {}> {
  addListener(key: string, listener: Listener): void;
  removeListener(key: string): void;
  init(): void;
  unInit(): void;
}
