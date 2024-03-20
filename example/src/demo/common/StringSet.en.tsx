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

    '_demo_splash_title': 'Easemob IM',

    '_demo_login_title': 'Login',
    '_demo_login_title_version': (v) => `V${v}`,
    '_demo_login_input_phone_number_tip': 'Please enter your phone number',
    '_demo_login_input_phone_number_captcha_tip': 'Please enter the captcha',
    '_demo_login_input_phone_number_captcha_button_1': 'Get captcha',
    '_demo_login_input_phone_number_captcha_button_2': (second) =>
      `Resend captcha(${second}s)`,
    '_demo_login_input_phone_number_captcha_button_3': 'Resend captcha',
    '_demo_login_button': 'Login',
    '_demo_login_tip_1': 'Please select agree to',
    '_demo_login_tip_2': '《Easemob Service Agreement》',
    '_demo_login_tip_3': 'and',
    '_demo_login_tip_4': '《Easemob Privacy Agreement》',
    '_demo_login_tip_reason_1': 'Please enter the correct phone number',
    '_demo_login_tip_reason_2':
      'Please agree to the "Easemob Agreement" and "Easemob Agreement" first',
    '_demo_login_tip_reason_3': 'Please enter the captcha',
    '_demo_login_loading_tip': 'Logging',

    '_demo_server_setting_navi_title': 'Server Setting',
    '_demo_server_setting_navi_save': 'Save',
    '_demo_server_setting_input_appkey_tip': 'Input App key',
    '_demo_server_setting_private_setting': 'Use private server',
    '_demo_server_setting_input_im_server_tip': 'Input IM server address',
    '_demo_server_setting_input_port_tip': 'Input port number',
    '_demo_server_setting_input_rest_server_tip': 'Input Rest server address',

    '_demo_info_logout': 'Logout',

    '_demo_alert_server_setting_save_title':
      'Need to restart the app after saving',

    'edit_group_name': 'Edit group name',
    'edit_group_description': 'Edit group description',
    'edit_group_my_remark': 'Edit group my remark',

    'edit_thread_name': 'Edit thread name',
    'edit_contact_remark': 'Edit contact remark',

    '_demo_person_info_navi_title': 'Person Info',
    '_demo_person_info_avatar': 'Avatar',
    '_demo_person_info_remark': 'Remark',
    '_demo_person_edit_person_remark': 'Edit remark',

    '_demo_general_setting_navi_title': 'General Setting',
    '_demo_general_setting_theme': 'Dark Theme',
    '_demo_general_setting_style': 'Switch Style',
    '_demo_general_setting_color': 'Color Setting',
    '_demo_general_setting_feature': 'Feature Switch',
    '_demo_general_setting_language': 'Language Setting',

    '_demo_language_setting_navi_title': 'Language Setting',
    '_demo_language_setting_navi_confim': 'Confirm',
    '_demo_language_setting_language_cn': '简体中文',
    '_demo_language_setting_language_en': 'English',

    '_demo_style_setting_navi_title': 'Style Setting',
    '_demo_style_setting_navi_confim': 'Confirm',
    '_demo_style_setting_language_classic': 'Classic',
    '_demo_style_setting_language_modern': 'Modern',

    '_demo_about_setting_navi_title': 'About',
    '_demo_about_title': 'Easemob IM',
    '_demo_about_setting_site': 'Visit official website',
    '_demo_about_setting_site_url': 'www.huanxin.com',

    '_demo_about_setting_phone': 'Contact number',
    '_demo_about_setting_phone_number': '400-622-1776',
    '_demo_about_setting_partner': 'Business cooperation',
    '_demo_about_setting_partner_email': 'bd@easemob.com',
    '_demo_about_setting_advise': 'Complaints and suggestions',
    '_demo_about_setting_advise_email': 'issues@easemob.com',

    '_demo_color_setting_navi_title': 'Color Setting',
    '_demo_color_setting_navi_confirm': 'Confirm',
    '_demo_color_setting_primary': 'Primary color hue',
    '_demo_color_setting_second': 'Second color hue',
    '_demo_color_setting_error': 'Warning color hue',
    '_demo_color_setting_neutral': 'General neutral color hue',
    '_demo_color_setting_neutralS': 'Special neutral color hue',

    '_demo_feature_setting_navi_title': 'Feature Switch',
    '_demo_feature_setting_translate': 'Message translation',
    '_demo_feature_setting_translate_tip':
      'Translate messages into system language by long press',
    '_demo_feature_setting_thread': 'Group topic',
    '_demo_feature_setting_thread_tip': 'Create a topic for the group',
    '_demo_feature_setting_reaction': 'Reaction',
    '_demo_feature_setting_reaction_tip':
      'Add reaction to message by long press',
    '_demo_feature_setting_presence': '订阅状态',
    '_demo_feature_setting_presence_tip': ' ',
    '_demo_feature_setting_av': '音视频通话',
    '_demo_feature_setting_av_tip': ' ',

    'save': 'Save',
    'en': 'English',
    'zh-Hans': '简体中文',
  };
}
