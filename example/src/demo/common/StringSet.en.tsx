import type { StringSet } from 'react-native-chat-uikit';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },
    '_demo_tab_conv_list': 'Conversation',
    '_demo_tab_contact_list': 'Contact',
    '_demo_tab_mine': 'Mine',
    '_demo_navigation_common_setting_back': 'common',

    '_demo_info_state_set': 'set',
    '_demo_info_online_state': 'online state',
    '_demo_info_person_info': 'person info',
    '_demo_info_common_setting': 'common',
    '_demo_info_message_notification': 'message notification',
    '_demo_info_show_privacy': 'privacy',
    '_demo_info_input_state': 'show input state',
    '_demo_info_input_state_tail':
      'enable, the other side will see your input state',
    '_demo_info_auto_accept_group_invite': 'auto accept group invite',
    '_demo_info_auto_accept_group_invite_tail':
      'disable, you need to agree when you are added to a new group chat',
    '_demo_info_theme': 'theme',
    '_demo_info_language': 'language setting',

    'edit_group_name': 'Edit group name',
    'edit_group_description': 'Edit group description',
    'edit_group_my_remark': 'Edit group my remark',

    'edit_thread_name': 'Edit thread name',

    'save': 'Save',
  };
}
