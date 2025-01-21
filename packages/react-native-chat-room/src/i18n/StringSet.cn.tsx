import type { StringSet } from './types';

export function createStringSetCn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    'Private Chat': '私信',
    'Translate': '翻译',
    'Delete': '撤回',
    'Mute': '禁言',
    'Unmute': '解除',
    'Report': '举报',
    'Cancel': '取消',
    'Remove': '移除',

    'Participants': '成员列表',
    'Muted': '禁言列表',

    'Search': '搜索',

    "Let's Chat!": '发条弹幕吧~',

    'Send': '发送',

    'self': '自己',

    "Sent '@${0}'": (a: string) => `发送 '@${a}'`,
    '${0} Joined': (_: string) => `进入聊天室`,
    '${0} new message(s)': (a: string) => `${a}条未读数`,

    'Confirm': '确认',

    'delete_button_click_popups_title': '删除消息',
    'delete_button_click_popups_content': '该消息将被删除且其他人无法看到',
    'delete_button_click_popups_button_cancel': '取消',
    'delete_button_click_popups_button_confirm': '确认',

    'mute_button_click_popups_title': '禁言参与人',
    'mute_button_click_popups_content': '参与者将被禁言且无法发送消息',
    'mute_button_click_popups_button_cancel': '取消',
    'mute_button_click_popups_button_confirm': '确认',

    'report_button_click_menu_title': '举报',
    'report_button_click_menu_subtitle_message': '举报消息',
    'report_button_click_menu_subtitle_violation': '违反',
    'report_button_click_menu_subtitle_description': '描述 (选填)',
    'report_button_click_menu_button_cancel': '取消',
    'report_button_click_menu_button_report': '举报',

    'Unwelcome commercial content': '不受欢迎的商业内容',
    'Pornographic or explicit content': '色情或露骨内容',
    'Child abuse': '虐待儿童',
    'Hate speech or graphic violence': '仇恨言论或过于写实的暴力内容',
    'Promote terrorism': '宣扬恐怖主义',
    'Harassment or bullying': '骚扰或欺凌',
    'Suicide or self harm': '自杀或自残',
    'False information': '虚假信息',
    'Others': '其他',
    'Pin': '置顶消息',
    'Unpin': '取消置顶',

    'participant_list_title': '参与人',
    'participant_list_button_click_menu_privatechat': '私信',
    'participant_list_button_click_menu_mute': '禁言',
    'participant_list_button_click_menu_remove': '移除',
    'participant_list_button_click_menu_cancel': '取消',

    'remove_button_click_popups_title': '移除参与人',
    'remove_button_click_popups_content': '参与者将从该聊天室中移除',
    'remove_button_click_popups_button_cancel': '取消',
    'remove_button_click_popups_button_confirm': '确认',

    'keyboard_toolbar_button_send': '发送',

    'gift_menu_title': '礼物',

    'gift_barrage_subtitle': "送了 '@gift_name'",

    'global_broadcast_barrage_announcement': "'@broadcaster' 发布了公告",
    'global_broadcast_barrage_gifting':
      "'@username' 赠送 '@username' 一个 '@gift_name'",
    'Want to remove ${0} from the chatroom?': (name: string) =>
      `确定要移除成员${name}？`,
  };
}
