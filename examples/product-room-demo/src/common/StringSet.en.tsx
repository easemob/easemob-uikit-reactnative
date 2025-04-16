import type { StringSet } from '../rename.room';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },
    'channelList': 'Channel List',
    'channelListName': (a: string) => `${a}'s Channel`,
    'Enter': 'Enter',
    'Create': 'Create',
    'leaveRoom': 'Want to end live streaming?',
    'leaveFailed': 'Leave channel failed',
    'joinFailed': 'Join channel failed',
    'beMuted': 'You have been muted',
    'beUnmuted': 'You have been unmuted',
    'beMutedCanNotSendMessage': 'You have been muted and cannot send messages.',
    'beRemove': 'You have been removed',
    'muteSuccess': 'Mute success',
    'unmuteSuccess': 'Unmute success',
    'muteFailed': 'Mute failed',
    'unmuteFailed': 'Unmute failed',
    'kickSuccess': 'Kick success',
    'kickFailed': 'Kick failed',
    'gifts': 'gifts',
    'messageReportSuccess': 'Report success',

    'Unwelcome commercial content': 'Unwelcome commercial content',
    'Pornographic or explicit content': 'Pornographic or explicit content',
    'Child abuse': 'Child abuse',
    'Hate speech or graphic violence': 'Hate speech or graphic violence',
    'Promote terrorism': 'Promote terrorism',
    'Harassment or bullying': 'Harassment or bullying',
    'Suicide or self harm': 'Suicide or self harm',
    'False information': 'False information',
    'Others': 'Others',
  };
}
