export enum ErrorCode {
  none = 0,
  common = 1,
  enum = 10,
  existed = 11,
  params = 12,
  max_count = 13,
  network = 15,

  chat_sdk = 900,
  chat_uikit = 901,
  chat_callkit = 902,
  chatroom_uikit = 903,

  // protocol error 1000 start
  init_error = 1000,
  login_error,
  logout_error,
  refresh_token_error,

  msg_send_error = 1100,
  msg_recall_error,
  msg_translate_error,
  msg_report_error,
  get_all_conversations_error,

  room_join_error = 1200,
  room_leave_error,
  room_kick_member_error,
  room_mute_member_error,
  room_unmute_member_error,
  room_fetch_member_list_error,
  room_fetch_mute_member_list_error,
  room_fetch_member_info_error,
  room_fetch_room_list_error,
  room_upload_user_info_error,

  // network error 2000 start
  network_error = 2000,

  // ui error 3000 start
  ui_error = 3000,

  // dev error 10000 start
  not_impl = 10000,
}
