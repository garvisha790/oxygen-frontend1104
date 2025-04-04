import React, { useEffect, useState, useCallback } from "react";
import { getPlants } from "../services/plantService";
import { getDevices } from "../services/deviceService";
import { 
  getLatestTelemetryEntry, 
  getRealtimeTelemetryData, 
  getTelemetryData,
  clearDeviceCache 
} from "../services/telemetryService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Divider,
  TableContainer,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import { useTheme } from '@mui/material/styles';

// Custom circular progress visualization component that matches the reference UI
const MetricCircle = ({ value, label, color, size = 100, thickness = 5 }) => {
  const theme = useTheme();
  const displayValue = value || 0;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      m: 2
    }}>
      <Box sx={{ 
        position: 'relative', 
        display: 'inline-flex',
        mb: 1
      }}>
        <CircularProgress
          variant="determinate"
          value={75} // Fixed angle for the visual style
          size={size}
          thickness={thickness}
          sx={{ 
            color: color || theme.palette.primary.main,
            transform: 'rotate(135deg)',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" component="div" fontWeight="bold">
            {displayValue}
            {label === 'Temperature' ? '°C' : label === 'Humidity' || label === 'Oil Level' ? '%' : ''}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" component="div">
        {label}
      </Typography>
    </Box>
  );
};

const TelemetryDashboard = () => {
  const theme = useTheme();
  const [plants, setPlants] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("esp32");
  const [telemetryData, setTelemetryData] = useState([]);
  const [latestEntry, setLatestEntry] = useState(null);
  const [realtimeData, setRealtimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("status");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const plantData = await getPlants();
        setPlants(plantData);
        if (plantData.length > 0) {
          setSelectedPlant(plantData[0]._id);
        }
      } catch (error) {
        console.error("❌ Error fetching plants:", error);
        setError("Failed to load plants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []); // Run only once on mount
  
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedPlant) {
        
        return;
      }
     
      try {
        setLoading(true);
        const deviceData = await getDevices(selectedPlant);
        setDevices(deviceData);
        if (deviceData.length > 0) {
          setSelectedDevice(deviceData[0]._id); // Use deviceId
        }
      } catch (error) {
        console.error("❌ Error fetching devices:", error);
        setError("Failed to load devices. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDevices();
  }, [selectedPlant]); // Fetch devices when the plant selection changes
  
  const fetchLatestEntry = useCallback(async () => {
    if (!selectedDevice) {
      
      return;
    }
   
    try {
      const data = await getLatestTelemetryEntry(selectedDevice); // Pass deviceId
      setLatestEntry(data);
    
    } catch (error) {
      console.error("❌ Error fetching latest telemetry:", error);
      
      setError("Failed to fetch latest telemetry data.");
    }
  }, [selectedDevice]);
  
  const fetchRealtimeData = useCallback(async () => {
    if (!selectedDevice) return;

    try {
      const data = await getRealtimeTelemetryData(selectedDevice);
      
        setRealtimeData(data);
    } catch (error) {
      console.error("❌ Error fetching realtime data:", error);
      setRealtimeData([]);
    }
  }, [selectedDevice]);
  
  const fetchHistoricalData = useCallback(async () => {
    if (!selectedDevice) {
      setTelemetryData([]);
      return;
    }
   
    try {
      const data = await getTelemetryData(selectedDevice);
      if (data?.length > 0) {
        const processedData = data.map(entry => ({
          ...entry,
          temperature: entry.temperature?.value || entry.temperature || 0,
          oilLevel: entry.oilLevel?.value || entry.oilLevel || 0,
          timestamp: entry.timestamp
        }));
        
        setTelemetryData(processedData.slice(0, 20));
        setError(null);
      }
    } catch (error) {
      console.error("❌ Error fetching historical data:", error);
      setError("Failed to fetch telemetry data.");
    }
  }, [selectedDevice]);
  
  useEffect(() => {
    if (!selectedDevice) return;

    // Initial data fetch - all at once
    Promise.all([
      fetchLatestEntry(),
      fetchRealtimeData(),
      fetchHistoricalData()
    ]).then(() => {
      setLoading(false);
    });

    // Optimize intervals for better UX:
    // - Faster initial updates
    // - Longer display time for readability
    // - Staggered updates to prevent simultaneous fetches
    const latestInterval = setInterval(fetchLatestEntry, 3000);    // Every 3 seconds
    const realtimeInterval = setInterval(fetchRealtimeData, 5000); // Every 5 seconds
    const historicalInterval = setInterval(fetchHistoricalData, 15000); // Every 15 seconds

    return () => {
      clearInterval(latestInterval);
      clearInterval(realtimeInterval);
      clearInterval(historicalInterval);
    };
  }, [selectedDevice, fetchLatestEntry, fetchRealtimeData, fetchHistoricalData]);
  
  const handlePlantChange = (e) => {
    setSelectedPlant(e.target.value);
    setSelectedDevice("");
    clearDeviceCache();
  };
  
  const debouncedLoading = useCallback((value) => {
    setTimeout(() => setLoading(value), value ? 0 : 300);
  }, []);

  const handleDeviceChange = (e) => {
    const newDeviceId = e.target.value;
    debouncedLoading(true);
    setSelectedDevice(newDeviceId);
    clearDeviceCache(newDeviceId);
    
    // Reset data states when device changes
    setTelemetryData([]);
    setRealtimeData([]);
    setLatestEntry(null);
    setError(null);
  };
  
  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected": return "Connected";
      case "disconnected": return "Disconnected";
      case "error": return "Connection Error";
      case "no data": return "No data available";
      default: return "Unknown";
    }
  };
  
  const renderAlarmsTab = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        {latestEntry ? (
          <Typography variant="h6">
            {typeof latestEntry.openAlerts === 'object' 
              ? latestEntry.openAlerts.value || 0 
              : latestEntry.openAlerts || 0} Open Alerts
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No alerts data available
          </Typography>
        )}
      </Box>
    );
  };

  // Render the command center tab content
  const renderCommandCenterTab = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Command Center functionality coming soon
        </Typography>
      </Box>
    );
  };

  // Render device metrics in the status tab
  const renderDeviceMetrics = () => {
    if (!latestEntry) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No telemetry data available for this device. Please check CosmosDB connection.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If this is a real device and data exists in CosmosDB, check that device IDs match between the frontend and database.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Device Metrics
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          flexWrap: 'wrap',
          mb: 3 
        }}>
          <MetricCircle 
  value={latestEntry?.openAlerts?.value ?? latestEntry?.openAlerts ?? 0}
  label="Open Alerts" 
  color="#f44336"
/>
<MetricCircle 
  value={latestEntry?.temperature?.value ?? latestEntry?.temperature ?? 0}
  label="Temperature" 
  color="#ff9800"
/>
<MetricCircle 
  value={latestEntry?.humidity?.value ?? latestEntry?.humidity ?? 0}
  label="Humidity" 
  color="#2196f3"
/>
<MetricCircle 
  value={latestEntry?.oilLevel?.value ?? latestEntry?.oilLevel ?? 0}
  label="Oil Level" 
  color="#4caf50"
/>

      </Box>
    </Box>
  );
};


  const temperatureChartData = {
    labels: telemetryData?.map(entry => new Date(entry.timestamp).toLocaleTimeString()) || [],
    datasets: [{
      label: 'Temperature',
      data: telemetryData?.map(entry => {
        if (typeof entry.temperature === 'object') {
          return entry.temperature.value || 0;
        }
        return entry.temperature || 0;
      }) || [],
      borderColor: '#ff9800',
      tension: 0.1
    }]
  };
  
  const oilLevelChartData = {
    labels: telemetryData?.map(entry => new Date(entry.timestamp).toLocaleTimeString()) || [],
    datasets: [{
      label: 'Oil Level',
      data: telemetryData?.map(entry => {
        if (typeof entry.oilLevel === 'object') {
          return entry.oilLevel.value || 0;
        }
        return entry.oilLevel || 0;
      }) || [],
      borderColor: '#4caf50',
      tension: 0.1
    }]
  };

  // Update the table rendering section in renderCharts
  const renderCharts = () => {
    if (!selectedDevice || realtimeData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 3, mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No telemetry data available for this device in CosmosDB.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please select a device that has data stored in the CosmosDB container.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1}>Temperature Over Time</Typography>
            <Paper sx={{ p: 2, height: 250 }}>
              <Line data={temperatureChartData} options={chartOptions} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1}>Oil Level Over Time</Typography>
            <Paper sx={{ p: 2, height: 250 }}>
              <Line data={oilLevelChartData} options={chartOptions} />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" mb={1}>Latest Readings</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Temperature (°C)</TableCell>
                  <TableCell>Oil Level (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {telemetryData.length > 0 ? (
                  telemetryData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {typeof item.temperature === 'object' && item.temperature.value !== undefined
                          ? item.temperature.value
                          : typeof item.temperature === 'number'
                          ? item.temperature
                          : '0'}
                      </TableCell>
                      <TableCell>
                        {typeof item.oilLevel === 'object' && item.oilLevel.value !== undefined
                          ? item.oilLevel.value
                          : typeof item.oilLevel === 'number'
                          ? item.oilLevel
                          : '0'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Waiting for real-time data...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Telemetry Dashboard
        </Typography>
        
        {/* Plant and Device Selection */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="plant-select-label">Select Plant</InputLabel>
              <Select
                labelId="plant-select-label"
                value={selectedPlant}
                onChange={handlePlantChange}
                label="Select Plant"
                disabled={loading}
              >
                {plants.map((plant) => (
                  <MenuItem key={plant._id} value={plant._id}>
                    {plant.plantName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPlant || loading}>
              <InputLabel id="device-select-label">Select Device</InputLabel>
              <Select
                labelId="device-select-label"
                value={selectedDevice}
                onChange={handleDeviceChange}
                label="Select Device"
              >
                {devices.map((device) => (
                  <MenuItem key={device._id} value={device._id}>
                    {device.deviceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Tab navigation */}
        {selectedDevice && !loading && (
          <>
            <Box 
              sx={{ 
                display: 'flex',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Button 
                variant={activeTab === "status" ? "contained" : "text"}
                onClick={() => setActiveTab("status")}
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === "status" ? "#fff" : "inherit",
                  backgroundColor: activeTab === "status" ? "#1976d2" : "transparent"
                }}
              >
                Status
                {activeTab === "status" && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {getConnectionStatus()}
                  </Typography>
                )}
              </Button>
              
              <Divider orientation="vertical" flexItem />
              
              <Button 
                variant={activeTab === "alarms" ? "contained" : "text"}
                onClick={() => setActiveTab("alarms")}
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === "alarms" ? "#fff" : "inherit",
                  backgroundColor: activeTab === "alarms" ? "#1976d2" : "transparent"
                }}
              >
                Alarms
                {activeTab === "alarms" && latestEntry && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {latestEntry.openAlerts || 0} Open Alerts
                    console.log("latestEntry:", latestEntry);
console.log("Type of latestEntry.openAlerts:", typeof latestEntry.openAlerts);

                  </Typography>
                )}
              </Button>
              
              <Divider orientation="vertical" flexItem />
              
              <Button 
                variant={activeTab === "cmd" ? "contained" : "text"}
                onClick={() => setActiveTab("cmd")}
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === "cmd" ? "#fff" : "inherit",
                  backgroundColor: activeTab === "cmd" ? "#1976d2" : "transparent"
                }}
              >
                Command Center
              </Button>
            </Box>

            {/* Error message */}
            {error && (
              <Paper 
                sx={{ 
                  p: 2, 
                  mt: 2, 
                  bgcolor: 'error.light', 
                  color: 'error.main',
                  borderRadius: 1
                }}
              >
                <Typography>{error}</Typography>
              </Paper>
            )}
            
            {/* Tab content */}
            <Box sx={{ mt: 3 }}>
              {activeTab === "status" && (
                <>
                  {renderDeviceMetrics()}
                  {renderCharts()}
                </>
              )}
              
              {activeTab === "alarms" && renderAlarmsTab()}
              
              {activeTab === "cmd" && renderCommandCenterTab()}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default TelemetryDashboard;