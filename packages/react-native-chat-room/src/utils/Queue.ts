/**
 * ref: https://juejin.cn/post/7095608521110061064
 */
export class Queue<T> {
  items: T[];
  constructor() {
    this.items = [];
  }
  enqueue(element: T) {
    this.items.push(element);
  }
  dequeue() {
    return this.items.shift();
  }
  front() {
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
  toString() {
    let ret = '';
    for (const item of this.items) {
      const i = item as any;
      ret += i?.toString?.();
    }
    return ret;
  }
}
