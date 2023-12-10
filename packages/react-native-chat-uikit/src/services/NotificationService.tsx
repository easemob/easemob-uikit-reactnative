import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import type { Nullable } from '../types';
import type {
  NotificationService,
  NotificationServiceOption,
  Unsubscribe,
} from './types';

export class NotificationServiceImplement implements NotificationService {
  option: NotificationServiceOption;
  constructor(option: NotificationServiceOption) {
    this.option = option;
  }
  async getAPNSToken(): Promise<Nullable<string>> {
    const hasPermission =
      await this.option.permission.hasNotificationPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestNotificationPermission();
      if (!granted) throw new Error('Permission not granted');
    }
    const s: FirebaseMessagingTypes.Module = this.option.firebaseMessage();
    return s.getAPNSToken();
  }
  async getFCMToken(): Promise<Nullable<string>> {
    const hasPermission =
      await this.option.permission.hasNotificationPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestNotificationPermission();
      if (!granted) throw new Error('Permission not granted');
    }
    const s: FirebaseMessagingTypes.Module = this.option.firebaseMessage();
    return s.getToken();
  }
  onTokenRefresh(handler: (token: string) => void): Unsubscribe {
    const s: FirebaseMessagingTypes.Module = this.option.firebaseMessage();
    return s.onTokenRefresh((token: string) => {
      if (Platform.OS === 'android') handler(token);
    });
  }
}
