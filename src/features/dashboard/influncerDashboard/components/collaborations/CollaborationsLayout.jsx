import { Routes, Route } from 'react-router-dom';
import { CollaborationsOverview, CollaborationWorkspace, Requests, ContractsList, ContractDetail } from './index';
import TasksPane from './TasksPane';

function CollaborationsLayout() {
  return (
    <div>
      <Routes>
        <Route index element={<CollaborationsOverview />} />
        <Route path="requests" element={<Requests />} />
        <Route path="contracts" element={<ContractsList />} />
        <Route path="contracts/:id" element={<ContractDetail />} />
        <Route path=":id/workspace" element={<CollaborationWorkspace />} />
        <Route path="tasks" element={<TasksPane />} />
      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
