import { Briefcase, Search, Filter, Eye, Edit, Trash2, Plus, DollarSign, Calendar, Target } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockCampaigns = [
  { 
    id: 1, 
    name: 'Summer Fashion Launch', 
    owner: 'Emma Davis',
    status: 'active', 
    budget: '$15,000',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    collaborations: 8,
    reach: '125K'
  },
  { 
    id: 2, 
    name: 'Tech Product Review', 
    owner: 'James Radcliffe',
    status: 'pending', 
    budget: '$8,500',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    collaborations: 3,
    reach: '45K'
  },
  { 
    id: 3, 
    name: 'Fitness Challenge 2025', 
    owner: 'Sarah Johnson',
    status: 'active', 
    budget: '$20,000',
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    collaborations: 12,
    reach: '200K'
  },
  { 
    id: 4, 
    name: 'Beauty Brand Collab', 
    owner: 'Emma Davis',
    status: 'completed', 
    budget: '$12,000',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    collaborations: 6,
    reach: '90K'
  },
  { 
    id: 5, 
    name: 'Food Festival Promo', 
    owner: 'Mike Chen',
    status: 'cancelled', 
    budget: '$5,000',
    startDate: '2025-01-10',
    endDate: '2025-01-20',
    collaborations: 2,
    reach: '15K'
  },
];

function CampaignsOverview() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = campaigns.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage and monitor all platform campaigns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#745CB4]/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#C1B6FD]" />
            </div>
            <span className="text-xs text-[#C1B6FD] font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCampaigns}</p>
          <p className="text-sm text-gray-400">Total Campaigns</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeCampaigns}</p>
          <p className="text-sm text-gray-400">Active Campaigns</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{pendingCampaigns}</p>
          <p className="text-sm text-gray-400">Pending Review</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-[#745CB4]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 font-semibold">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedCampaigns}</p>
          <p className="text-sm text-gray-400">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-[#C1B6FD]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
        >
          <option value="all" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>All Status</option>
          <option value="active" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Active</option>
          <option value="pending" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Pending</option>
          <option value="completed" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Completed</option>
          <option value="cancelled" style={{ backgroundColor: '#1e1632', color: '#ffffff' }}>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Campaign</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Owner</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Budget</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Duration</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Collaborations</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Reach</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campaign) => (
                <tr key={campaign.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">{campaign.name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-300">{campaign.owner}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{campaign.budget}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-gray-300">{campaign.startDate}</p>
                      <p className="text-gray-500">to {campaign.endDate}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{campaign.collaborations}</td>
                  <td className="py-4 px-4 text-gray-300">{campaign.reach}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CampaignsOverview;
