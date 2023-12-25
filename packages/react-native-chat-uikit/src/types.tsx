export type Keyof<T extends {}> = Extract<keyof T, string>;
export type ValueOf<T> = T[keyof T];
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null | undefined;
};
export type PartialUndefinable<T> = {
  [P in keyof T]?: T[P] | undefined;
};
export type PromiseType<T> = (...args: any[]) => Promise<T>;
export type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
export type KeyValue<K, V> = {
  key: K;
  value: V;
};
export type KV<K extends string | number | symbol, V> = {
  [k in K]: V;
};

export type PartialDeep<T> = T extends object
  ? T extends Function
    ? T
    : {
        [P in keyof T]?: PartialDeep<T[P]>;
      }
  : T;

export type RequiredDeep<T> = T extends object
  ? T extends Function
    ? T
    : {
        [P in keyof T]-?: RequiredDeep<T[P]>;
      }
  : T;
export type ArrayOneOrMore<T> = {
  0: T;
} & Array<T>;

export type ArrayTwoOrMore<T> = {
  0: T;
  1: T;
} & Array<T>;

export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type UnknownType = Record<string, unknown>;

export type ReleaseArea = 'china' | 'global';
