import type { StringSet } from 'react-native-chat-uikit';

export function createStringSetCn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },
    '_demo_tab_conv_list': '会话',
    '_demo_tab_contact_list': '联系人',
    '_demo_tab_mine': '我的',
  };
}
