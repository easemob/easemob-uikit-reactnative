import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import type { Permission, PermissionStatus } from 'react-native-permissions';
import type Permissions from 'react-native-permissions';

import type { PermissionService, PermissionServiceOption } from './types';

type CheckMultipleType = typeof Permissions.checkMultiple;
type RequestMultipleType = typeof Permissions.requestMultiple;

export class PermissionServiceImplement implements PermissionService {
  option: PermissionServiceOption;
  constructor(option: PermissionServiceOption) {
    this.option = option;
  }

  private resultReduction(
    stats: Record<Permission, PermissionStatus>,
    limitedCallback?: () => void
  ): boolean {
    return Object.values(stats).every((result) => {
      if (result === 'granted') return true;
      if (result === 'limited') {
        limitedCallback?.();
        return true;
      }
      return false;
    });
  }

  private getAndroidMediaPermissions(
    permission: typeof Permissions
  ): Permission[] {
    if (Platform.OS !== 'android') return [];

    if (Platform.Version > 32) {
      return [
        permission.PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
        permission.PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        permission.PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ];
    }

    if (Platform.Version > 28) {
      return [permission.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
    }

    return [
      permission.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      permission.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ];
  }
  private async cameraAndMic(
    check: CheckMultipleType | RequestMultipleType
  ): Promise<boolean> {
    const s = this.option.permissions;
    const cameraPermissions: Permission[] = Platform.select({
      ios: [s.PERMISSIONS.IOS.CAMERA, s.PERMISSIONS.IOS.MICROPHONE],
      android: [
        s.PERMISSIONS.ANDROID.CAMERA,
        s.PERMISSIONS.ANDROID.RECORD_AUDIO,
      ],
      default: [],
    });
    return this.resultReduction(await check(cameraPermissions), () => {});
  }
  private async location(
    check: CheckMultipleType | RequestMultipleType
  ): Promise<boolean> {
    const s = this.option.permissions;
    const locationPermissions: Permission[] = Platform.select({
      ios: [s.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
      android: [s.PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION],
      default: [],
    });
    return this.resultReduction(await check(locationPermissions), () => {});
  }
  private async media(
    check: CheckMultipleType | RequestMultipleType
  ): Promise<boolean> {
    const s = this.option.permissions;
    const locationPermissions: Permission[] = Platform.select({
      ios: [s.PERMISSIONS.IOS.PHOTO_LIBRARY],
      android: this.getAndroidMediaPermissions(this.option.permissions),
      default: [],
    });
    return this.resultReduction(await check(locationPermissions), () => {});
  }

  async hasCameraAndMicPermission(): Promise<boolean> {
    return this.cameraAndMic(this.option.permissions.checkMultiple);
  }
  async requestCameraAndMicPermission(): Promise<boolean> {
    return this.cameraAndMic(this.option.permissions.requestMultiple);
  }
  hasLocationPermission(): Promise<boolean> {
    return this.location(this.option.permissions.checkMultiple);
  }
  requestLocationPermission(): Promise<boolean> {
    return this.location(this.option.permissions.requestMultiple);
  }
  hasMediaLibraryPermission(): Promise<boolean> {
    return this.media(this.option.permissions.checkMultiple);
  }
  requestMediaLibraryPermission(): Promise<boolean> {
    return this.media(this.option.permissions.requestMultiple);
  }
  async hasNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const s = await this.option.permissions.checkNotifications();
      return s.status === 'granted';
    } else if (Platform.OS === 'ios') {
      const s: FirebaseMessagingTypes.Module = this.option.firebaseMessage();
      const status = await s.hasPermission();
      const authorizedStatus = [
        this.option.firebaseMessage.AuthorizationStatus.AUTHORIZED,
        this.option.firebaseMessage.AuthorizationStatus.PROVISIONAL,
      ];
      return authorizedStatus.includes(status);
    }
    return false;
  }
  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const s = await this.option.permissions.requestNotifications([
        'alert',
        'badge',
        'sound',
        'criticalAlert',
        'provisional',
        'providesAppSettings',
        'carPlay',
      ]);
      return s.status === 'granted';
    } else if (Platform.OS === 'ios') {
      const s: FirebaseMessagingTypes.Module = this.option.firebaseMessage();
      const status = await s.requestPermission();
      const authorizedStatus = [
        this.option.firebaseMessage.AuthorizationStatus.AUTHORIZED,
        this.option.firebaseMessage.AuthorizationStatus.PROVISIONAL,
      ];
      return authorizedStatus.includes(status);
    }
    return false;
  }
}
