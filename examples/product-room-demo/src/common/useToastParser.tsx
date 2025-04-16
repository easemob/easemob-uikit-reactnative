import {
  ErrorCode,
  RoomEventType,
  UIKitError,
  useI18nContext,
} from '../rename.room';

export function useOnFinishedParser() {
  const { tr } = useI18nContext();
  const parseFinished = (eventType: RoomEventType, extra?: any) => {
    switch (eventType) {
      // case 'join':
      //   return tr('enter');
      case 'mute':
        return tr('muteSuccess');
      case 'unmute':
        return tr('unmuteSuccess');
      case 'kick': {
        if (extra) {
          const { userName } = extra;
          return tr('kickSuccess', userName);
        } else {
          return tr('kickSuccess');
        }
      }
      case 'report_message':
        return tr('messageReportSuccess');

      default:
        return undefined;
    }
  };
  return {
    parseFinished,
  };
}

export function useOnErrorParser() {
  const { tr } = useI18nContext();
  const parseError = (error: UIKitError) => {
    switch (error.code) {
      case ErrorCode.room_leave_error:
        return tr('leaveFailed');
      case ErrorCode.room_join_error:
        return tr('joinFailed');
      case ErrorCode.room_mute_member_error:
        return tr('muteFailed');
      case ErrorCode.room_mute_member_error:
        return tr('unmuteFailed');
      case ErrorCode.room_kick_member_error:
        return tr('kickFailed');
      case ErrorCode.msg_send_error:
        try {
          const d = JSON.parse(error.desc);
          if (d.code === 215) {
            return tr('beMutedCanNotSendMessage');
          }
          return undefined;
        } catch (e) {
          return undefined;
        }

      default:
        return undefined;
    }
  };
  return {
    parseError,
  };
}
