import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  CollaborationsOverview, 
  AllCollaborations,
 
  PastCollaborations,
  Contracts,
  ContractDetail,
  CreateContract,
  Requests,

  Analytics,
  CollaborationBoard,
  SingleCollabHub,
  CollaborationWorkspace
} from './index';

function CollaborationsLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<SingleCollabHub />} />
        <Route path=":id/workspace" element={<CollaborationWorkspace />} />
        <Route path="hub" element={<SingleCollabHub />} />
        {/* <Route path="all" element={<AllCollaborations />} /> */}
       

        {/* <Route path="past" element={<PastCollaborations />} /> */}
        {/* <Route path="contracts" element={<Contracts />} /> */}
        {/* <Route path="contracts/:id" element={<ContractDetail />} /> */}
        {/* <Route path=":id/contract" element={<CreateContract />} /> */}
        {/* <Route path="requests" element={<Requests />} /> */}    
        {/* <Route path="analytics" element={<Analytics />} /> */}
        {/* <Route path="board" element={<CollaborationBoard />} /> */}

      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
