import api from '../config/axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const uploadService = {
	/**
	 * Upload a single image file to the server which will forward to Cloudinary.
	 * @param {File} file - File object from input (field name must be 'file')
	 * @param {string} [type] - optional query param: avatar | brandLogo | campaignAsset
	 * @returns {Promise<object>} response.data from the API
	 */
	uploadImage: async (file, type) => {
		if (!file) {
			throw 'No file provided';
		}

		if (file.size > MAX_FILE_SIZE) {
			throw 'File size exceeds 5MB limit';
		}

		// Some browsers report 'image/jpg' as 'image/jpeg' so both are allowed
		if (!ALLOWED_TYPES.includes(file.type)) {
			// also allow checking by extension as fallback
			const name = (file.name || '').toLowerCase();
			if (!name.endsWith('.png') && !name.endsWith('.jpg') && !name.endsWith('.jpeg') && !name.endsWith('.webp')) {
				throw 'Unsupported file type. Allowed: PNG, JPEG, JPG, WEBP';
			}
		}

		const formData = new FormData();
		formData.append('file', file);

		const query = type ? `?type=${encodeURIComponent(type)}` : '';

		try {
			const response = await api.post(`/upload${query}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			return response;
		} catch (error) {
			// Align with other services in repo: throw message string when possible
			const msg = (error && error.response && error.response.data && (error.response.data.message || error.response.data.error)) || error.message || 'Upload failed';
			console.error('Upload error:', msg, error);
			throw msg;
		}
	}
};

export default uploadService;