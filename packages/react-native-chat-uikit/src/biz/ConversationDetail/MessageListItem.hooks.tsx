import { Dimensions } from 'react-native';
import {
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageType,
} from 'react-native-chat-sdk';

import { Services } from '../../services';
import type { MessageStateType } from './types';

export function isSupportMessage(msg: ChatMessage) {
  if (msg.body.type === ChatMessageType.CMD) {
    return false;
  } else if (msg.body.type === ChatMessageType.LOCATION) {
    return false;
  } else if (msg.body.type === ChatMessageType.COMBINE) {
    return false;
  } else if (msg.body.type === ChatMessageType.CUSTOM) {
    // todo: custom message
    return false;
  }
  return true;
}
export function getMessageState(msg: ChatMessage): MessageStateType {
  let ret: MessageStateType = 'none';
  if (msg.direction === ChatMessageDirection.RECEIVE) {
    switch (msg.body.type) {
      case ChatMessageType.VOICE: {
        const r = msg.attributes?._$uikit.voice['no-play'] as
          | boolean
          | undefined;
        ret = r === true ? 'no-play' : 'none';
      }
    }
  } else {
    if (msg.status === ChatMessageStatus.SUCCESS) {
      ret = 'send-success';
    } else if (msg.status === ChatMessageStatus.FAIL) {
      ret = 'send-fail';
    } else {
      ret = 'sending';
    }
    // todo: send-to-peer
    // todo: peer-read
  }
  return ret;
}

export async function getImageThumbUrl(msg: ChatMessage) {
  const body = msg.body as ChatImageMessageBody;
  // todo: file is or not exist
  // todo: 判断顺序，如果是发送的消息，本地缩略图 -》 本地大图 =》 服务器缩略图
  // todo: 如果是接收的消息，本地缩略图 =》 服务器缩略图
  let isExisted = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
  if (isExisted) {
    return `file://${body.thumbnailLocalPath}`;
  }
  isExisted = await Services.dcs.isExistedFile(body.localPath);
  if (isExisted) {
    return `file://${body.localPath}`;
  }
  return body.thumbnailRemotePath;
}

const hw = (params: {
  height: number;
  width: number;
  winWidth: number;
}): { width: number; height: number } => {
  const { height, width, winWidth } = params;
  let ret;
  if (width / height >= 10) {
    const w = winWidth * 0.6;
    ret = {
      width: w,
      height: w * 0.1,
    };
  } else if (width * 4 >= 3 * height) {
    const w = winWidth * 0.6;
    ret = {
      width: w,
      height: w * (height / width),
    };
  } else if (width * 10 >= 1 * height) {
    const h = (winWidth * 0.6 * 4) / 3;
    ret = {
      width: (width / height) * h,
      height: h,
    };
  } else {
    // width / height < 1 / 10
    const h = (winWidth * 0.6 * 4) / 3;
    ret = {
      width: 0.1 * h,
      height: h,
    };
  }
  return ret;
};
export function getImageShowSize(msg: ChatMessage) {
  const winWidth = Dimensions.get('window').width;
  const body = msg.body as ChatImageMessageBody;
  const width = body.width;
  const height = body.height;
  if (width !== undefined && height !== undefined) {
    return hw({ width, height, winWidth });
  } else {
    return {
      width: winWidth * 0.6,
      height: winWidth * 0.6,
    };
  }
}

export class VoicePlayManager {
  static list: Map<string, boolean> = new Map();
  static setPlaying(msgId: string, isPlaying: boolean) {
    if (isPlaying === true) {
      this.list.set(msgId, isPlaying);
    } else {
      this.list.delete(msgId);
    }
  }
  static isPlaying(msgId: string) {
    return this.list.get(msgId) === true;
  }
}
