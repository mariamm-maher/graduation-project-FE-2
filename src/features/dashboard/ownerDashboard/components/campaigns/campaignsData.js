// Shared campaigns data source
// In production, this would come from an API

export const campaigns = [
  {
    id: 1,
    campaignName: 'Summer Fashion Launch',
    name: 'Summer Fashion Launch', // Legacy support
    lifecycleStage: 'active',
    status: 'active', // Legacy support
    goalType: 'brand_awareness',
    totalBudget: 85000,
    currency: '$',
    budget: '$85,000', // Legacy support
    spent: '$62,400',
    remaining: '$22,600',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    createdAt: '2025-01-10',
    collaboratorsCount: 24,
    influencers: 24, // Legacy support
    pendingRequests: 3,
    kpisCount: 5,
    reach: '4.2M',
    engagement: '7.8%',
    progress: 73,
    description: 'A comprehensive marketing campaign to launch our new summer fashion collection targeting Gen Z and Millennial audiences with a focus on sustainable fashion and modern aesthetics.',
    metrics: {
      reach: '4.2M',
      impressions: '12.5M',
      engagement: '7.8%',
      clicks: '125K',
      conversions: '3,240',
      revenue: '$185,000'
    },
    influencerList: [
      {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        platform: 'instagram',
        followers: '2.4M',
        status: 'active',
        posts: 3,
        engagement: '8.2%'
      },
      {
        id: 2,
        name: 'Mike Chen',
        avatar: 'MC',
        platform: 'youtube',
        followers: '1.8M',
        status: 'active',
        posts: 2,
        engagement: '6.5%'
      },
      {
        id: 3,
        name: 'Emma Davis',
        avatar: 'ED',
        platform: 'instagram',
        followers: '3.1M',
        status: 'pending',
        posts: 0,
        engagement: '9.1%'
      }
    ],
    timeline: [
      {
        id: 1,
        title: 'Campaign Launch',
        date: 'Jan 15, 2025',
        status: 'completed',
        description: 'Campaign officially launched across all platforms'
      },
      {
        id: 2,
        title: 'First Content Wave',
        date: 'Jan 25, 2025',
        status: 'completed',
        description: 'Initial influencer content published'
      },
      {
        id: 3,
        title: 'Mid-Campaign Review',
        date: 'Feb 15, 2025',
        status: 'in_progress',
        description: 'Performance review and optimization'
      },
      {
        id: 4,
        title: 'Final Content Push',
        date: 'Mar 1, 2025',
        status: 'pending',
        description: 'Final wave of content before campaign end'
      },
      {
        id: 5,
        title: 'Campaign Completion',
        date: 'Mar 15, 2025',
        status: 'pending',
        description: 'Campaign ends and final reports generated'
      }
    ],
    collaborationStatus: {
      total: 24,
      active: 18,
      pending: 4,
      completed: 2
    }
  },
  {
    id: 2,
    campaignName: 'Holiday Collection 2024',
    name: 'Holiday Collection 2024', // Legacy support
    lifecycleStage: 'active',
    status: 'active', // Legacy support
    goalType: 'sales',
    totalBudget: 120000,
    currency: '$',
    budget: '$120,000', // Legacy support
    spent: '$98,200',
    remaining: '$21,800',
    startDate: '2024-11-01',
    endDate: '2025-01-31',
    createdAt: '2024-10-25',
    collaboratorsCount: 32,
    influencers: 32, // Legacy support
    pendingRequests: 2,
    kpisCount: 6,
    reach: '6.8M',
    engagement: '8.5%',
    progress: 82,
    description: 'A festive holiday marketing campaign promoting our exclusive holiday collection with special offers and limited edition items.',
    metrics: {
      reach: '6.8M',
      impressions: '18.2M',
      engagement: '8.5%',
      clicks: '245K',
      conversions: '5,120',
      revenue: '$320,000'
    },
    influencerList: [
      {
        id: 1,
        name: 'Lisa Wang',
        avatar: 'LW',
        platform: 'instagram',
        followers: '5.0M',
        status: 'active',
        posts: 5,
        engagement: '10.5%'
      },
      {
        id: 2,
        name: 'Alex Rivera',
        avatar: 'AR',
        platform: 'youtube',
        followers: '1.2M',
        status: 'active',
        posts: 3,
        engagement: '7.8%'
      }
    ],
    timeline: [
      {
        id: 1,
        title: 'Campaign Launch',
        date: 'Nov 1, 2024',
        status: 'completed',
        description: 'Holiday campaign officially launched'
      },
      {
        id: 2,
        title: 'Black Friday Push',
        date: 'Nov 25, 2024',
        status: 'completed',
        description: 'Special Black Friday content and promotions'
      },
      {
        id: 3,
        title: 'Holiday Peak',
        date: 'Dec 15, 2024',
        status: 'completed',
        description: 'Peak holiday shopping period content'
      },
      {
        id: 4,
        title: 'New Year Campaign',
        date: 'Jan 1, 2025',
        status: 'in_progress',
        description: 'New Year special promotions'
      },
      {
        id: 5,
        title: 'Campaign Completion',
        date: 'Jan 31, 2025',
        status: 'pending',
        description: 'Campaign ends and final reports generated'
      }
    ],
    collaborationStatus: {
      total: 32,
      active: 28,
      pending: 2,
      completed: 2
    }
  },
  {
    id: 3,
    campaignName: 'Spring Wellness Campaign',
    name: 'Spring Wellness Campaign', // Legacy support
    lifecycleStage: 'active',
    status: 'active', // Legacy support
    goalType: 'engagement',
    totalBudget: 55000,
    currency: '$',
    budget: '$55,000', // Legacy support
    spent: '$21,300',
    remaining: '$33,700',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    createdAt: '2025-01-20',
    collaboratorsCount: 18,
    influencers: 18, // Legacy support
    pendingRequests: 5,
    kpisCount: 4,
    reach: '2.1M',
    engagement: '6.9%',
    progress: 39,
    description: 'A wellness-focused campaign promoting healthy lifestyle products and spring wellness tips through influencer partnerships.',
    metrics: {
      reach: '2.1M',
      impressions: '5.8M',
      engagement: '6.9%',
      clicks: '68K',
      conversions: '1,450',
      revenue: '$95,000'
    },
    influencerList: [
      {
        id: 1,
        name: 'David Kim',
        avatar: 'DK',
        platform: 'youtube',
        followers: '900K',
        status: 'active',
        posts: 1,
        engagement: '5.2%'
      },
      {
        id: 2,
        name: 'Emma Davis',
        avatar: 'ED',
        platform: 'instagram',
        followers: '3.1M',
        status: 'active',
        posts: 2,
        engagement: '9.1%'
      }
    ],
    timeline: [
      {
        id: 1,
        title: 'Campaign Launch',
        date: 'Feb 1, 2025',
        status: 'completed',
        description: 'Spring wellness campaign launched'
      },
      {
        id: 2,
        title: 'Content Creation Phase',
        date: 'Feb 15, 2025',
        status: 'in_progress',
        description: 'Influencers creating wellness content'
      },
      {
        id: 3,
        title: 'Mid-Campaign Review',
        date: 'Mar 15, 2025',
        status: 'pending',
        description: 'Performance review and adjustments'
      },
      {
        id: 4,
        title: 'Spring Peak',
        date: 'Apr 1, 2025',
        status: 'pending',
        description: 'Peak spring content push'
      },
      {
        id: 5,
        title: 'Campaign Completion',
        date: 'Apr 30, 2025',
        status: 'pending',
        description: 'Campaign ends and final reports generated'
      }
    ],
    collaborationStatus: {
      total: 18,
      active: 12,
      pending: 5,
      completed: 1
    }
  },
  {
    id: 4,
    campaignName: 'Tech Product Launch Q1',
    name: 'Tech Product Launch Q1',
    lifecycleStage: 'planning',
    status: 'planning',
    goalType: 'conversions',
    totalBudget: 95000,
    currency: '$',
    budget: '$95,000',
    spent: '$0',
    remaining: '$95,000',
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    createdAt: '2025-01-28',
    collaboratorsCount: 0,
    influencers: 0,
    pendingRequests: 8,
    kpisCount: 5,
    reach: '0',
    engagement: '0%',
    progress: 15,
    description: 'New tech product launch campaign targeting early adopters and tech enthusiasts.',
    metrics: {
      reach: '0',
      impressions: '0',
      engagement: '0%',
      clicks: '0',
      conversions: '0',
      revenue: '$0'
    },
    influencerList: [],
    timeline: [
      {
        id: 1,
        title: 'Campaign Planning',
        date: 'Feb 1, 2025',
        status: 'in_progress',
        description: 'Finalizing campaign strategy and influencer outreach'
      },
      {
        id: 2,
        title: 'Influencer Onboarding',
        date: 'Feb 15, 2025',
        status: 'pending',
        description: 'Onboarding selected influencers'
      },
      {
        id: 3,
        title: 'Campaign Launch',
        date: 'Mar 1, 2025',
        status: 'pending',
        description: 'Official campaign launch'
      }
    ],
    collaborationStatus: {
      total: 0,
      active: 0,
      pending: 8,
      completed: 0
    }
  },
  {
    id: 5,
    campaignName: 'Back to School 2024',
    name: 'Back to School 2024',
    lifecycleStage: 'completed',
    status: 'completed',
    goalType: 'traffic',
    totalBudget: 72000,
    currency: '$',
    budget: '$72,000',
    spent: '$72,000',
    remaining: '$0',
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    createdAt: '2024-07-15',
    collaboratorsCount: 28,
    influencers: 28,
    pendingRequests: 0,
    kpisCount: 6,
    reach: '5.5M',
    engagement: '7.2%',
    progress: 100,
    description: 'Back to school campaign targeting students and parents with education-focused content.',
    metrics: {
      reach: '5.5M',
      impressions: '15.8M',
      engagement: '7.2%',
      clicks: '198K',
      conversions: '4,320',
      revenue: '$285,000'
    },
    influencerList: [],
    timeline: [],
    collaborationStatus: {
      total: 28,
      active: 0,
      pending: 0,
      completed: 28
    }
  },
  {
    id: 6,
    campaignName: 'Fitness Challenge 2025',
    name: 'Fitness Challenge 2025',
    lifecycleStage: 'paused',
    status: 'paused',
    goalType: 'engagement',
    totalBudget: 45000,
    currency: '$',
    budget: '$45,000',
    spent: '$18,500',
    remaining: '$26,500',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    createdAt: '2024-12-20',
    collaboratorsCount: 15,
    influencers: 15,
    pendingRequests: 1,
    kpisCount: 4,
    reach: '1.8M',
    engagement: '6.5%',
    progress: 41,
    description: 'New Year fitness challenge campaign promoting healthy lifestyle and fitness products.',
    metrics: {
      reach: '1.8M',
      impressions: '4.2M',
      engagement: '6.5%',
      clicks: '52K',
      conversions: '980',
      revenue: '$62,000'
    },
    influencerList: [],
    timeline: [],
    collaborationStatus: {
      total: 15,
      active: 10,
      pending: 1,
      completed: 4
    }
  },
  {
    id: 7,
    campaignName: 'Sustainable Living Series',
    name: 'Sustainable Living Series',
    lifecycleStage: 'planning',
    status: 'planning',
    goalType: 'brand_awareness',
    totalBudget: 38000,
    currency: '$',
    budget: '$38,000',
    spent: '$0',
    remaining: '$38,000',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    createdAt: '2025-01-30',
    collaboratorsCount: 0,
    influencers: 0,
    pendingRequests: 12,
    kpisCount: 3,
    reach: '0',
    engagement: '0%',
    progress: 8,
    description: 'Educational campaign about sustainable living practices and eco-friendly products.',
    metrics: {
      reach: '0',
      impressions: '0',
      engagement: '0%',
      clicks: '0',
      conversions: '0',
      revenue: '$0'
    },
    influencerList: [],
    timeline: [],
    collaborationStatus: {
      total: 0,
      active: 0,
      pending: 12,
      completed: 0
    }
  },
  {
    id: 8,
    campaignName: 'Q4 Beauty Trends',
    name: 'Q4 Beauty Trends',
    lifecycleStage: 'completed',
    status: 'completed',
    goalType: 'sales',
    totalBudget: 110000,
    currency: '$',
    budget: '$110,000',
    spent: '$110,000',
    remaining: '$0',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    createdAt: '2024-09-15',
    collaboratorsCount: 42,
    influencers: 42,
    pendingRequests: 0,
    kpisCount: 7,
    reach: '9.2M',
    engagement: '9.8%',
    progress: 100,
    description: 'Q4 beauty trends campaign featuring makeup tutorials and product reviews.',
    metrics: {
      reach: '9.2M',
      impressions: '24.5M',
      engagement: '9.8%',
      clicks: '385K',
      conversions: '7,850',
      revenue: '$485,000'
    },
    influencerList: [],
    timeline: [],
    collaborationStatus: {
      total: 42,
      active: 0,
      pending: 0,
      completed: 42
    }
  }
];

// Helper function to get campaign by ID
export const getCampaignById = (id) => {
  return campaigns.find(campaign => campaign.id === parseInt(id));
};

