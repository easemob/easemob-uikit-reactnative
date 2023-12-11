import UUID from 'pure-uuid';

export function uuid(): string {
  return new UUID(4).format();
}
