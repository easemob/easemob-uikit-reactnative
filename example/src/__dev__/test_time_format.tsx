// https://tool.lu/timestamp/
import * as React from 'react';
import { messageTimeForChat } from 'react-native-chat-uikit';

export default function TestTime() {
  const now = messageTimeForChat(1700533685532); // 2023-11-21 10:28:05
  const yesterday = messageTimeForChat(1700446782000); //2023-11-20 10:19:42
  const month = messageTimeForChat(1697768382000); // 2023-10-20 10:19:42
  const year = messageTimeForChat(1668910782000); // 2022-11-20 10:19:42
  const week = messageTimeForChat(1700101965000); // 2023-11-16 10:32:45
  console.log('test:zuoyu:now', now);
  console.log('test:zuoyu:yesterday', yesterday);
  console.log('test:zuoyu:month', month);
  console.log('test:zuoyu:year', year);
  console.log('test:zuoyu:week', week);
  return <></>;
}
