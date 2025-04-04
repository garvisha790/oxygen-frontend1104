import React, { useEffect, useState } from 'react';
import { getDeviceDetails } from '../../services/apiService';

const DeviceDetails = ({ siteName }) => {
  const [deviceData, setDeviceData] = useState([]);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const data = await getDeviceDetails(siteName);
        setDeviceData(data);
      } catch (error) {
        console.error('Failed to fetch device data:', error);
      }
    };

    fetchDeviceData();
  }, [siteName]);

  return (
    <div>
      <h3>Device Details for {siteName}</h3>
      <ul>
        {deviceData.map((device) => (
          <li key={device.id}>{device.name} - {device.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceDetails;
