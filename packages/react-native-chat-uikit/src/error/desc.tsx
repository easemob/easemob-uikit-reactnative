export enum ErrorDescription {
  none = 'no error',
  common = 'common error',
  enum = 'type not support',
  existed = 'object has existed.',
  params = 'input parameters are invalid.',
  max_count = 'Maximum quantity limit exceeded.',
  network = 'network error.',

  chat_sdk = 'chat sdk error.',
  chat_uikit = 'chat uikit error.',
  chat_callkit = 'chat callkit error.',
  chatroom_uikit = 'chatroom uikit error.',

  init_error = 'An initialization error occurred.',
  login_error = 'A login error occurred.',
  logout_error = 'A log out error occurred.',
  refresh_token_error = 'refresh token error occurred.',

  network_error = 'A network error occurred.',

  ui_error = 'An error occurred in the UI.',

  not_impl = 'The code has not been implemented yet and is under development.',

  msg_send_error = 'message send failed.',
  msg_recall_error = 'message recall failed.',
  msg_translate_error = 'message translate failed.',
  msg_report_error = 'message report failed.',
  get_all_conversations_error = 'get all conversations failed.',

  room_join_error = 'join chatroom failed.',
  room_leave_error = 'leave chatroom failed.',
  room_kick_member_error = 'kick member in chatroom is failed.',
  room_mute_member_error = 'mute member in chatroom is failed.',
  room_unmute_member_error = 'unmute member in chatroom is failed.',
  room_fetch_member_list_error = 'fetch member list in chatroom is failed.',
  room_fetch_mute_member_list_error = 'fetch mute member list in chatroom is failed.',
  room_fetch_member_info_error = 'fetch member detail in chatroom is failed.',
  room_fetch_room_list_error = 'fetch room list in chatroom is failed.',
  room_upload_user_info_error = 'upload self user info is failed.',
}
