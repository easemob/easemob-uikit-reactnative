export * from './BottomSheetParticipantList';
export * from './ParticipantContextMenu';
export * from './ParticipantList';
export * from './ParticipantList.item';
export * from './SearchParticipant';
export * from './types';

/**
 * Preface
 *
 * The chat room member list component is mainly divided into two parts, the chat room member management component and the member search component.
 *
 * The chat room member management component includes a member list and a mute list.
 *
 * Owner can mute and unmute chat room members.
 *
 * You can perform a local search for members or banned members in the search list.
 *
 *
 * Chat room member list and mute list `ParticipantList.tsx`.
 *
 * Chat room member and mute search `SearchParticipant.tsx`.
 *
 * Member list update strategy:
 * 1. The member list is divided into id and details.
 * 2.id: The specific behavior of refreshing the member list is to re-pull the first page of the member list and clear the previous data.
 * 3.id: The specific behavior of loading more members is to get the second page or more.
 * 4.detail: After the list is loaded and stops scrolling for 1 second, obtain the member information of the display area.
 * 5.detail: Add or update member information through received messages. Interface data is not updated.
 * 6. Update interface data through member entry and exit notifications in the room.
 * 7. In addition to displaying member data, owner also displays the mute list.
 * 8. When refreshing member data, you should first pull the first page data, then pull the detail data, and finally pull the banned data. The banned data will also update the user details.
 * 9. The member list only pulls the member data, and then pulls the member data details on the first page. The member list menu only has muting.
 * 10. The forbidden list only pulls the forbidden data. After that, pull the member data details on the first page. May overlap with 9. The mute list menu only has the option to unmute.
 * 11. Save member data globally.
 * 12. Save mute data globally. Because both mute data and member data are used between multiple pages.
 * 13. (Temporarily) Exiting the chat room does not clear global member details.
 * 14. (Temporarily) Exit the chat room and clear the global banned member data.
 * 15. Being kicked out of the chat room by the host.
 * 16. No more members, give callback notification. The user can pop up a toast to prompt.
 */
export const ParticipantListPreface = 'ParticipantListPreface';
