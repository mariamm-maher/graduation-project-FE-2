import { Routes, Route } from 'react-router-dom';
import { CollaborationsOverview, MessagingSystem, CollaborationWorkspace, RatingFeedback } from './index';

function CollaborationsLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<CollaborationsOverview />} />
        <Route path="messages" element={<MessagingSystem />} />
        <Route path=":id/workspace" element={<CollaborationWorkspace />} />
        <Route path=":id/review" element={<RatingFeedback />} />
      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
