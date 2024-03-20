import type { NavigationState } from '@react-navigation/native';

export function getHashCode(s?: string): number {
  let hash = 0;
  if (!s) return hash;
  if (s.length === 0) return hash;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const avatars: number[] = [
  require('../assets/avatar1.png'),
  require('../assets/avatar2.png'),
  require('../assets/avatar3.png'),
  require('../assets/avatar4.png'),
  require('../assets/avatar5.png'),
  require('../assets/avatar6.png'),
  require('../assets/avatar7.png'),
  require('../assets/avatar8.png'),
  require('../assets/avatar9.png'),
  require('../assets/avatar10.png'),
  require('../assets/avatar11.png'),
  require('../assets/avatar12.png'),
  require('../assets/avatar13.png'),
  require('../assets/avatar14.png'),
  require('../assets/avatar15.png'),
  require('../assets/avatar16.png'),
  require('../assets/avatar17.png'),
  require('../assets/avatar18.png'),
  require('../assets/avatar19.png'),
  require('../assets/avatar20.png'),
];
export function randomAvatar(id: string) {
  const hashCode = getHashCode(id);
  const index = Math.abs(hashCode % 20);
  return avatars[index];
}

export function randomItem(Items: string[]) {
  const index = getRandomNumber(0, Items.length - 1);
  return Items[index]!;
}

export const covers: number[] = [
  require('../assets/cover1.png'),
  require('../assets/cover2.png'),
  require('../assets/cover3.png'),
  require('../assets/cover4.png'),
  require('../assets/cover5.png'),
  require('../assets/cover6.png'),
  require('../assets/cover7.png'),
  require('../assets/cover8.png'),
  require('../assets/cover9.png'),
  require('../assets/cover10.png'),
];
export function randomCover(id: string): number {
  const hashCode = getHashCode(id);
  const index = Math.abs(hashCode % 10);
  return covers[index]!;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomId(): string {
  const source = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = source.length;
  let result = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = getRandomNumber(0, length - 1);
    result += source[randomIndex];
  }
  return result;
}

export const defaultAvatars: number[] = [
  require('../assets/group_avatar_ondark.png'),
  require('../assets/group_avatar_onlight.png'),
  require('../assets/persion_avatar_ondark.png'),
  require('../assets/persion_avatar_onlight.png'),
];

export const mineInfo: number[] = [
  require('../assets/info/bell_3x.png'),
  require('../assets/info/doc_3x.png'),
  require('../assets/info/gear_3x.png'),
  require('../assets/info/info_3x.png'),
  require('../assets/info/lock_3x.png'),
  require('../assets/info/status_3x.png'),
];

export function formatNavigationState(
  state: NavigationState | undefined,
  result: string[] & string[][]
) {
  if (state) {
    const ret: string[] & string[][] = [];
    for (const route of state.routes) {
      ret.push(route.name);
      if (route.state) {
        formatNavigationState(route.state as NavigationState | undefined, ret);
      }
    }
    result.push(ret);
  }
}
