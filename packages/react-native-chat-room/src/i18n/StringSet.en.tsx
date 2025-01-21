import type { StringSet } from './types';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    'Private Chat': 'Private Chat',
    'Translate': 'Translate',
    'Delete': 'Delete',
    'Mute': 'Mute',
    'Unmute': 'Unmute',
    'Report': 'Report',
    'Cancel': 'Cancel',
    'Remove': 'Remove',

    'Participants': 'Participants',
    'Muted': 'Muted',

    'Search': 'Search',

    "Let's Chat!": "Let's Chat!",

    'Send': 'Send',

    'self': 'self',

    "Sent '@${0}'": (a: string) => `Sent '@${a}'`,
    '${0} Joined': (_: string) => `Joined`,
    '${0} new message(s)': (a: string) => `${a} new message(s)`,

    'Confirm': 'Confirm',

    'delete_button_click_popups_title': 'Delete Message',
    'delete_button_click_popups_content':
      'The message will be deleted and cannot been seen by others.',
    'delete_button_click_popups_button_cancel': 'Cancel',
    'delete_button_click_popups_button_confirm': 'Confirm',

    'mute_button_click_popups_title': 'Mute Participant',
    'mute_button_click_popups_content':
      'The participant will be muted and cannot send messages.',
    'mute_button_click_popups_button_cancel': 'Cancel',
    'mute_button_click_popups_button_confirm': 'Confirm',

    'report_button_click_menu_title': 'Report',
    'report_button_click_menu_subtitle_message': 'Report Message',
    'report_button_click_menu_subtitle_violation': 'Violation',
    'report_button_click_menu_subtitle_description': 'Description (Optional)',
    'report_button_click_menu_button_cancel': 'Cancel',
    'report_button_click_menu_button_report': 'Report',

    'Unwelcome commercial content': 'Unwelcome commercial content',
    'Pornographic or explicit content': 'Pornographic or explicit content',
    'Child abuse': 'Child abuse',
    'Hate speech or graphic violence': 'Hate speech or graphic violence',
    'Promote terrorism': 'Promote terrorism',
    'Harassment or bullying': 'Harassment or bullying',
    'Suicide or self harm': 'Suicide or self harm',
    'False information': 'False information',
    'Others': 'Others',
    'Pin': 'Pin this message',
    'Unpin': 'Unpin this message',

    'participant_list_title': 'Participants',
    'participant_list_button_click_menu_privatechat': 'Private Chat',
    'participant_list_button_click_menu_mute': 'Mute',
    'participant_list_button_click_menu_remove': 'Remove',
    'participant_list_button_click_menu_cancel': 'Cancel',

    'remove_button_click_popups_title': 'Remove Participant',
    'remove_button_click_popups_content':
      'The participant will be removed from this chatroom.',
    'remove_button_click_popups_button_cancel': 'Cancel',
    'remove_button_click_popups_button_confirm': 'Confirm',

    'keyboard_toolbar_button_send': 'Send',

    'gift_menu_title': 'Gift',

    'gift_barrage_subtitle': "sent '@gift_name'",

    'global_broadcast_barrage_announcement':
      "'@broadcaster' made an announcement",
    'global_broadcast_barrage_gifting':
      "'@username' gifts '@username' with a '@gift_name'",
    'Want to remove ${0} from the chatroom?': (name: string) =>
      `Want to remove ${name} from the chatroom?`,
  };
}
