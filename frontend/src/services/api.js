import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// API Services
export const lapanganService = {
  // Get all lapangan
  getAll: async () => {
    try {
      const response = await api.get('/lapangans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single lapangan
  getById: async (id) => {
    try {
      const response = await api.get(`/lapangans/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const bookingService = {
  // Get jadwal for specific lapangan and date
  getJadwal: async (lapanganId, tanggal) => {
    try {
      const response = await api.get('/jadwal', {
        params: {
          lapangan_id: lapanganId,
          tanggal: tanggal,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new booking
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bookings
  getAll: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel booking
  cancel: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
