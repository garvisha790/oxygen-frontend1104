import React, { useEffect, useState } from 'react';
import { getSiteAlerts } from '../../services/apiService';

const SiteAlerts = ({ siteName }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getSiteAlerts(siteName);
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlerts();
  }, [siteName]);

  return (
    <div>
      <h3>Alerts for {siteName}</h3>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert.message} - {alert.severity}</li>
        ))}
      </ul>
    </div>
  );
};

export default SiteAlerts;
