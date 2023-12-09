export type MessageInputRef = {
  close: () => void;
};
export type MessageInputProps = {
  top?: number | undefined;
  bottom?: number | undefined;
  numberOfLines?: number | undefined;
  onClickedSend?: (text: string) => void;
  closeAfterSend?: boolean;
};
export type MessageInputState = 'normal' | 'emoji' | 'voice' | 'keyboard';
