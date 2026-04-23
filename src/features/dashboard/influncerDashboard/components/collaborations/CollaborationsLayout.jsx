import { Routes, Route } from 'react-router-dom';
import { CollaborationsOverview, MessagingSystem, CollaborationWorkspace, RatingFeedback, Requests, ContractsList, ContractDetail } from './index';
import TasksPane from './TasksPane';

function CollaborationsLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<CollaborationsOverview />} />
        <Route path="requests" element={<Requests />} />
        <Route path="contracts" element={<ContractsList />} />
        <Route path="contracts/:id" element={<ContractDetail />} />
        <Route path="messages" element={<MessagingSystem />} />
        <Route path=":id/workspace" element={<CollaborationWorkspace />} />
        <Route path=":id/review" element={<RatingFeedback />} />
        <Route path="tasks" element={<TasksPane />} />
      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
