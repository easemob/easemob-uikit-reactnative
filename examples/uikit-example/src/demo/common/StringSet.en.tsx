import type { StringSet } from '../../rename.uikit';

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

    '_demo_info_state_set': 'Settings',
    '_demo_info_state_account': 'Account',
    '_demo_info_online_state': 'User Status',
    '_demo_info_person_info': 'Profile',
    '_demo_info_common_setting': 'General',
    '_demo_info_message_notification': 'Message Notifications',
    '_demo_info_show_privacy': 'Privacy',
    '_demo_info_input_state': 'show input state',
    '_demo_info_input_state_tail':
      'enable, the other side will see your input state',
    '_demo_info_auto_accept_group_invite': 'auto accept group invite',
    '_demo_info_auto_accept_group_invite_tail':
      'disable, you need to agree when you are added to a new group chat',
    '_demo_info_theme': 'theme',
    '_demo_info_language': 'language setting',

    '_demo_splash_title': (accountType) =>
      accountType === 'agora' ? 'Agora Chat' : 'Easemob IM',

    '_demo_login_title': (accountType) =>
      accountType === 'agora' ? 'Login' : 'Login',
    '_demo_login_title_version': (v) => `V${v}`,
    '_demo_login_input_phone_number_tip': (accountType, devMode) =>
      devMode === true
        ? 'id'
        : accountType === 'agora'
        ? 'Username'
        : 'Phone number',
    '_demo_login_input_phone_number_captcha_tip': (accountType, devMode) =>
      devMode === true
        ? accountType === 'agora'
          ? 'token'
          : 'password'
        : accountType === 'agora'
        ? 'Password'
        : 'Verification code',
    '_demo_login_input_phone_number_captcha_button_1': 'Get code',
    '_demo_login_input_phone_number_captcha_button_2': (second) =>
      `Resend captcha(${second}s)`,
    '_demo_login_input_phone_number_captcha_button_3': 'Resend captcha',
    '_demo_login_button': 'Log In',
    '_demo_login_tip_1': 'Agree to ',
    '_demo_login_tip_2': 'Easemob Terms ',
    '_demo_login_tip_3': '& ',
    '_demo_login_tip_4': 'Privacy',
    '_demo_login_server_setting_button': 'Server Setting',
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

    '_demo_info_logout': 'Log Out',
    '_demo_info_account_destroy': 'Delete Account',

    '_demo_alert_server_setting_save_title':
      'Restart the client to make the settings take effect',
    '_demo_alert_server_setting_save_message':
      'The current server settings need to restart the client to take effect.',

    '_demo_edit_group_name': 'Group Name',
    '_demo_edit_group_description': 'Group Description',
    '_demo_edit_group_my_remark': 'My Alias in the Group',

    '_demo_edit_thread_name': 'Edit thread name',
    '_demo_edit_contact_remark': 'Remarks',

    '_demo_person_info_navi_title': 'Profile',
    '_demo_person_info_avatar': 'Avatar',
    '_demo_person_info_remark': 'Nickname',
    '_demo_person_edit_person_remark': 'Nickname',

    '_demo_general_setting_navi_title': 'General',
    '_demo_general_setting_theme': 'Dark Mode',
    '_demo_general_setting_style': 'Theme',
    '_demo_general_setting_color': 'Theme Color',
    '_demo_general_setting_feature': 'Advanced Features',
    '_demo_general_setting_language': 'System Language',
    '_demo_general_setting_translation_language': 'Translation Target Language',
    '_demo_general_setting_message_menu': 'Message Context Menu Style',
    '_demo_general_setting_message_input_menu': 'Message Input Bar Menu Style',

    '_demo_language_setting_navi_title': 'System Language',
    '_demo_language_setting_navi_confim': 'Done',
    '_demo_language_setting_language_cn': '中文',
    '_demo_language_setting_language_en': 'English',

    '_demo_message_context_menu_setting_navi_title':
      'Message Context Menu Style',
    '_demo_message_context_menu_setting_navi_confim': 'Done',
    '_demo_message_context_menu_setting_style1': 'Style 1',
    '_demo_message_context_menu_setting_style2': 'Style 2',

    '_demo_message_input_bar_menu_setting_navi_title': 'Message Input Bar Menu',
    '_demo_message_input_bar_menu_setting_navi_confim': 'Done',
    '_demo_message_input_bar_menu_setting_style1': 'Style1',
    '_demo_message_input_bar_menu_setting_style2': 'Style2',

    '_demo_style_setting_navi_title': 'Theme',
    '_demo_style_setting_navi_confim': 'Done',
    '_demo_style_setting_language_classic': 'Classic',
    '_demo_style_setting_language_modern': 'Modern',

    '_demo_about_setting_navi_title': 'About',
    '_demo_about_title': (accountType) =>
      accountType === 'agora' ? 'Agora Chat' : 'Easemob IM',
    '_demo_about_setting_site': 'Official Website',
    '_demo_about_setting_site_url': 'www.huanxin.com',
    '_demo_about_setting_phone': 'Contact Us',
    '_demo_about_setting_phone_number': '400-622-1776',
    '_demo_about_setting_partner': 'Business Cooperation',
    '_demo_about_setting_partner_email': 'bd@easemob.com',
    '_demo_about_setting_channel': 'Channel Partnership',
    '_demo_about_setting_channel_email': 'qudao@easemob.com',
    '_demo_about_setting_advise': 'Feedback',
    '_demo_about_setting_advise_email': 'issues@easemob.com',
    '_demo_about_setting_privacy': 'Privacy Policy',

    '_demo_agora_about_setting_docs_site': 'Agora Chat documentation',
    '_demo_agora_about_setting_docs_site_url': 'docs.agora.io/en/agora-chat',
    '_demo_agora_about_setting_contact_site': 'Contact sales',
    '_demo_agora_about_setting_contact_site_url': 'docs.agora.io/en/agora-chat',
    '_demo_agora_about_setting_github_site': 'Demo app github repo',
    '_demo_agora_about_setting_github_site_url':
      'github.com/AgoraIO/Agora-Chat-API-Examples',
    '_demo_agora_about_setting_more_site': 'More',
    '_demo_agora_about_setting_more_site_url': 'agora.io',

    '_demo_color_setting_navi_title': 'Theme Color',
    '_demo_color_setting_navi_confirm': 'Done',
    '_demo_color_setting_primary': 'Primary color hue',
    '_demo_color_setting_second': 'Second color hue',
    '_demo_color_setting_error': 'Warning color hue',
    '_demo_color_setting_neutral': 'General neutral color hue',
    '_demo_color_setting_neutralS': 'Special neutral color hue',

    '_demo_feature_setting_navi_title': 'Advanced Features',
    '_demo_feature_setting_translate': 'Translation',
    '_demo_feature_setting_translate_tip':
      'Long press a message to translate it to the mobile system language',
    '_demo_feature_setting_thread': 'Thread',
    '_demo_feature_setting_thread_tip':
      'Create a thread from a message within the group',
    '_demo_feature_setting_reaction': 'Emoji Reaction',
    '_demo_feature_setting_reaction_tip':
      'Long press a message to add emoji reactions',
    '_demo_feature_setting_presence': 'Presence',
    '_demo_feature_setting_presence_tip':
      'Displaying current availability and activity status to other users',
    '_demo_feature_setting_av': 'Audio and Video Call',
    '_demo_feature_setting_av_tip': ' ',
    '_demo_feature_setting_typing': 'Typing Indicator',
    '_demo_feature_setting_typing_tip':
      'Show the other user that you are typing',
    '_demo_feature_setting_block': 'Block List',
    '_demo_feature_setting_block_tip':
      'After setting, long-pressing a message will translate it into the specified target language.',

    '_demo_notification_setting_navi_title': 'Message Notifications',
    '_demo_notification_setting_offline_push': 'Offline Message Push',
    '_demo_notification_setting_offline_push_tip':
      'After turning off, you will no longer receive any message notifications except for messages where you are @mentioned in the group.',

    '_demo_privacy_setting_navi_title': 'Privacy',
    '_demo_privacy_setting_block_list': 'Block List',

    '_demo_logout_title': 'Log Out',
    '_demo_alert_title_share_contact_title': 'Share Contacts?',
    '_demo_alert_title_share_contact_message': (a, b) =>
      `Share Contact ${a} to  ${b}.`,

    '_demo_copyGroupId': 'Copy Successful',
    '_demo_copyUserId': 'Copy Successful',
    '_demo_imageSaved': 'Saved',
    '_demo_videoSaved': 'Saved',
    '_demo_fetchPinnedMessagesResult': 'No pinned messages',

    'save': 'Save',
    'done': 'Done',
    'en': 'English',
    'zh-Hans': '中文',
    'classic': 'Classic',
    'modern': 'Modern',
    'style1': 'Style1',
    'style2': 'Style2',
  };
}
