import { Routes, Route } from 'react-router-dom';
import { CollaborationsOverview } from './index';
import CollaborationDetail from './CollaborationDetail';
import MessagingSystem from './MessagingSystem';

function CollaborationsLayout() {
  return (
    <div>
      <Routes>
        <Route index element={<CollaborationsOverview />} />
        <Route path="messages" element={<MessagingSystem />} />
        <Route path=":id" element={<CollaborationDetail />} />
      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
