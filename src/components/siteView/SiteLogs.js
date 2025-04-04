import React, { useEffect, useState } from 'react';
import { getSiteLogs } from '../../services/apiService';

const SiteLogs = ({ siteName }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getSiteLogs(siteName);
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    };

    fetchLogs();
  }, [siteName]);

  return (
    <div>
      <h3>Logs for {siteName}</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.message} - {log.timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default SiteLogs;
