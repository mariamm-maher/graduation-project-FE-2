import { ChatContainer } from '../../../../../../chat';

/**
 * OwnerCollaborationChat - Chat component for Owner Collaboration Hub
 * 
 * Replaces the legacy ChatsPane with the reusable ChatContainer.
 * Used inside SingleCollabHub as the 'chats' tab content.
 * 
 * Features:
 * - Responsive layout (sidebar + chat window)
 * - Mobile-optimized with back button
 * - All chat functionality from ChatStore
 * - Infinite scroll for message history
 * - Real-time socket updates
 */
export default function OwnerCollaborationChat() {
  return (
    <div className="w-full">
      <ChatContainer 
        height="h-[620px]"
        showMobileBackButton={true}
      />
    </div>
  );
}
