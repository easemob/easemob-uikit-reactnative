import type { ClipboardService, ClipboardServiceOption } from './types';

export class ClipboardServiceImplement implements ClipboardService {
  option: ClipboardServiceOption;
  constructor(option: ClipboardServiceOption) {
    this.option = option;
  }
  setString(text: string): void {
    this.option.clipboard.setString(text);
  }
  getString(): Promise<string> {
    return this.option.clipboard.getString();
  }
}
