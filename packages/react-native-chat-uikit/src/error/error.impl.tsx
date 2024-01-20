import { ErrorCode } from './code';
import { ErrorDescription } from './desc';

export function getDescription(code: ErrorCode): ErrorDescription {
  let ret = ErrorDescription.none;
  switch (code) {
    case ErrorCode.none:
      ret = ErrorDescription.none;
      break;
    case ErrorCode.common:
      ret = ErrorDescription.common;
      break;
    case ErrorCode.enum:
      ret = ErrorDescription.enum;
      break;
    case ErrorCode.existed:
      ret = ErrorDescription.existed;
      break;
    case ErrorCode.params:
      ret = ErrorDescription.params;
      break;
    case ErrorCode.max_count:
      ret = ErrorDescription.max_count;
      break;
    case ErrorCode.network:
      ret = ErrorDescription.network;
      break;

    case ErrorCode.chat_sdk:
      ret = ErrorDescription.chat_sdk;
      break;
    case ErrorCode.chat_uikit:
      ret = ErrorDescription.chat_uikit;
      break;
    case ErrorCode.chat_callkit:
      ret = ErrorDescription.chat_callkit;
      break;
    case ErrorCode.chatroom_uikit:
      ret = ErrorDescription.chatroom_uikit;
      break;

    case ErrorCode.init_error:
      ret = ErrorDescription.init_error;
      break;
    case ErrorCode.login_error:
      ret = ErrorDescription.login_error;
      break;
    case ErrorCode.logout_error:
      ret = ErrorDescription.logout_error;
      break;
    case ErrorCode.refresh_token_error:
      ret = ErrorDescription.refresh_token_error;
      break;
    case ErrorCode.network_error:
      ret = ErrorDescription.network_error;
      break;
    case ErrorCode.ui_error:
      ret = ErrorDescription.ui_error;
      break;
    case ErrorCode.not_impl:
      ret = ErrorDescription.not_impl;
      break;

    case ErrorCode.msg_send_error:
      ret = ErrorDescription.msg_send_error;
      break;
    case ErrorCode.msg_recall_error:
      ret = ErrorDescription.msg_recall_error;
      break;
    case ErrorCode.msg_translate_error:
      ret = ErrorDescription.msg_translate_error;
      break;
    case ErrorCode.msg_report_error:
      ret = ErrorDescription.msg_report_error;
      break;
    case ErrorCode.get_all_conversations_error:
      ret = ErrorDescription.get_all_conversations_error;
      break;

    case ErrorCode.room_join_error:
      ret = ErrorDescription.room_join_error;
      break;
    case ErrorCode.room_leave_error:
      ret = ErrorDescription.room_leave_error;
      break;
    case ErrorCode.room_kick_member_error:
      ret = ErrorDescription.room_kick_member_error;
      break;
    case ErrorCode.room_mute_member_error:
      ret = ErrorDescription.room_mute_member_error;
      break;
    case ErrorCode.room_unmute_member_error:
      ret = ErrorDescription.room_unmute_member_error;
      break;
    case ErrorCode.room_fetch_member_list_error:
      ret = ErrorDescription.room_fetch_member_list_error;
      break;
    case ErrorCode.room_fetch_mute_member_list_error:
      ret = ErrorDescription.room_fetch_mute_member_list_error;
      break;
    case ErrorCode.room_fetch_member_info_error:
      ret = ErrorDescription.room_fetch_member_info_error;
      break;
    case ErrorCode.room_fetch_room_list_error:
      ret = ErrorDescription.room_fetch_room_list_error;
      break;
    case ErrorCode.room_upload_user_info_error:
      ret = ErrorDescription.room_upload_user_info_error;
      break;
    default:
      break;
  }
  return ret;
}
