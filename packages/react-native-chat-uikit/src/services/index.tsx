import { ClipboardServiceImplement } from './ClipboardService';
import { DirCacheServiceImplement } from './DirCacheService';
import { LocalStorageServiceImplement } from './LocalStorageService';
import { MediaServiceImplement } from './MediaService';
import { NotificationServiceImplement } from './NotificationService';
import { PermissionServiceImplement } from './PermissionService';
import type {
  ClipboardService,
  ClipboardServiceOption,
  DirCacheService,
  DirCacheServiceOption,
  LocalStorageService,
  MediaService,
  MediaServiceOptions,
  NotificationService,
  NotificationServiceOption,
  PermissionService,
  PermissionServiceOption,
} from './types';

/**
 * List of basic services provided.
 */
export class Services {
  /**
   * Pasteboard service.
   */
  static cbs: ClipboardService;
  /**
   * Media service.
   */
  static ms: MediaService;
  /**
   * Notification service.
   */
  static ns: NotificationService;
  /**
   * Permission service.
   */
  static ps: PermissionService;
  /**
   * Local storage service.
   */
  static ls: LocalStorageService;
  /**
   * Directory cache service.
   */
  static dcs: DirCacheService;

  /**
   * Create permission service single object.
   * @param option - The option. see {@link PermissionServiceOption}
   * @returns The Permission service object.
   */
  public static createPermissionService(
    option: PermissionServiceOption
  ): PermissionService {
    if (Services.ps === undefined) {
      Services.ps = new PermissionServiceImplement(option);
    }
    return Services.ps;
  }

  /**
   * Create clipboard service single object.
   * @param option - The option. see {@link ClipboardServiceOption}
   * @returns The clipboard service object.
   */
  public static createClipboardService(
    option: ClipboardServiceOption
  ): ClipboardService {
    if (Services.cbs === undefined) {
      Services.cbs = new ClipboardServiceImplement(option);
    }
    return Services.cbs;
  }

  /**
   * Create media service single object.
   * @param option - The option. see {@link MediaServiceOptions}
   * @returns The media service object.
   */
  public static createMediaService(option: MediaServiceOptions): MediaService {
    if (Services.ms === undefined) {
      Services.ms = new MediaServiceImplement(option);
    }
    return Services.ms;
  }

  /**
   * Create notification service single object.
   * @param option - The option. see {@link NotificationServiceOption}
   * @returns The notification service object.
   */
  public static createNotificationService(
    option: NotificationServiceOption
  ): NotificationService {
    if (Services.ns === undefined) {
      Services.ns = new NotificationServiceImplement(option);
    }
    return Services.ns;
  }

  /**
   * Create local storage service single object.
   * @param option - The option. see {@link LocalStorageService}
   * @returns The local storage service object.
   */
  public static createLocalStorageService(
    service?: LocalStorageService
  ): LocalStorageService {
    if (service) {
      Services.ls = service;
    } else {
      Services.ls = new LocalStorageServiceImplement();
    }
    return Services.ls;
  }

  /**
   * Create directory cache service single object.
   * @param option - The option. see {@link DirCacheServiceOption}
   * @returns The directory cache service object.
   */
  public static createDirCacheService(
    option: DirCacheServiceOption
  ): DirCacheService {
    if (Services.dcs === undefined) {
      Services.dcs = new DirCacheServiceImplement(option);
    }
    return Services.dcs;
  }
}

export * from './types';
