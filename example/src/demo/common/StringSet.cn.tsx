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

    '_demo_splash_title': '环信即时通讯云',

    '_demo_login_title': '登录环信IM',
    '_demo_login_title_version': (v) => `V${v}`,
    '_demo_login_input_phone_number_tip': '请输入你的手机号',
    '_demo_login_input_phone_number_captcha_tip': '请输入验证码',
    '_demo_login_input_phone_number_captcha_button_1': '获取验证码',
    '_demo_login_input_phone_number_captcha_button_2': (second) =>
      `重新获取(${second}s)`,
    '_demo_login_input_phone_number_captcha_button_3': '重新获取',
    '_demo_login_button': '登录',
    '_demo_login_tip_1': '请选择同意',
    '_demo_login_tip_2': '《环信服务条款》',
    '_demo_login_tip_3': '与',
    '_demo_login_tip_4': '《环信隐私协议》',
    '_demo_login_tip_reason_1': '请输入正确的手机号',
    '_demo_login_tip_reason_2': '请先同意《环信条款》与《环信协议》',
    '_demo_login_tip_reason_3': '请输入验证码',
    '_demo_login_loading_tip': '登录中...',

    '_demo_server_setting_navi_title': '服务器设置',
    '_demo_server_setting_navi_save': '保存',
    '_demo_server_setting_input_appkey_tip': '输入 App key',
    '_demo_server_setting_private_setting': '使用私有服务器',
    '_demo_server_setting_input_im_server_tip': '输入IM服务器地址',
    '_demo_server_setting_input_port_tip': '输入端口号',
    '_demo_server_setting_input_rest_server_tip': '输入Rest服务器地址',

    '_demo_alert_server_setting_save_title': '保存后需要重启应用',

    'edit_group_name': '编辑群名称',
    'edit_group_description': '编辑群描述',
    'edit_group_my_remark': '编辑群我的备注',

    'edit_thread_name': '编辑话题名称',
    'edit_contact_remark': '编辑联系人备注',

    'save': '保存',
  };
}
