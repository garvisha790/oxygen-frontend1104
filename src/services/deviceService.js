import axios from 'axios';

const API_URL = 'http://localhost:5000/api/devices';   

export const getDevices = async (plantId) => {
    const response = await axios.get(`http://localhost:5000/api/devices?plantId=${plantId}`);
    return response.data;
  };

export const addDevice = async (deviceData) => {
  const response = await axios.post(API_URL, deviceData);
  return response.data;
};

export const deleteDevice = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};