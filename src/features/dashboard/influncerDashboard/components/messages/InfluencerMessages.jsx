import { ChatContainer } from '../../../../chat';

/**
 * InfluencerMessages - Chat page for Influencer Dashboard
 * 
 * Replaces the legacy Messages.jsx with the reusable ChatContainer.
 * Rendered at /dashboard/influencer/messages
 * 
 * Features:
 * - Full-page responsive chat layout
 * - Mobile-optimized with back button
 * - All chat functionality from ChatStore
 * - Infinite scroll for message history
 * - Real-time socket updates
 */
export default function InfluencerMessages() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Messages</h1>
        <p className="text-sm text-gray-400 mt-1">Chat with your brand collaborators</p>
      </div>
      <ChatContainer showMobileBackButton={true} />
    </div>
  );
}
