import type { CallType } from '../enums';
import type { ChatMessage } from '../rename.chat';
import type { CallError } from './CallError';

/**
 * The call notification
 */
export interface CallListener {
  /**
   * Receive a notification for an invitation to join.
   *
   * The invitee needs to start ringing, display the interface, and the user can click the answer or decline button.
   *
   * @param -
   * - channelId: Call channel ID.
   * - inviterId: The inviter of the call.
   * - callType: call type. {@link CallType}
   * - extension: Extend the information.
   */
  onCallReceived: (params: {
    channelId: string;
    inviterId: string;
    callType: CallType;
    extension?: any;
  }) => void;

  /**
   * Notification that an error occurred.
   *
   * @param -
   * - channelId: Call channel ID.
   * - error: An error occurred during a call or signaling process. {@link CallError}
   */
  onCallOccurError?: (params: { channelId: string; error: CallError }) => void;

  /**
   * Callback notification when the signalling message is sent.
   * @param msg The message to be sent.
   */
  onSignallingMessage?: (msg: ChatMessage) => void;
}
