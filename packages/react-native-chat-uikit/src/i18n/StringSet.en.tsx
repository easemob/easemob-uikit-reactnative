import type { StringSet } from './types';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    // _uikit
    '_uikit_search': 'Search',
    '_uikit_search_placeholder': 'Search by Keywords',
    '_uikit_contact_title': 'Contacts',
    '_uikit_new_conv_title': 'New Chat',
    '_uikit_create_group_title': 'Create',
    '_uikit_create_group_button': (count) => `Create (${count})`,
    '_uikit_add_group_member_title': 'Add Group Members',
    '_uikit_add_group_member_button': (count) => `Add (${count})`,
    '_uikit_share_card_title': 'Share Contact',

    '_uikit_contact_new_request': 'New Requests',
    '_uikit_contact_group_list': 'Groups',
    '_uikit_contact_black_list': 'Blacklist',
    '_uikit_contact_menu_new_conv': 'New Chat',
    '_uikit_contact_menu_add_contact': 'Add Contact',
    '_uikit_contact_menu_create_group': 'New Group',
    '_uikit_contact_alert_title': 'Add Contacts',
    '_uikit_contact_alert_content': 'Search by ID',
    '_uikit_contact_alert_input_tip': 'User ID',
    '_uikit_contact_alert_button_add': 'Add',
    '_uikit_contact_search_placeholder': 'Search Contacts',

    '_uikit_conv_menu_read': 'Read',
    '_uikit_conv_menu_delete': 'Delete',
    '_uikit_conv_alert_title': 'Delete this conversation?',

    '_uikit_group_title': (count) => `Groups(${count})`,
    '_uikit_group_search_placeholder': 'Search Group',
    '_uikit_group_del_member_title': 'Remove Group Members',
    '_uikit_group_del_member_button': (count) => `Remove (${count})`,
    '_uikit_group_change_owner_title': 'Transfer Ownership',
    '_uikit_group_av_button': (count) => `Call (${count})`,
    '_uikit_group_av_meeting': 'Group Audio/Video Call',
    '_uikit_group_member_list_title': (count) => `Group Members (${count})`,
    '_uikit_group_alert_change_owner_title': (name) =>
      `Transfer group ownership to ${name}`,
    '_uikit_group_alert_del_member_title': (names) => `Remove ${names}?`,
    '_uikit_group_create_name': (key) => `${key}'s Group Chat`,

    '_uikit_chat_input_quote_file': 'attachment ',
    '_uikit_chat_input_quote_title_1': ' replying to ',
    '_uikit_chat_input_long_press_menu_picture': 'Album',
    '_uikit_chat_input_long_press_menu_video': 'Video',
    '_uikit_chat_input_long_press_menu_camera': 'Camera',
    '_uikit_chat_input_long_press_menu_file': 'File',
    '_uikit_chat_input_long_press_menu_card': 'Contact Card',

    '_uikit_chat_list_long_press_menu_copy': 'Copy',
    '_uikit_chat_list_long_press_menu_replay': 'Reply',
    '_uikit_chat_list_long_press_menu_translate': (isTranslated) =>
      isTranslated === true ? 'Show Original' : 'Translated',
    '_uikit_chat_list_long_press_menu_thread': 'Create a Thread',
    '_uikit_chat_list_long_press_menu_edit': 'Edit',
    '_uikit_chat_list_long_press_menu_multi_select': 'multiSelect',
    '_uikit_chat_list_long_press_menu_forward_message': 'forward',
    '_uikit_chat_list_long_press_menu_report': 'Report',
    '_uikit_chat_list_long_press_menu_delete': 'Delete',
    '_uikit_chat_list_long_press_menu_recall': 'Recall',
    '_uikit_chat_list_long_press_menu_delete_alert_title':
      'Delete this Message?',
    '_uikit_chat_list_long_press_menu_delete_alert_content':
      'You are deleting this locally and your contacts can still see this message.',
    '_uikit_chat_list_long_press_menu_recall_alert_title':
      'Recall this Message?',

    '_uikit_msg_tip_recall': (isSelf: boolean, name) =>
      isSelf === true ? `You recalled a message` : `${name} recalled a message`,
    '_uikit_msg_tip_not_support': 'Unsupported message type',
    '_uikit_msg_tip_msg_not_exist': 'Original message does not exist',
    '_uikit_msg_edit': 'Edited',
    '_uikit_msg_translate': 'Translated',
    '_uikit_msg_record': 'Chat Record',
    '_uikit_msg_tip_create_group_success': 'Create group success.',
    '_uikit_msg_tip_create_thread_finish': (id) =>
      id ? `${id} create thread finished.` : 'Create thread finished.',
    '_uikit_msg_tip_create_group_success_with_params': (name) =>
      `Group ${name} has been created.`,

    '_uikit_info_send_msg': 'Send Messages',
    '_uikit_info_send_audio': 'Voice Call',
    '_uikit_info_send_video': 'Video Call',
    '_uikit_info_search_message': 'Search Messages',
    '_uikit_info_search_msg': 'Search Messages',
    '_uikit_info_not_disturb': 'Mute Notifications',
    '_uikit_info_clear_msg': 'Clear Chat History',
    '_uikit_info_button_add_contact': 'Add Contact',
    '_uikit_info_menu_del_contact': 'Delete Contact',
    '_uikit_info_alert_title_delete_contact': 'Delete this Contact?',
    '_uikit_info_alert_content_delete_contact':
      'Deleting the contact will clear the chat history.',
    '_uikit_info_item_member': 'Group Members',
    '_uikit_info_item_contact_remark': 'Remarks',
    '_uikit_info_item_contact_id': 'ID: ',
    '_uikit_info_item_my_remark': 'My Alias in the Group',
    '_uikit_info_item_group_id': 'ID: ',
    '_uikit_info_item_group_name': 'Group Name',
    '_uikit_info_item_group_desc': 'Group Description',
    '_uikit_info_alert_clear_chat_title': 'Clearing Chat History?',
    '_uikit_info_alert_modify_group_name': 'Modify Group Name',
    '_uikit_info_alert_modify_group_desc': 'Modify Group Description',
    '_uikit_info_alert_modify_group_remark': 'My Alias in the Group',
    '_uikit_info_menu_quit_group': 'Leave Group',
    '_uikit_info_menu_destroy_group': 'Disband Group',
    '_uikit_info_menu_change_group_owner': 'Transfer Ownership',
    '_uikit_info_alert_quit_group_title': 'Leave this Group?',
    '_uikit_info_alert_quit_group_content':
      'Leaving the group will clear the chat history.',
    '_uikit_info_alert_destroy_group_title': 'Disband this Group?',
    '_uikit_info_alert_destroy_group_content':
      'Disbanding the group will clear the chat history.',

    '_uikit_new_quest_title': 'New Requests',
    '_uikit_new_quest_list_item_tip': 'requests to add you as a contact.',

    '_uikit_thread_msg_count': (count) => `${count}replay`,
    '_uikit_thread_list': (count) => `thread(${count})`,

    '_uikit_thread_menu_edit_thread_name': 'Edit Thread Name',
    '_uikit_thread_menu_open_thread_member_list': 'Thread Members',
    '_uikit_thread_menu_leave_thread': 'Leave Thread',
    '_uikit_thread_menu_destroy_thread': 'Destroy Thread',
    '_uikit_thread_member': 'Thread Members',
    '_uikit_thread_owner': 'Owner',
    '_uikit_thread_kick_member': 'Remove from Thread',
    '_uikit_thread_leave_confirm': (isOwner) =>
      isOwner === true ? 'Confirm destroy thread?' : 'Confirm leave thread?',

    '_uikit_tab_contact_list': 'Contacts',
    '_uikit_tab_group_list': 'Group Chat',
    '_uikit_forward_to': 'Forward to',
    '_uikit_alert_remove_message': 'Confirm deletion of selected messages?',
    '_uikit_history_record': 'Chat Record',
    '_uikit_unread_count': (count) => `${count} unread count`,
    '_uikit_alert_title_custom_status': 'Custom Status',

    '_uikit_report_title': 'Report Message',
    '_uikit_navi_title_chat': 'Chats',
    '_uikit_navi_title_contact': 'Contacts',
    '_uikit_navi_title_search': 'Search',
    '_uikit_navi_title_mine': 'Me',
    '_uikit_error_placeholder_tip': 'Loading failed.',
    '_uikit_msg_custom_card': 'Contact Card',

    'Unwelcome commercial content': 'Unwelcome Commercial Content',
    'Pornographic or explicit content': 'Pornographic or Explicit Content',
    'Child abuse': 'Child Abuse',
    'Hate speech or graphic violence': 'Hate Speech or Graphic Violence',
    'Promote terrorism': 'Promote Terrorism',
    'Harassment or bullying': 'Harassment or Bullying',
    'Suicide or self harm': 'Suicide or Self Harm',
    'False information': 'False Information',
    'Others': 'Others',

    // common
    'search': 'Search',
    'cancel': 'Cancel',
    'mute': 'Mute',
    'unmute': 'Unmute',
    'pin': 'Pin',
    'unpin': 'Unpin',
    'read': 'Read',
    'remove': 'Remove',
    'add': 'Add',
    'confirm': 'Confirm',
    'state': 'State',
    'about': 'About',
    'login': 'Login',
    'logout': 'Logout',
    'report': 'Report',
    'forward': 'Forward',
    'forwarded': 'Forwarded',
    'reload': 'Reload',

    'picture': 'Picture',
    'video': 'Video',
    'voice': 'Voice',
    'file': 'File',
    'card': 'Card',
    'set': 'Set',
    'you': 'You',

    'contact': 'Contact',

    'copy_success': 'Copy Successful',
    'online_state': 'Online Status',

    '@all': '[Mentioned] ',
    '@me': '[Mentioned] ',

    'voice_bar_remain': (v) => `The recording will stop in ${v}s`,
    'voice_bar_tip_click_record': 'Tap to Record',
    'voice_bar_tip_recording': 'Recording',
    'voice_bar_tip_click_play': 'Tap to Play',
    'voice_bar_tip_playing': 'Playing',

    'online': 'Online',
    'offline': 'Offline',
    'busy': 'Busy',
    'leave': 'Away',
    'not disturb': 'Do not disturb',
    'custom': 'Custom',

    '[image]': '[image]',
    '[video]': '[video]',
    '[file]': '[file]',
    '[location]': '[location]',
    '[voice]': '[voice]',
    '[contact]': '[contact]',
    '[custom]': '[custom]',
    '[combine]': '[combine]',
    '[unknown]': '[unknown]',
  };
}
