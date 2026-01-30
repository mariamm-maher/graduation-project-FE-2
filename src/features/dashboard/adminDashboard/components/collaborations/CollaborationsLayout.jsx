import { Routes, Route } from 'react-router-dom';
import { CollaborationsOverview, MessagingSystem, CollaborationWorkspace, RatingFeedback } from './index';
import CollaborationDetail from './CollaborationDetail';

function CollaborationsLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<CollaborationsOverview />} />
        <Route path="messages" element={<MessagingSystem />} />
        <Route path=":id" element={<CollaborationDetail />} />
        <Route path=":id/workspace" element={<CollaborationWorkspace />} />
        <Route path=":id/review" element={<RatingFeedback />} />
        <Route path=":id/messages" element={<MessagingSystem />} />
      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
