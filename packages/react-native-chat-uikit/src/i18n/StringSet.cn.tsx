import type { StringSet } from './types';

export function createStringSetCn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    // _uikit
    '_uikit_search': '搜索',
    '_uikit_contact_title': '联系人',
    '_uikit_new_conv_title': '新会话',
    '_uikit_create_group_title': '新群组',
    '_uikit_create_group_button': (count) => `创建(${count})`,
    '_uikit_add_group_member_title': '添加群成员',
    '_uikit_add_group_member_button': (count) => `添加(${count})`,
    '_uikit_share_card_title': '分享联系人',

    '_uikit_contact_new_request': '新请求',
    '_uikit_contact_group_list': '群聊',
    '_uikit_contact_menu_new_conv': '发起新会话',
    '_uikit_contact_menu_add_contact': '添加联系人',
    '_uikit_contact_menu_create_group': '创建群组',
    '_uikit_contact_alert_title': '添加联系人',
    '_uikit_contact_alert_content': '通过用户ID添加联系人',
    '_uikit_contact_alert_input_tip': '输入用户ID',

    '_uikit_conv_menu_read': '标记已读',
    '_uikit_conv_menu_delete': '删除会话',
    '_uikit_conv_alert_title': '删除该会话？',

    '_uikit_group_title': (count) => `群聊(${count})`,
    '_uikit_group_del_member_title': '删除群成员',
    '_uikit_group_del_member_button': (count) => `删除(${count})`,
    '_uikit_group_change_owner_title': '选择新群主',
    '_uikit_group_member_list_title': (count) => `群成员(${count})`,
    '_uikit_group_alert_change_owner_title': (name) => `转让群主身份给${name}`,
    '_uikit_group_alert_del_member_title': (names) =>
      `确认删除${names}等选中成员？`,
    '_uikit_group_create_name': (key) => `${key}的群聊`,

    '_uikit_chat_input_quote_file': '附件 ',
    '_uikit_chat_input_quote_title_1': ' 正在回复 ',
    '_uikit_chat_input_long_press_menu_picture': '照片',
    '_uikit_chat_input_long_press_menu_video': '视频',
    '_uikit_chat_input_long_press_menu_camera': '相机',
    '_uikit_chat_input_long_press_menu_file': '文件',
    '_uikit_chat_input_long_press_menu_card': '名片',

    '_uikit_chat_list_long_press_menu_copy': '复制',
    '_uikit_chat_list_long_press_menu_replay': '回复',
    '_uikit_chat_list_long_press_menu_translate': '翻译',
    '_uikit_chat_list_long_press_menu_edit': '编辑',
    '_uikit_chat_list_long_press_menu_report': '举报',
    '_uikit_chat_list_long_press_menu_delete': '删除',
    '_uikit_chat_list_long_press_menu_recall': '撤回',

    '_uikit_msg_tip_recall': (isSelf: boolean, name) =>
      isSelf === true ? `你撤回了一条消息` : `${name}撤回了一条消息`,
    '_uikit_msg_tip_not_support': '不支持的消息类型',
    '_uikit_msg_tip_msg_not_exist': '原消息不存在',
    '_uikit_msg_edit': '已编辑',
    '_uikit_msg_tip_create_group_success': '创建群聊成功',
    '_uikit_msg_tip_create_group_success_with_params': '创建群聊成功',

    '_uikit_info_send_msg': '发消息',
    '_uikit_info_send_audio': '音频通话',
    '_uikit_info_send_video': '视频通话',
    '_uikit_info_search_msg': '搜索消息',
    '_uikit_info_not_disturb': '消息免打扰',
    '_uikit_info_clear_msg': '清空聊天记录',
    '_uikit_info_button_add_contact': '添加联系人',
    '_uikit_info_menu_del_contact': '删除联系人',
    '_uikit_info_alert_title_delete_contact': '确认删除联系人',
    '_uikit_info_alert_content_delete_contact': (name) =>
      `确认删除${name}，同时删除与该联系人的聊天记录`,
    '_uikit_info_item_member': '群成员',
    '_uikit_info_item_my_remark': '我在本群的昵称',
    '_uikit_info_item_group_id': '群ID:',
    '_uikit_info_item_group_name': '群组名',
    '_uikit_info_item_group_desc': '群描述',
    '_uikit_info_alert_clear_chat_title': '确认清空聊天记录？',
    '_uikit_info_alert_modify_group_name': '修改群名',
    '_uikit_info_alert_modify_group_desc': '修改群描述',
    '_uikit_info_alert_modify_group_remark': '修改我的备注',
    '_uikit_info_menu_quit_group': '退出群组',
    '_uikit_info_menu_destroy_group': '解散群组',
    '_uikit_info_menu_change_group_owner': '转移群主',
    '_uikit_info_alert_quit_group_title': '确认退出群聊？',
    '_uikit_info_alert_quit_group_content':
      '确认退出群组，同时删除该群组的聊天记录',
    '_uikit_info_alert_destroy_group_title': '确认解散群聊？',
    '_uikit_info_alert_destroy_group_content':
      '确认解散群组，同时删除该群组的聊天记录',

    '_uikit_new_quest_title': '新请求',
    '_uikit_new_quest_list_item_tip': '请求添加您为好友。',

    '_uikit_report_title': '消息举报',
    'Unwelcome commercial content': '不受欢迎的商业内容',
    'Pornographic or explicit content': '色情或露骨内容',
    'Child abuse': '虐待儿童',
    'Hate speech or graphic violence': '仇恨言论或过于写实的暴力内容',
    'Promote terrorism': '宣扬恐怖主义',
    'Harassment or bullying': '骚扰或欺凌',
    'Suicide or self harm': '自杀或自残',
    'False information': '虚假信息',
    'Others': '其它',

    // common
    'search': '搜索',
    'cancel': '取消',
    'mute': '静音',
    'unmute': '取消静音',
    'pin': '置顶',
    'unpin': '取消置顶',
    'read': '已读',
    'remove': '移除',
    'add': '添加',
    'confirm': '确认',
    'state': '状态',
    'about': '关于',
    'login': '登录',
    'logout': '退出',
    'report': '举报',

    'picture': '图片',
    'video': '视频',
    'voice': '语音',
    'file': '文件',
    'card': '联系人',
    'set': '设置',
    'you': '你',

    'contact': '联系人',

    'copy_success': '拷贝成功',
    'online_state': '在线状态',

    '@all': '[有人@你] ',
    '@me': '[有人@你] ',

    'voice_bar_remain': (v) => `${v}秒后结束录音`,
    'voice_bar_tip_click_record': '点击录音',
    'voice_bar_tip_recording': '正在录音',
    'voice_bar_tip_click_play': '点击播放',
    'voice_bar_tip_playing': '播放中',

    '[image]': '[图片]',
    '[video]': '[视频]',
    '[file]': '[文件]',
    '[location]': '[定位]',
    '[voice]': '[语音]',
    '[custom]': '[自定义]',
    '[unknown]': '[未知类型]',
  };
}
