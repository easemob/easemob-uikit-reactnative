/**
 * ref: https://juejin.cn/post/7095608521110061064
 */
export type Strategy = 'top-remove' | 'bottom-remove' | 'none';
export class Stack<T> {
  items: T[];
  max: number;
  strategy: Strategy;
  constructor(params?: { max?: number; strategy?: Strategy }) {
    this.items = [];
    this.max = params?.max || 1;
    this.strategy = params?.strategy ?? 'top-remove';
  }
  push(element: T) {
    if (this.items.length >= this.max) {
      if (this.strategy === 'top-remove') {
        this.items.shift();
      } else if (this.strategy === 'bottom-remove') {
        this.items.pop();
      } else {
        return;
      }
    }
    this.items.push(element);
  }
  pop() {
    return this.items.pop();
  }
  top() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
