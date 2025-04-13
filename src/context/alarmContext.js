//alarmcontext
 
import React, { createContext, useState, useContext, useEffect } from 'react';

import { getUnreadAlarmsCount, getAllAlarms } from '../services/alarmService';
 
const AlarmContext = createContext();
 
export const useAlarms = () => useContext(AlarmContext);
 
export const AlarmProvider = ({ children }) => {

  const [unreadCount, setUnreadCount] = useState(0);

  const [alarms, setAlarms] = useState([]);

  const [loading, setLoading] = useState(true);
 
  const fetchUnreadCount = async () => {

    try {

      const count = await getUnreadAlarmsCount();

      setUnreadCount(count);

    } catch (error) {

      console.error('Failed to fetch unread count:', error);

    }

  };
 
  const fetchAlarms = async () => {

    try {

      setLoading(true);

      const data = await getAllAlarms();

      setAlarms(data);

    } catch (error) {

      console.error('Failed to fetch alarms:', error);

    } finally {

      setLoading(false);

    }

  };
 
  // Initially fetch data and set up polling

  useEffect(() => {

    fetchUnreadCount();

    fetchAlarms();
 
    // Poll for new alarms every 30 seconds

    const pollingInterval = setInterval(() => {

      fetchUnreadCount();

      fetchAlarms();

    }, 30000);
 
    return () => clearInterval(pollingInterval);

  }, []);
 
  // Function to refresh data

  const refreshData = () => {

    fetchUnreadCount();

    fetchAlarms();

  };
 
  return (
<AlarmContext.Provider value={{ 

      unreadCount, 

      alarms, 

      loading, 

      refreshData 

    }}>

      {children}
</AlarmContext.Provider>

  );

};
  