export * from './MessageList';
export { gMessageListHeight } from './MessageList.const';
export * from './MessageList.item';
export * from './types';

/**
 * Preface
 * 
 * The message list can display sent and received messages.
Current messages are divided into three types: gift messages, text messages, and reminder messages.

 * Message list update strategy
 * 1. Send a message: After the message is sent successfully, the message will appear on the screen. Failure is notified to the user through callback notifications.
 * 2. Send a message: After sending, it will automatically scroll to the bottom.
 * 3. Send a message: After sending, hide the unread button.
 * 4. Receive messages: text messages and gift messages.
 * 5. Receive the message: If it is the bottom, it will scroll automatically, otherwise it will not scroll and the unread value will be added.
 * 6. The data source is updated both when sending a message and when receiving a message. The difference is whether it is scrolled to the bottom.
 * 7. After sending the message: Whether to hide the sending component, set it to optional.
 * 8. The user scrolls the message list, does not scroll when receiving messages, and scrolls to the bottom when sending messages. It is theoretically impossible to send a message while the user is scrolling through the list.
 * 9. The user scrolls to the bottom of the message list and hides the unread message button.
 * 10. If the user long presses the message list, the message will not scroll when receiving the message, but the message will scroll to the bottom when sending the message.
 * 11. When idle, the oldest messages will be recycled, and you can specify the maximum number of messages to retain. If not needed, you can set 9999 as the maximum limit.
 */
export const MessageListPreface = 'Preface';
