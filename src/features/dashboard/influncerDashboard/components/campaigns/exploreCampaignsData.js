// Available campaigns for influencers to explore
export const exploreCampaigns = [
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
    status: 'open',
    postedDate: '2025-01-20',
    startDate: '2025-02-01',
    endDate: '2025-03-15',
    // Detailed info for single campaign view
    campaignDetails: {
      objectives: 'Increase brand awareness and drive sales for spring collection',
      targetAudience: 'Gen Z and Millennials (18-35) interested in fashion and lifestyle',
      contentGuidelines: 'High-quality lifestyle photos, authentic reviews, unboxing videos',
      hashtags: ['#SpringFashion2025', '#FashionBrand', '#NewCollection'],
      brandGuidelines: 'Maintain brand voice, use approved color palette, include product links',
      deliverables: [
        { type: 'Instagram Post', count: 2, deadline: '2025-02-15' },
        { type: 'TikTok Video', count: 2, deadline: '2025-02-20' }
      ],
      paymentTerms: '50% upfront, 50% upon completion of all deliverables',
      exclusivity: 'No competing fashion brands for 30 days'
    }
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
    postedDate: '2025-01-18',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    campaignDetails: {
      objectives: 'Generate authentic reviews and unboxing content for product launch',
      targetAudience: 'Tech enthusiasts, early adopters, gadget lovers',
      contentGuidelines: 'Detailed unboxing, honest reviews, comparison with competitors',
      hashtags: ['#TechInnovations', '#ProductLaunch', '#TechReview'],
      brandGuidelines: 'Focus on product features, honest opinions welcome',
      deliverables: [
        { type: 'YouTube Video', count: 1, deadline: '2025-02-15' },
        { type: 'Instagram Post', count: 2, deadline: '2025-02-20' }
      ],
      paymentTerms: 'Full payment upon approval of final content',
      exclusivity: 'No competing tech products for 60 days'
    }
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
    postedDate: '2025-01-22',
    startDate: '2025-02-10',
    endDate: '2025-03-01',
    campaignDetails: {
      objectives: 'Build trust and showcase product effectiveness through authentic reviews',
      targetAudience: 'Beauty enthusiasts, skincare lovers, makeup artists',
      contentGuidelines: 'Before/after photos, tutorial videos, honest reviews',
      hashtags: ['#BeautyEssentials', '#Skincare', '#BeautyReview'],
      brandGuidelines: 'Natural lighting, clear product shots, honest feedback',
      deliverables: [
        { type: 'Instagram Post', count: 2, deadline: '2025-02-20' },
        { type: 'TikTok Video', count: 2, deadline: '2025-02-25' },
        { type: 'YouTube Short', count: 1, deadline: '2025-02-28' }
      ],
      paymentTerms: '30% upfront, 70% upon completion',
      exclusivity: 'No competing beauty brands for 45 days'
    }
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
    postedDate: '2025-01-15',
    startDate: '2025-02-01',
    endDate: '2025-02-20',
    campaignDetails: {
      objectives: 'Promote fitness challenge and inspire audience participation',
      targetAudience: 'Fitness enthusiasts, health-conscious individuals, gym-goers',
      contentGuidelines: 'Workout videos, transformation stories, motivational content',
      hashtags: ['#FitnessChallenge2025', '#FitnessPro', '#WorkoutMotivation'],
      brandGuidelines: 'Energetic and motivational tone, showcase proper form',
      deliverables: [
        { type: 'Instagram Post', count: 3, deadline: '2025-02-10' },
        { type: 'TikTok Video', count: 3, deadline: '2025-02-15' }
      ],
      paymentTerms: '50% upfront, 50% upon completion',
      exclusivity: 'No competing fitness brands for 30 days'
    }
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
    postedDate: '2025-01-25',
    startDate: '2025-03-01',
    endDate: '2025-04-01',
    campaignDetails: {
      objectives: 'Position brand as luxury lifestyle choice through premium content',
      targetAudience: 'High-income individuals, luxury enthusiasts, collectors',
      contentGuidelines: 'Elegant lifestyle shots, sophisticated styling, premium aesthetics',
      hashtags: ['#LuxuryTimepieces', '#LuxuryLifestyle', '#PremiumWatches'],
      brandGuidelines: 'Maintain luxury aesthetic, professional photography required',
      deliverables: [
        { type: 'Instagram Post', count: 2, deadline: '2025-03-20' },
        { type: 'YouTube Video', count: 1, deadline: '2025-03-25' }
      ],
      paymentTerms: 'Full payment upon approval of final content',
      exclusivity: 'No competing luxury brands for 90 days'
    }
  }
];

// Helper function to get campaign by ID
export const getExploreCampaignById = (id) => {
  return exploreCampaigns.find(campaign => campaign.id === parseInt(id));
};

