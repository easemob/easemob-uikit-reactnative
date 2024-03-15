export class SingletonObjects {
  private static _instances: any = {};
  public static getInstance<T>(c: new () => T): T {
    const key = c.name;
    if (!this._instances[key]) {
      this._instances[key] = new c();
    }
    return this._instances[key];
  }
  public static getInstanceWithParams<T, P = any>(
    c: new (params: P) => T,
    params: P
  ): T {
    const key = c.name;
    if (!this._instances[key]) {
      this._instances[key] = new c(params);
    }
    return this._instances[key];
  }
}
