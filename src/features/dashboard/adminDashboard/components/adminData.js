// Shared mock data for admin dashboard (accounts + collaborations)

export const mockAccounts = [
  { id: 1, name: 'James Radcliffe', email: 'james@adsphere.com', role: 'owner', status: 'active', createdAt: '2025-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'influencer', status: 'active', createdAt: '2025-01-18' },
  { id: 3, name: 'Alex Martinez', email: 'alex@example.com', role: 'influencer', status: 'active', createdAt: '2025-01-20' },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'owner', status: 'active', createdAt: '2025-01-22' },
  { id: 5, name: 'Mike Chen', email: 'mike@example.com', role: 'influencer', status: 'inactive', createdAt: '2025-01-10' },
  { id: 6, name: 'Admin User', email: 'admin@adsphere.com', role: 'admin', status: 'active', createdAt: '2025-01-01' },
];

export const mockCollaborations = [
  { id: 1, ownerId: 1, owner: 'James Radcliffe', ownerEmail: 'james@adsphere.com', influencerId: 2, influencer: 'Sarah Johnson', influencerEmail: 'sarah@example.com', campaign: 'Summer Fashion Launch', status: 'active', progress: 75, unreadMessages: 3, deliverables: { completed: 3, total: 4 }, payment: 'pending', rating: null, deadline: '2025-12-15', platforms: ['Instagram', 'TikTok'], startedAt: '2025-11-01', notes: 'Fashion campaign for summer collection launch.' },
  { id: 2, ownerId: 1, owner: 'James Radcliffe', ownerEmail: 'james@adsphere.com', influencerId: 3, influencer: 'Alex Martinez', influencerEmail: 'alex@example.com', campaign: 'Tech Product Review', status: 'active', progress: 45, unreadMessages: 0, deliverables: { completed: 2, total: 5 }, payment: 'approved', rating: null, deadline: '2025-11-30', platforms: ['YouTube'], startedAt: '2025-11-10', notes: 'Tech review video series.' },
  { id: 3, ownerId: 4, owner: 'Emma Davis', ownerEmail: 'emma@example.com', influencerId: 2, influencer: 'Sarah Johnson', influencerEmail: 'sarah@example.com', campaign: 'Holiday Collection', status: 'completed', progress: 100, unreadMessages: 0, deliverables: { completed: 6, total: 6 }, payment: 'paid', rating: 4.8, deadline: '2025-11-20', platforms: ['Instagram', 'Pinterest'], startedAt: '2025-10-15', notes: 'Holiday campaign completed successfully.' },
  { id: 4, ownerId: 1, owner: 'James Radcliffe', ownerEmail: 'james@adsphere.com', influencerId: 5, influencer: 'Mike Chen', influencerEmail: 'mike@example.com', campaign: 'Fitness Challenge', status: 'pending_review', progress: 90, unreadMessages: 1, deliverables: { completed: 5, total: 5 }, payment: 'processing', rating: null, deadline: '2025-11-25', platforms: ['TikTok', 'YouTube'], startedAt: '2025-11-05', notes: '30-day fitness challenge.' },
];
