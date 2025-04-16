import type { StringSet } from '../rename.room';

export function createStringSetCn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },
    'channelList': '聊天室',
    'channelListName': (a: string) => `${a}的聊天室`,
    'Enter': '进入',
    'Create': '创建',
    'leaveRoom': '离开聊天室?',
    'leaveFailed': '离开聊天室失败',
    'joinFailed': '加入聊天室失败',
    'beMuted': '您已被禁言',
    'beMutedCanNotSendMessage': '您已被禁言，无法发送消息',
    'beUnmuted': '您已被解除禁言',
    'beRemove': '您已被请出聊天室',
    'muteSuccess': '禁言成功',
    'unmuteSuccess': '解除禁言成功',
    'muteFailed': '禁言失败',
    'unmuteFailed': '解除禁言失败',
    'kickSuccess': (name) =>
      name ? `已将${name}踢出聊天室` : '移出聊天室成功',
    'kickFailed': '移出聊天室失败',
    'gifts': '打赏',
    'messageReportSuccess': '举报已提交',

    'Unwelcome commercial content': '不受欢迎的商业内容',
    'Pornographic or explicit content': '色情或露骨内容',
    'Child abuse': '虐待儿童',
    'Hate speech or graphic violence': '仇恨言论或过于写实的暴力内容',
    'Promote terrorism': '宣扬恐怖主义',
    'Harassment or bullying': '骚扰或欺凌',
    'Suicide or self harm': '自杀或自残',
    'False information': '虚假信息',
    'Others': '其他',
  };
}
