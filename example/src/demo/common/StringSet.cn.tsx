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
    '_demo_navigation_common_setting_back': '通用',

    '_demo_info_state_set': '设置',
    '_demo_info_online_state': '在线状态',
    '_demo_info_person_info': '个人信息',
    '_demo_info_common_setting': '通用',
    '_demo_info_message_notification': '消息通知',
    '_demo_info_show_privacy': '隐私',
    '_demo_info_input_state': '显示输入状态',
    '_demo_info_input_state_tail': '开启后，对方将看见你的输入状态',
    '_demo_info_auto_accept_group_invite': '自动接受群组邀请',
    '_demo_info_auto_accept_group_invite_tail':
      '关闭后，被加入新群聊时将需要你的同意',
    '_demo_info_theme': '明暗模式',
    '_demo_info_language': '语言设置',

    'edit_group_name': '编辑群名称',
    'edit_group_description': '编辑群描述',
    'edit_group_my_remark': '编辑群我的备注',

    'edit_thread_name': '编辑话题名称',

    'save': '保存',
  };
}
