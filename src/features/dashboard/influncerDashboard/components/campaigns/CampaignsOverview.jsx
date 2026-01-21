import { useState } from 'react';
import { 
  Megaphone, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Target, 
  Play, 
  Clock,
  Search,
  Filter,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Eye,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

function CampaignsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCampaigns, setSavedCampaigns] = useState([2, 4]); // IDs of saved campaigns
  const [filter, setFilter] = useState('all'); // all, fashion, tech, beauty

  // Available campaigns to explore (from owners)
  const availableCampaigns = [
    {
      id: 1,
      name: 'Spring Fashion Collection 2025',
      brand: 'Fashion Brand Co.',
      owner: 'John Smith',
      ownerEmail: 'john@fashionbrand.com',
      category: 'Fashion',
      budget: '$15,000',
      paymentPerPost: '$2,500',
      deadline: '2025-03-15',
      platforms: ['Instagram', 'TikTok'],
      requirements: '10K+ followers, Fashion niche',
      description: 'Looking for fashion influencers to promote our new spring collection. Content should be lifestyle-focused with high-quality visuals.',
      deliverables: 4,
      expectedReach: '500K+',
      status: 'open', // open, saved, requested
      postedDate: '2025-01-20'
    },
    {
      id: 2,
      name: 'Tech Product Launch',
      brand: 'Tech Innovations',
      owner: 'Sarah Williams',
      ownerEmail: 'sarah@techinnovations.com',
      category: 'Tech',
      budget: '$25,000',
      paymentPerPost: '$5,000',
      deadline: '2025-02-28',
      platforms: ['YouTube', 'Instagram'],
      requirements: '50K+ subscribers, Tech reviews',
      description: 'We need tech reviewers to create detailed reviews of our new product. Video content preferred with unboxing and testing.',
      deliverables: 3,
      expectedReach: '1M+',
      status: 'saved',
      postedDate: '2025-01-18'
    },
    {
      id: 3,
      name: 'Beauty Product Campaign',
      brand: 'Beauty Essentials',
      owner: 'Emma Davis',
      ownerEmail: 'emma@beautyessentials.com',
      category: 'Beauty',
      budget: '$12,000',
      paymentPerPost: '$1,800',
      deadline: '2025-03-01',
      platforms: ['Instagram', 'TikTok', 'YouTube Shorts'],
      requirements: '20K+ followers, Beauty/Makeup niche',
      description: 'Promote our new skincare line with authentic reviews and tutorials. Before/after content highly valued.',
      deliverables: 5,
      expectedReach: '800K+',
      status: 'open',
      postedDate: '2025-01-22'
    },
    {
      id: 4,
      name: 'Fitness Challenge 2025',
      brand: 'Fitness Pro',
      owner: 'Mike Johnson',
      ownerEmail: 'mike@fitnesspro.com',
      category: 'Fitness',
      budget: '$18,000',
      paymentPerPost: '$3,000',
      deadline: '2025-02-20',
      platforms: ['Instagram', 'TikTok'],
      requirements: '30K+ followers, Fitness/Lifestyle',
      description: 'Join our 30-day fitness challenge! Create engaging workout content and transformation stories.',
      deliverables: 6,
      expectedReach: '600K+',
      status: 'saved',
      postedDate: '2025-01-15'
    },
    {
      id: 5,
      name: 'Luxury Watch Collection',
      brand: 'Luxury Timepieces',
      owner: 'David Chen',
      ownerEmail: 'david@luxurytime.com',
      category: 'Luxury',
      budget: '$35,000',
      paymentPerPost: '$7,000',
      deadline: '2025-04-01',
      platforms: ['Instagram', 'YouTube'],
      requirements: '100K+ followers, Luxury lifestyle',
      description: 'Showcase our premium watch collection. High-end lifestyle content with emphasis on elegance and sophistication.',
      deliverables: 3,
      expectedReach: '2M+',
      status: 'open',
      postedDate: '2025-01-25'
    }
  ];

  const filteredCampaigns = availableCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || campaign.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleSaveCampaign = (campaignId) => {
    if (savedCampaigns.includes(campaignId)) {
      setSavedCampaigns(savedCampaigns.filter(id => id !== campaignId));
    } else {
      setSavedCampaigns([...savedCampaigns, campaignId]);
    }
  };

  const handleRequestCampaign = (campaignId) => {
    // Here you would typically make an API call
    console.log('Requesting campaign:', campaignId);
    alert('Request sent! The campaign owner will review your application.');
  };

  const handleContactOwner = (ownerEmail, campaignName) => {
    // Here you would typically open a messaging interface
    console.log('Contacting owner:', ownerEmail, 'for campaign:', campaignName);
    // Navigate to messages or open chat
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Explore Campaigns</h1>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Discover and apply to available campaigns from brands</p>
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, brands, categories..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'fashion', 'tech', 'beauty', 'fitness'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === cat
                      ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Available</p>
          <p className="text-2xl font-bold text-white">{availableCampaigns.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Saved</p>
          <p className="text-2xl font-bold text-[#C1B6FD]">{savedCampaigns.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-green-400">$105K</p>
        </div>
        <Link to="/dashboard/influencer/collaborations" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
          <p className="text-xs text-gray-400 mb-1">My Collaborations</p>
          <p className="text-2xl font-bold text-white">4</p>
        </Link>
      </div>

      {/* Available Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all group"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Campaign Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">
                        {campaign.name}
                      </h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        {campaign.status === 'saved' ? 'Saved' : 'Open'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Brand: {campaign.brand}</p>
                    <p className="text-xs text-gray-500">Posted: {campaign.postedDate} • Deadline: {campaign.deadline}</p>
                  </div>
                  <button
                    onClick={() => handleSaveCampaign(campaign.id)}
                    className={`p-2 rounded-lg transition-all ${
                      savedCampaigns.includes(campaign.id)
                        ? 'bg-[#745CB4]/20 text-[#C1B6FD]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    title={savedCampaigns.includes(campaign.id) ? 'Remove from saved' : 'Save for later'}
                  >
                    {savedCampaigns.includes(campaign.id) ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{campaign.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Payment</p>
                    <p className="text-sm font-bold text-[#C1B6FD]">{campaign.paymentPerPost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Deliverables</p>
                    <p className="text-sm font-bold text-white">{campaign.deliverables} posts</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Expected Reach</p>
                    <p className="text-sm font-bold text-white">{campaign.expectedReach}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Category</p>
                    <p className="text-sm font-bold text-white">{campaign.category}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.platforms.map((platform, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-300">
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Requirements</p>
                  <p className="text-sm text-white">{campaign.requirements}</p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="lg:w-48 flex flex-col gap-3">
                <button
                  onClick={() => handleRequestCampaign(campaign.id)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
                <button
                  onClick={() => handleContactOwner(campaign.ownerEmail, campaign.name)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Owner
                </button>
                <Link
                  to={`/dashboard/influencer/campaigns/${campaign.id}`}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
                <div className="bg-white/5 rounded-lg p-3 mt-auto">
                  <p className="text-xs text-gray-400 mb-1">Campaign Owner</p>
                  <p className="text-sm font-semibold text-white">{campaign.owner}</p>
                  <p className="text-xs text-gray-400">{campaign.ownerEmail}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

 

    </div>
  );
}

export default CampaignsOverview;
