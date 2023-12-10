import { default as storage } from '@react-native-async-storage/async-storage';

import type { LocalStorageService } from './types';

export class LocalStorageServiceImplement implements LocalStorageService {
  getAllKeys(): Promise<readonly string[]> {
    return storage.getAllKeys();
  }
  getItem(key: string): Promise<string | null> {
    return storage.getItem(key);
  }
  setItem(key: string, value: string): Promise<void> {
    return storage.setItem(key, value);
  }
  removeItem(key: string): Promise<void> {
    return storage.removeItem(key);
  }
}
