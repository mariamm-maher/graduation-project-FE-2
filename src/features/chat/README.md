# Chat Feature Architecture

## Overview

This is the **single source of truth** for all chat functionality across the application.
All chat UI and behavior is defined here and consumed by dashboard-specific wrappers.

## Architecture

```
frontend/src/features/chat/
├── ChatContainer.jsx       # Main reusable chat component with all logic
├── ChatPage.jsx            # Thin wrapper for standalone page usage
├── ChatSidebar.jsx         # Room list sidebar (presentational)
├── ChatWindow.jsx          # Message display + input (presentational)
├── MessageBubble.jsx       # Individual message (presentational)
├── MessageInput.jsx        # Input field (presentational)
├── index.js                # Public API exports
└── README.md               # This file
```

## Usage

### As a Standalone Page

```jsx
import { ChatPage } from '../chat';

// In your router:
<Route path="messages" element={<ChatPage />} />
```

### Embedded in Another Component

```jsx
import { ChatContainer } from '../chat';

function MyComponent() {
  return (
    <div>
      <h1>My Header</h1>
      <ChatContainer height="h-[600px]" />
    </div>
  );
}
```

### With Custom Room Selection Handler

```jsx
import { ChatContainer } from '../chat';

function MyComponent() {
  const handleRoomSelect = (roomId) => {
    console.log('Selected room:', roomId);
    // Custom logic here
  };

  return (
    <ChatContainer 
      onRoomSelect={handleRoomSelect}
      initialRoomId="123"
    />
  );
}
```

## Props

### ChatContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | '' | Additional CSS classes |
| `height` | string | responsive | Height classes (e.g., 'h-[600px]') |
| `onRoomSelect` | function | null | Callback when room is selected |
| `initialRoomId` | string | null | Room to select on mount |
| `showMobileBackButton` | boolean | true | Show back button on mobile |

## State Management

All chat state is managed by `useChatStore` (Zustand store at `frontend/src/stores/ChatStore.js`).
The store handles:
- Socket connections
- Room management
- Message fetching and sending
- Typing indicators
- Unread counts
- Pagination

## Dashboard Implementations

### Owner Dashboard
- **Route**: `/dashboard/owner/collaborations/overview?tab=chats`
- **Component**: `OwnerCollaborationChat.jsx`
- **Location**: `features/dashboard/ownerDashboard/components/collaborations/singleCollab/components/`

### Influencer Dashboard
- **Route**: `/dashboard/influencer/messages`
- **Component**: `InfluencerMessages.jsx`
- **Location**: `features/dashboard/influncerDashboard/components/messages/`

## Migration Notes

### Deprecated Components (to be removed)

- ~~`ChatsPane.jsx`~~ → `ChatsPane.deprecated.jsx` (Owner chat - replaced by OwnerCollaborationChat)
- ~~`Messages.jsx`~~ → `Messages.deprecated.jsx` (Influencer chat - replaced by InfluencerMessages)
- ~~`ChatHeader.jsx`~~ → `ChatHeader.deprecated.jsx` (Influencer - unused)
- ~~`ChatInput.jsx`~~ → `ChatInput.deprecated.jsx` (Influencer - unused)
- ~~`ChatSidebar.jsx`~~ → `ChatSidebar.deprecated.jsx` (Influencer - unused)
- ~~`ChatWindow.jsx`~~ → `ChatWindow.deprecated.jsx` (Influencer - unused)
- ~~`MessageBubble.jsx`~~ → `MessageBubble.deprecated.jsx` (Influencer - unused)

### Key Changes

1. All chat logic moved to `features/chat/ChatContainer.jsx`
2. Dashboard components are now thin wrappers (~10-20 lines)
3. No duplicated socket logic
4. No duplicated UI code
5. Consistent styling and behavior across dashboards
6. Shared pagination/infinite scroll logic
7. Mobile-responsive layout with back button support

## Testing

After making changes to chat components:
1. Test on Owner dashboard: `/dashboard/owner/collaborations/overview?tab=chats`
2. Test on Influencer dashboard: `/dashboard/influencer/messages`
3. Verify mobile responsiveness (sidebar/chat toggle)
4. Verify message sending/receiving
5. Verify infinite scroll (load older messages)
6. Verify socket reconnection
