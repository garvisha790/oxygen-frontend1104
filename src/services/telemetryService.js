import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.timeout = 10000;
axios.defaults.retry = 2;
axios.defaults.retryDelay = 1000;

// Create axios instance with retry logic
const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retryCount = config.retryCount || 0;
  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }

  config.retryCount += 1;
  const delay = config.retryDelay || 1000;
  console.log(`Retrying request (${config.retryCount}/${config.retry})...`);

  return new Promise(resolve => setTimeout(() => resolve(axiosInstance(config)), delay));
});

// Caching system
let telemetryCache = {
  historical: {},
  realtime: {},
  latest: {},
  deviceList: null
};

let lastFetch = {
  historical: {},
  realtime: {},
  latest: {},
  deviceList: 0
};

// Cache expiration times
const CACHE_TIMES = {
  historical: 10000, // 10 seconds
  realtime: 2000, // 2 seconds
  latest: 1000, // 1 second
  deviceList: 30000 // 30 seconds
};

/**
 * Fetch historical telemetry data (last 20 entries) for a device
 */
export const getTelemetryData = async (deviceId) => {
  try {
    const now = Date.now();
    
    if (!telemetryCache.historical[deviceId] || now - lastFetch.historical[deviceId] > CACHE_TIMES.historical) {
      console.log('📊 Fetching fresh historical telemetry data...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/${deviceId}`);
      telemetryCache.historical[deviceId] = response.data || [];
      lastFetch.historical[deviceId] = now;
    } else {
      console.log('📊 Using cached historical telemetry data...');
    }

    return telemetryCache.historical[deviceId];
  } catch (error) {
    console.error("❌ Error fetching historical telemetry data:", error);
    return [];
  }
};

/**
 * Fetch real-time telemetry data (last 10 minutes)
 */
export const getRealtimeTelemetryData = async (deviceId) => {
  try {
    const now = Date.now();

    if (!telemetryCache.realtime[deviceId] || now - lastFetch.realtime[deviceId] > CACHE_TIMES.realtime) {
      console.log('⚡ Fetching fresh real-time telemetry data...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/realtime/${deviceId}`);
      telemetryCache.realtime[deviceId] = response.data || [];
      lastFetch.realtime[deviceId] = now;
    } else {
      console.log('⚡ Using cached real-time telemetry data...');
    }

    return telemetryCache.realtime[deviceId];
  } catch (error) {
    console.error("❌ Error fetching real-time telemetry data:", error);
    return [];
  }
};

/**
 * Fetch the latest telemetry entry for a device
 */
export const getLatestTelemetryEntry = async (deviceId) => {
  try {
    const now = Date.now();

    if (!telemetryCache.latest[deviceId] || now - lastFetch.latest[deviceId] > CACHE_TIMES.latest) {
      console.log('🔄 Fetching fresh latest telemetry entry...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/latest/${deviceId}`);
      telemetryCache.latest[deviceId] = response.data || null;
      lastFetch.latest[deviceId] = now;
    } else {
      console.log('🔄 Using cached latest telemetry entry...');
    }

    return telemetryCache.latest[deviceId];
  } catch (error) {
    console.error("❌ Error fetching latest telemetry entry:", error);
    return null;
  }
};

/**
 * Fetch all unique device names
 */
export const getDeviceList = async () => {
  try {
    const now = Date.now();

    if (!telemetryCache.deviceList || now - lastFetch.deviceList > CACHE_TIMES.deviceList) {
      console.log('📋 Fetching unique device names...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/devices`);
      telemetryCache.deviceList = response.data || [];
      lastFetch.deviceList = now;
    } else {
      console.log('📋 Using cached device list...');
    }

    return telemetryCache.deviceList;
  } catch (error) {
    console.error("❌ Error fetching device list:", error);
    return [];
  }
};
export const getThresholdValue = async (deviceId, type) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/telemetry/threshold/${deviceId}/${type}`);
    return response.data?.threshold;
  } catch (error) {
    console.error("❌ Error fetching threshold value:", error);
    return null;
  }
};

export const updateThresholdValue = async (deviceId, type, value) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/telemetry/threshold/${deviceId}/${type}`, {
      threshold: value,
    });
    return response.status === 200;
  } catch (error) {
    console.error("❌ Error updating threshold value:", error);
    return false;
  }
};

export const updateThreshold = async (deviceId, data) => {
  const response = await axios.post(`/api/telemetry/threshold/${deviceId}`, data);
  return response.data;
};
/**
 * Clear cache for a specific device
 */
export const clearDeviceCache = (deviceId) => {
  if (deviceId) {
    delete telemetryCache.historical[deviceId];
    delete telemetryCache.realtime[deviceId];
    delete telemetryCache.latest[deviceId];
    console.log(`🧹 Cleared cache for device ${deviceId}`);
  } else {
    telemetryCache = { historical: {}, realtime: {}, latest: {}, deviceList: null };
    console.log('🧹 Cleared all telemetry cache');
  }
};
