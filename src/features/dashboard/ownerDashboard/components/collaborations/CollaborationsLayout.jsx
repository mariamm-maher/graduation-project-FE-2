import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  CollaborationsOverview, 
  AllCollaborations,
  ActiveCollaborations,
  CompletedCollaborations,
  PastCollaborations,
  Contracts,
  ContractDetail,
  CreateContract,
  Requests,
  Messages,
  Analytics,
  ChatRooms,
  CollaborationBoard
} from './index';

function CollaborationsLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CollaborationsOverview />} />
        <Route path="all" element={<AllCollaborations />} />
        <Route path="active" element={<ActiveCollaborations />} />
        <Route path="completed" element={<CompletedCollaborations />} />
        <Route path="past" element={<PastCollaborations />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="contracts/:id" element={<ContractDetail />} />
        <Route path=":id/contract" element={<CreateContract />} />
        <Route path="requests" element={<Requests />} />
        <Route path="messages" element={<Messages />} />
        <Route path="analytics" element={<Analytics />} />
   
        <Route path="chat-rooms" element={<ChatRooms />} />
        <Route path="board" element={<CollaborationBoard />} />

      </Routes>
    </div>
  );
}

export default CollaborationsLayout;
