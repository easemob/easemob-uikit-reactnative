import type { StringSet } from './types';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    // _uikit
    '_uikit_search': 'Search',
    '_uikit_contact_title': 'Contacts',
    '_uikit_new_conv_title': 'New Conversation',
    '_uikit_create_group_title': 'New Group',
    '_uikit_create_group_button': (count) => `Create (${count})`,
    '_uikit_add_group_member_title': 'Add Group Members',
    '_uikit_add_group_member_button': (count) => `Add (${count})`,
    '_uikit_share_card_title': 'Share Contact',

    '_uikit_contact_new_request': 'New Request',
    '_uikit_contact_group_list': 'Group Chat',
    '_uikit_contact_menu_new_conv': 'Start New Conversation',
    '_uikit_contact_menu_add_contact': 'Add Contact',
    '_uikit_contact_menu_create_group': 'Create Group',
    '_uikit_contact_alert_title': 'Add Contact',
    '_uikit_contact_alert_content': 'Add Contact by User ID',
    '_uikit_contact_alert_input_tip': 'Enter User ID',

    '_uikit_conv_menu_read': 'Mark as Read',
    '_uikit_conv_menu_delete': 'Delete Conversation',
    '_uikit_conv_alert_title': 'Delete this conversation?',

    '_uikit_group_title': (count) => `Group Chat(${count})`,
    '_uikit_group_del_member_title': 'Remove Group Members',
    '_uikit_group_del_member_button': (count) => `Remove (${count})`,
    '_uikit_group_change_owner_title': 'Select New Group Owner',
    '_uikit_group_member_list_title': (count) => `Group Members (${count})`,
    '_uikit_group_alert_change_owner_title': (name) =>
      `Transfer Group Ownership to ${name}`,
    '_uikit_group_alert_del_member_title': (names) =>
      `Confirm removal of selected members ${names}?`,
    '_uikit_group_create_name': (key) => `${key}'s Group Chat`,

    '_uikit_chat_input_quote_file': 'attachment ',
    '_uikit_chat_input_quote_title_1': ' replying to ',
    '_uikit_chat_input_long_press_menu_picture': 'Photo',
    '_uikit_chat_input_long_press_menu_video': 'Video',
    '_uikit_chat_input_long_press_menu_camera': 'Camera',
    '_uikit_chat_input_long_press_menu_file': 'File',
    '_uikit_chat_input_long_press_menu_card': 'Card',

    '_uikit_chat_list_long_press_menu_copy': 'Copy',
    '_uikit_chat_list_long_press_menu_replay': 'Reply',
    '_uikit_chat_list_long_press_menu_translate': 'translate',
    '_uikit_chat_list_long_press_menu_edit': 'Edit',
    '_uikit_chat_list_long_press_menu_report': 'Report',
    '_uikit_chat_list_long_press_menu_delete': 'Delete',
    '_uikit_chat_list_long_press_menu_recall': 'Recall',

    '_uikit_msg_tip_recall': (isSelf: boolean, name) =>
      isSelf === true ? `You recalled a message` : `${name} recalled a message`,
    '_uikit_msg_tip_not_support': 'Unsupported message type',
    '_uikit_msg_tip_msg_not_exist': 'Original message does not exist',
    '_uikit_msg_edit': 'Edited',
    '_uikit_msg_tip_create_group_success': 'Create group success.',
    '_uikit_msg_tip_create_group_success_with_params': 'Create group success.',

    '_uikit_info_send_msg': 'Send Message',
    '_uikit_info_send_audio': 'Audio Call',
    '_uikit_info_send_video': 'Video Call',
    '_uikit_info_search_msg': 'Search Messages',
    '_uikit_info_not_disturb': 'Do Not Disturb',
    '_uikit_info_clear_msg': 'Clear Chat History',
    '_uikit_info_button_add_contact': 'Add Contact',
    '_uikit_info_menu_del_contact': 'Delete Contact',
    '_uikit_info_alert_title_delete_contact': 'Confirm Contact Deletion',
    '_uikit_info_alert_content_delete_contact': (name) =>
      `Confirm deletion of ${name} and all chat history with this contact`,
    '_uikit_info_item_member': 'Group Members',
    '_uikit_info_item_my_remark': 'My Nickname in this Group',
    '_uikit_info_item_group_id': 'GroupID:',
    '_uikit_info_item_group_name': 'Group Name',
    '_uikit_info_item_group_desc': 'Group Description',
    '_uikit_info_alert_clear_chat_title': 'Confirm clearing chat history?',
    '_uikit_info_alert_modify_group_name': 'Modify Group Name',
    '_uikit_info_alert_modify_group_desc': 'Modify Group Description',
    '_uikit_info_alert_modify_group_remark': 'Modify My Remark',
    '_uikit_info_menu_quit_group': 'Leave Group',
    '_uikit_info_menu_destroy_group': 'Disband Group',
    '_uikit_info_menu_change_group_owner': 'Transfer Group Ownership',
    '_uikit_info_alert_quit_group_title': 'Confirm leaving group chat?',
    '_uikit_info_alert_quit_group_content':
      'Confirm leaving group and deleting group chat history',
    '_uikit_info_alert_destroy_group_title': 'Confirm disbanding group chat?',
    '_uikit_info_alert_destroy_group_content':
      'Confirm disbanding group and deleting group chat history',

    '_uikit_new_quest_title': 'New Request',
    '_uikit_new_quest_list_item_tip': 'requests to add you as a friend.',

    '_uikit_report_title': 'Report Message',
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

    'picture': 'Picture',
    'video': 'Video',
    'voice': 'Voice',
    'file': 'File',
    'card': 'card',
    'set': 'Set',
    'you': 'You',

    'contact': 'contact',

    'copy_success': 'Copy Successful',
    'online_state': 'Online Status',

    '@all': '[Mentioned] ',
    '@me': '[Mentioned] ',

    'voice_bar_remain': (v) => `${v}s Remaining`,
    'voice_bar_tip_click_record': 'click record',
    'voice_bar_tip_recording': 'recording',
    'voice_bar_tip_click_play': 'click play',
    'voice_bar_tip_playing': 'playing',

    '[image]': '[image]',
    '[video]': '[video]',
    '[file]': '[file]',
    '[location]': '[location]',
    '[voice]': '[voice]',
    '[custom]': '[custom]',
    '[unknown]': '[unknown]',
  };
}
