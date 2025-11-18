# Collaborations Components

This folder contains all components related to influencer collaboration management.

## Components

### CollaborationsOverview.jsx
Main overview page displaying all active and past collaborations with influencers. Shows:
- Statistics dashboard (active collaborations, pending reviews, unread messages)
- List of all collaborations with progress tracking
- Quick access to workspace and messaging
- Payment status and deliverables summary

### MessagingSystem.jsx
Built-in messaging system for brand-influencer communication. Features:
- Real-time chat interface
- Conversation list with unread indicators
- Support for text, images, and file attachments
- Online status indicators
- Call and video call options

### CollaborationWorkspace.jsx
Private workspace for each collaboration providing:
- **Brief Tab**: Campaign objectives, target audience, key messages, hashtags, brand guidelines
- **Timeline Tab**: Milestone tracking with completion status
- **Deliverables Tab**: File uploads, review, approval workflow
- **Payment Tab**: Milestone-based payment tracking and status

### RatingFeedback.jsx
Post-campaign rating and feedback system. Includes:
- Overall star rating (1-5)
- Detailed category ratings (communication, quality, professionalism, timeliness, creativity)
- Would recommend toggle
- Written feedback
- Campaign performance summary

## Usage

```jsx
import { 
  CollaborationsOverview, 
  MessagingSystem, 
  CollaborationWorkspace, 
  RatingFeedback 
} from './components/collaborations';

// In your routes
<Route path="/dashboard/collaborations" element={<CollaborationsOverview />} />
<Route path="/dashboard/collaborations/messages" element={<MessagingSystem />} />
<Route path="/dashboard/collaborations/:id/workspace" element={<CollaborationWorkspace />} />
<Route path="/dashboard/collaborations/:id/review" element={<RatingFeedback />} />
```

## Styling
All components use:
- Purple gradient theme (#C1B6FD, #745CB4)
- Custom scrollbar styling
- Glass morphism effects (backdrop-blur)
- Lucide React icons
- Consistent spacing and border patterns
