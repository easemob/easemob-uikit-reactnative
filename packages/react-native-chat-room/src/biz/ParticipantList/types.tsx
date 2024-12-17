import type { UserServiceData } from '../../room';

export type ParticipantListIteModel = UserServiceData & {
  hasMenu?: boolean;
};
export type ParticipantListType = 'member' | 'muted';
