// Shared campaigns data source
// In production, this would come from an API

export const campaigns = [
  {
    id: 1,
    name: 'Summer Fashion Launch',
    status: 'active',
    description: 'A comprehensive marketing campaign to launch our new summer fashion collection targeting Gen Z and Millennial audiences with a focus on sustainable fashion and modern aesthetics.',
    influencers: 24,
    budget: '$85,000',
    spent: '$62,400',
    remaining: '$22,600',
    reach: '4.2M',
    engagement: '7.8%',
    startDate: 'Jan 15, 2025',
    endDate: 'Mar 15, 2025',
    progress: 73,
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
    name: 'Holiday Collection 2024',
    status: 'active',
    description: 'A festive holiday marketing campaign promoting our exclusive holiday collection with special offers and limited edition items.',
    influencers: 32,
    budget: '$120,000',
    spent: '$98,200',
    remaining: '$21,800',
    reach: '6.8M',
    engagement: '8.5%',
    startDate: 'Nov 1, 2024',
    endDate: 'Jan 31, 2025',
    progress: 82,
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
    name: 'Spring Wellness Campaign',
    status: 'active',
    description: 'A wellness-focused campaign promoting healthy lifestyle products and spring wellness tips through influencer partnerships.',
    influencers: 18,
    budget: '$55,000',
    spent: '$21,300',
    remaining: '$33,700',
    reach: '2.1M',
    engagement: '6.9%',
    startDate: 'Feb 1, 2025',
    endDate: 'Apr 30, 2025',
    progress: 39,
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
  }
];

// Helper function to get campaign by ID
export const getCampaignById = (id) => {
  return campaigns.find(campaign => campaign.id === parseInt(id));
};

