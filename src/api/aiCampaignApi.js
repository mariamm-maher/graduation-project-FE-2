import axios from 'axios';

const toTrimmedString = (value) => String(value || '').trim();

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => toTrimmedString(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toCompetitorsArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim();
        return name ? { name, website: '', notes: '' } : null;
      }

      if (!item || typeof item !== 'object') {
        return null;
      }

      return {
        name: toTrimmedString(item.name),
        website: toTrimmedString(item.website),
        notes: toTrimmedString(item.notes),
      };
    })
    .filter((item) => item && (item.name || item.website || item.notes));
};

export const buildAiGeneratePayload = ({ campaignData, ownerProfile }) => {
  const profile = ownerProfile || {};

  return {
    campaignName: toTrimmedString(campaignData?.campaignName || campaignData?.campaign_name),
    brand_name: toTrimmedString(profile.brand_name),
    product_or_service: toTrimmedString(profile.product_or_service),
    industry: toTrimmedString(profile.industry),
    target_market: toArray(profile.target_market),
    company_size: toTrimmedString(profile.company_size),
    campaign_goal: toTrimmedString(campaignData?.campaignGoal),
    budget_amount: Number.parseFloat(campaignData?.budget || 0),
    budget_currency: toTrimmedString(campaignData?.currency),
    campaign_duration_weeks: Number.parseInt(campaignData?.durationWeeks || 0, 10),
    unique_selling_point: toTrimmedString(profile.unique_selling_point),
    current_channels: toArray(profile.current_channels),
    competitors: toCompetitorsArray(profile.competitors),
    has_previous_campaigns: Boolean(profile.has_previous_campaigns),
    previous_campaign_description: profile.has_previous_campaigns
      ? toTrimmedString(profile.previous_campaign_description)
      : '',
    website: toTrimmedString(profile.website),
    platforms: toArray(profile.platforms),
    startDate: toTrimmedString(campaignData?.startDate),
    endDate: toTrimmedString(campaignData?.endDate),
  };
};

const aiCampaignApi = {
  generateCampaignWithProfileContext: async ({ campaignData, ownerProfile }) => {
    const payload = buildAiGeneratePayload({ campaignData, ownerProfile });
    console.log("Sending AI Campaign Payload:", payload);
    const response = await axios.post('http://localhost:5001/api/campaigns/ai/generate', payload);
    console.log("AI Campaign Response from the aiCompagin Api:", response.data.data.aiPreview);
    return {
      payload,
      response: response.data,
    };
  },
  // Send an already-built payload directly to the AI generate endpoint
  generateWithPayload: async (payload) => {
    console.log("Sending AI Campaign Payload (direct):", payload);
    const response = await axios.post('http://localhost:5001/api/campaigns/ai/generate', payload);
    console.log("AI Campaign Response from the aiCompagin Api:", response.data.data.aiPreview);

    return {
      payload,
      response: response.data,
    };
  },
};

export default aiCampaignApi;
