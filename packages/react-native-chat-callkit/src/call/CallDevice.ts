import { Platform } from 'react-native';

// import DeviceInfo from 'react-native-device-info';
import { uuid } from '../utils/utils';
import { calllog } from './CallConst';
// import { calllog } from './CallConst';

/**
 * Get the device token.
 */
export class CallDevice {
  _deviceToken: string;
  constructor() {
    this._deviceToken = '';
  }
  public init(result: (deviceToken: string) => void): void {
    this._deviceToken = Platform.select({
      ios: `rn_ios_${uuid()}`,
      android: `rn_android_${uuid()}`,
      default: `rn_${uuid()}`,
    });
    calllog.log('CallDevice:init:', this._deviceToken);
    result(this._deviceToken);
    // DeviceInfo.getDeviceToken()
    //   .then((dt) => {
    //     const sub = dt.substring(0, 31);
    //     const os = Platform.OS;
    //     if (sub === 'unknown') {
    //       const uid = uuid();
    //       this._deviceToken = `rn_${os}_${uid}`;
    //     } else {
    //       this._deviceToken = `rn_${os}_${sub}`;
    //     }
    //     result(this._deviceToken);
    //   })
    //   .catch((error) => {
    //     calllog.warn('CallDevice:init:error:', error);
    //   });
  }
  public get deviceToken() {
    return this._deviceToken;
  }
}
