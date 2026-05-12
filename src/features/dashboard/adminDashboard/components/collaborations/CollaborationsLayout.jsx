import { Routes, Route } from 'react-router-dom';
import { CollaborationsOverview } from './index';
import CollaborationDetail from './CollaborationDetail';

function CollaborationsLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<CollaborationsOverview />} />
        <Route path=":id" element={<CollaborationDetail />} />
      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
