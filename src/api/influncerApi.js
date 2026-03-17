import api from '../config/axios';

const influncerService = {
	getOverview: async (params = {}) => {
		try {
			const query = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					query.set(key, value);
				}
			});

			const endpoint = query.toString()
				? `/influencer/overview?${query.toString()}`
				: '/influencer/overview';

			const response = await api.get(endpoint);
			return response.data;
		} catch (error) {
			throw error.response?.data?.message || 'Failed to fetch influencer overview';
		}
	},

	getExploreCampaigns: async (params = {}) => {
		try {
			const query = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					query.set(key, value);
				}
			});

			const endpoint = query.toString()
				? `/influencer/campaigns/explore?${query.toString()}`
				: '/influencer/campaigns/explore';

			const response = await api.get(endpoint);
			return response.data;
		} catch (error) {
			throw error.response?.data?.message || 'Failed to fetch discover campaigns';
		}
	},

	getCampaignById: async (id) => {
		try {
			const response = await api.get(`/influencer/campaigns/${id}`);
			return response.data;
		} catch (error) {
			throw error.response?.data?.message || 'Failed to fetch campaign details';
		}
	},

	applyToCampaign: async (id, payload = {}) => {
		try {
			const response = await api.post(`/influencer/campaigns/${id}/apply`, payload);
			return response.data;
		} catch (error) {
			throw error.response?.data?.message || 'Failed to apply to campaign';
		}
	},
};

export default influncerService;
