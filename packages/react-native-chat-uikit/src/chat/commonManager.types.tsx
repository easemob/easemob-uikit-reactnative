export interface CommonManager<Listener = {}> {
  destructor(): void;
  addListener(key: string, listener: Listener): void;
  removeListener(key: string): void;
  init(): void;
  unInit(): void;
}
