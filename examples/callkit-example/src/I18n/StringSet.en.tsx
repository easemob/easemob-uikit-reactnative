import type { StringSet } from 'react-native-chat-uikit';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },
    'logo': 'AgoraChat',
    'id': 'AgoraId',
    'pass': 'Password',
    'button': 'Log In',
    'tip': 'No account?',
    'register': 'Register',
  };
}
