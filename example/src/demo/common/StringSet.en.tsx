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

    'edit_group_name': 'Edit group name',
    'edit_group_description': 'Edit group description',
    'edit_group_my_remark': 'Edit group my remark',
  };
}
