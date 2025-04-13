//alarmstab
 
import React, { useState } from 'react';

import {

  Box,

  Typography,

  Paper,

  Table,

  TableBody,

  TableCell,

  TableContainer,

  TableHead,

  TableRow,

  TablePagination,

  Chip,

  IconButton,

  Tooltip,

  CircularProgress

} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import WarningIcon from '@mui/icons-material/Warning';

import { useAlarms } from '../../context/alarmContext';

import { markAlarmAsRead } from '../../services/alarmService';
 
const AlarmsTab = () => {

  const { alarms, loading, refreshData } = useAlarms();

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
 
  const handleChangePage = (event, newPage) => {

    setPage(newPage);

  };
 
  const handleChangeRowsPerPage = (event) => {

    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);

  };
  
  const handleMarkAsRead = async (alarmId) => {

    try {

      await markAlarmAsRead(alarmId);

      refreshData();

    } catch (error) {

      console.error('Error marking alarm as read:', error);

    }

  };
 
  if (loading) {

    return (
<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
<CircularProgress />
</Box>

    );

  }
 
  return (
<Box sx={{ mt: 2 }}>
<Typography variant="h6" gutterBottom>

        Alarm History
</Typography>
<Paper elevation={2}>
<TableContainer>
<Table>
<TableHead>
<TableRow>
<TableCell>Status</TableCell>
<TableCell>Device</TableCell>
<TableCell>Alarm Code</TableCell>
<TableCell>Description</TableCell>
<TableCell>Time</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>

              {alarms

                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                .map((alarm) => (
<TableRow key={alarm._id} hover sx={{ 

                    backgroundColor: alarm.IsRead ? 'inherit' : 'rgba(144, 202, 249, 0.1)' 

                  }}>
<TableCell>
<Chip 

                        icon={<WarningIcon />} 

                        label={alarm.IsActive ? "Active" : "Resolved"} 

                        color={alarm.IsActive ? "error" : "success"} 

                        size="small" 

                      />
</TableCell>
<TableCell>{alarm.DeviceName}</TableCell>
<TableCell>{alarm.AlarmCode}</TableCell>
<TableCell>{alarm.AlarmDescription}</TableCell>
<TableCell>

                      {new Date(alarm.CreatedTimestamp).toLocaleString()}
</TableCell>
<TableCell>

                      {!alarm.IsRead && (
<Tooltip title="Mark as read">
<IconButton 

                            size="small" 

                            onClick={() => handleMarkAsRead(alarm._id)}
>
<CheckCircleIcon fontSize="small" />
</IconButton>
</Tooltip>

                      )}
</TableCell>
</TableRow>

                ))}
</TableBody>
</Table>
</TableContainer>
<TablePagination

          rowsPerPageOptions={[5, 10, 25]}

          component="div"

          count={alarms.length}

          rowsPerPage={rowsPerPage}

          page={page}

          onPageChange={handleChangePage}

          onRowsPerPageChange={handleChangeRowsPerPage}

        />
</Paper>
</Box>

  );

};
 
export default AlarmsTab;
 