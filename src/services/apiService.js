import axios from 'axios';

const API_BASE_URL = 'http://10.178.20.124:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const getSiteData = async (siteName) => {
  try {
    const response = await api.get(`/sites/${siteName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching site data:', error);
    throw error;
  }
};

export const getDeviceDetails = async (siteName) => {
  try {
    const response = await api.get(`/devices/${siteName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device details:', error);
    throw error;
  }
};

export const getSiteLogs = async (siteName) => {
  try {
    const response = await api.get(`/logs/${siteName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching site logs:', error);
    throw error;
  }
};

export const getSiteAlerts = async (siteName) => {
  try {
    const response = await api.get(`/alerts/${siteName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching site alerts:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response?.data || error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error);
    throw error;
  }
};