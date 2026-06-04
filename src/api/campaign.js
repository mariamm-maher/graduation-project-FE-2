
import api from '../config/axios';

const throwApiError = (error, fallback) => {
  const message = error.response?.data?.message
    || error.response?.data?.error
    || error.message
    || fallback;
  throw new Error(message);
};

const normalizeContentCalendarPlatforms = (payload) => {
  if (!payload || !payload.contentCalendar || !Array.isArray(payload.contentCalendar)) {
    return payload;
  }
  return {
    ...payload,
    contentCalendar: payload.contentCalendar.map(item => ({
      ...item,
      platform: item.platform ? String(item.platform).toLowerCase() : 'instagram'
    }))
  };
};

// Convert camelCase keys to snake_case for API compatibility
const camelToSnakeCase = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnakeCase);
  
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnakeCase(obj[key]);
    return acc;
  }, {});
};

const campaignService = {
  // saveAndPublishCampaign: async (builtPayload) => {
  //   try {
  //     const response = await api.post('/campaigns/save-and-publish', {
  //       ...builtPayload,
  //       isPublished: true,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Save and publish campaign error:', error);
  //     throw error.response?.data?.message || 'Failed to save and publish campaign';
  //   }
  // },

  // saveCampaign: async (builtPayload) => {
  //   try {
  //     const response = await api.post('/campaigns/save', builtPayload);
  //     const response2 = await api.post('/campaigns/', builtPayload);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Save campaign error:', error);
  //     throwApiError(error, 'Failed to save campaign');
  //   }
  // },

  // saveDraftCampaign: async (draftData) => {
  //   try {
  //     const response = await api.post('/campaigns/draft', draftData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Save draft campaign error:', error);
  //     throwApiError(error, 'Failed to save campaign as draft');
  //   }
  // },

  // generateCampaignAI: async (aiData) => {
  //   try {
  //     const response = await api.post('/campaigns/ai/generate', aiData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('AI Generate campaign error:', error);
  //     throwApiError(error, 'Failed to generate campaign with AI');
  //   }
  // },
  saveAndPublishCampaign: async (builtPayload) => {
    try {
    const normalizedPayload = normalizeContentCalendarPlatforms(builtPayload);
    const response = await api.post('/campaigns/save-and-publish', {
    ...normalizedPayload,
    isPublished: true,
    });
    
      return response.data;
    } catch (error) {
      console.error('Save and publish campaign error:', error);
    
      throwApiError(
        error,
        'Failed to save and publish campaign'
      );
    }
    
    },
    
    saveCampaign: async (builtPayload) => {
    try {
    // IMPORTANT:
    // only ONE save request
    // remove duplicate /campaigns/ request
    
      const normalizedPayload = normalizeContentCalendarPlatforms(builtPayload);
      const response = await api.post(
        '/campaigns/save',
        normalizedPayload
      );
    
      return response.data;
    } catch (error) {
      console.error('Save campaign error:', error);
    
      throwApiError(
        error,
        'Failed to save campaign'
      );
    }
    
    },
    
    // NEW
    // Save new AI version for existing campaign
    saveAIVersion: async (
    campaignId,
    aiPayload,
    options = {}
    ) => {
    try {
    const response = await api.post(
    `/campaigns/${campaignId}/ai`,
    {
    ...aiPayload,

          // optional flags
          syncCalendar:
            options.syncCalendar || false,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Save AI version error:', error);

      throwApiError(
        error,
        'Failed to save AI version'
      );
    }

    },
    
    // NEW
    // Update current active AI version
    updateAIVersion: async (
    campaignId,
    aiPayload,
    options = {}
    ) => {
    try {
    const response = await api.put(
    `/campaigns/${campaignId}/ai`,
    {
    ...aiPayload,

          syncCalendar:
            options.syncCalendar || false,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Update AI version error:', error);

      throwApiError(
        error,
        'Failed to update AI version'
      );
    }

    },
    
    saveDraftCampaign: async (draftData) => {
      try {
        // Backend expects { inputs, current_output, version_history }
        const payload = {
          inputs: {
            campaign_name: draftData.campaignName || draftData.campaign_name || 'Untitled Draft',
            goal: draftData.campaign_goal || 'Awareness',
            budget: Number(draftData.budget_amount || draftData.budget || 0),
            duration_weeks: Number(draftData.campaign_duration_weeks || draftData.durationWeeks || 4),
            start_date: draftData.startDate || null,
            end_date: draftData.endDate || null,
          },
          current_output: draftData.aiVersion || draftData.current_output || null,
          version_history: draftData.version_history || null,
        };
        
        console.log('Saving draft with payload:', JSON.stringify(payload, null, 2));
        const response = await api.post('/campaigns/draft', payload);
        return response.data;
      } catch (error) {
        console.error('Save draft campaign error:', error);
        console.error('Full error response:', error.response?.data);
        throwApiError(error, 'Failed to save campaign as draft');
      }
    },

    updateCampaignDraft: async (id, draftData) => {
      try {
        // Backend expects { inputs, current_output, version_history }
        const payload = {
          inputs: draftData.inputs || {
            campaign_name: 'Untitled Draft',
            goal: 'Awareness',
            budget: 0,
            duration_weeks: 4,
          },
          current_output: draftData.current_output || draftData.aiVersion || null,
          version_history: draftData.version_history || draftData.versions || null,
        };
        
        console.log('Updating draft with payload:', JSON.stringify(payload, null, 2));
        const response = await api.put(`/campaigns/draft/${id}`, payload);
        return response.data;
      } catch (error) {
        console.error('Update draft campaign error:', error);
        console.error('Full error response:', error.response?.data);
        throwApiError(error, 'Failed to update campaign draft');
      }
    },

    loadCampaignDraft: async (id) => {
      try {
        const response = await api.get(`/campaigns/draft/${id}`);
        return response.data;
      } catch (error) {
        console.error('Load campaign draft error:', error);
        throwApiError(error, 'Failed to load campaign draft');
      }
    },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/campaigns/create', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      throwApiError(error, 'Failed to create campaign');
    }
  },

  getCampaigns: async ({ page = 1, limit = 10, lifecycleStage } = {}) => {
    try {
      const params = { page, limit };
      if (lifecycleStage) params.lifecycleStage = lifecycleStage;
      const response = await api.get('/campaigns', { params });
      return response.data;
    } catch (error) {
      console.error('Campaigns error:', error);
      throwApiError(error, 'Failed to fetch campaigns');
    }
  },

  getActiveCampaigns: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/campaigns/active', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Active campaigns error:', error);
      throwApiError(error, 'Failed to fetch active campaigns');
    }
  },

  getCampaignsOverview: async () => {
    try {
      const response = await api.get('/campaigns/overview');
      return response.data;
    } catch (error) {
      console.error('Campaigns overview error:', error);
      throwApiError(error, 'Failed to fetch campaigns overview');
    }
  },

  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Campaign detail error:', error);
      throwApiError(error, 'Failed to fetch campaign');
    }
  },

  updateCampaign: async (id, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Update campaign error:', error);
      throwApiError(error, 'Failed to update campaign');
    }
  },

  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete campaign error:', error);
      throwApiError(error, 'Failed to delete campaign');
    }
  },

  completeCampaign: async (id) => {
    try {
      const response = await api.post(`/campaigns/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Complete campaign error:', error);
      throwApiError(error, 'Failed to complete campaign');
    }
  },

  getCampaignAnalytics: async (campaignId = null) => {
    try {
      const url = campaignId ? `/campaigns/${campaignId}/analytics` : '/campaigns/analytics';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Campaign analytics error:', error);
      throwApiError(error, 'Failed to fetch campaign analytics');
    }
  },

  getActiveCampaignsWithTracking: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await api.get('/campaigns/active/enhanced', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Enhanced active campaigns error:', error);
      throwApiError(error, 'Failed to fetch enhanced tracking data');
    }
  },

  cancelCampaign: async (id) => {
    try {
      const response = await api.post(`/campaigns/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel campaign error:', error);
      throwApiError(error, 'Failed to cancel campaign');
    }
  },

  updateBrandTone: async (brandTone) => {
    try {
      const response = await api.patch('/profile/brand-tone', { brandTone });
      return response.data;
    } catch (error) {
      console.error('Update brand tone error:', error);
      throwApiError(error, 'Failed to update brand tone');
    }
  },

  generateCampaignReport: async (campaignId) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/report`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign-report-${campaignId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Generate campaign report error:', error);
      throwApiError(error, 'Failed to generate campaign report');
    }
  },

  generateBulkReport: async () => {
    try {
      const response = await api.get('/campaigns/reports/completed', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all-campaigns-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Generate bulk report error:', error);
      throwApiError(error, 'Failed to generate bulk report');
    }
  },

};

export default campaignService;
