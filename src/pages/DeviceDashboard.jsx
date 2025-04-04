import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Drawer,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import { getDevices, addDevice, deleteDevice } from "../services/deviceService";

const drawerWidth = 200;

const DeviceDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [macId, setMacId] = useState("");
  const [commissionedDate, setCommissionedDate] = useState("");
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/plants").then((res) => {
      setPlants(res.data);
    });
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await getDevices(selectedPlantId);
      setDevices(response);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    if (selectedPlantId) {
      fetchDevices();
    } else {
      setDevices([]);
    }
  }, [selectedPlantId]);

  const handleAddDevice = async () => {
    if (!selectedPlantId) {
      alert("Please select a plant before adding a device.");
      return;
    }

    try {
      // ✅ Step 1: Register device in Azure IoT Hub
      const azureResponse = await axios.post("http://localhost:5000/api/azure/register-device", {
        deviceId: serialNumber, // Use serial number as unique device ID in Azure IoT Hub
      });

      console.log("Azure IoT Hub Response:", azureResponse.data);

      // ✅ Step 2: Add device to MongoDB after successful Azure registration
      await addDevice({
        deviceName,
        serialNumber,
        macId,
        commissionedDate,
        plantId: selectedPlantId,
      });

      // ✅ Clear form inputs
      setDeviceName("");
      setSerialNumber("");
      setMacId("");
      setCommissionedDate("");

      // ✅ Refresh device list
      fetchDevices();
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device. Please try again.");
    }
  };

  const handleDeleteDevice = async (id) => {
    await deleteDevice(id);
    fetchDevices();
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Fixed Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#0d47a1",
            color: "white",
          },
        }}
      >
        <Sidebar /> {/* ✅ Sidebar Component */}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Device Dashboard
        </Typography>

        {/* Select Plant */}
        <Paper sx={{ padding: "16px", marginBottom: "20px" }}>
          <Typography variant="h6">Select Plant</Typography>
          <Select
            fullWidth
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
          >
            <MenuItem value="">Select Plant</MenuItem>
            {plants.map((plant) => (
              <MenuItem key={plant._id} value={plant._id}>
                {plant.plantName}
              </MenuItem>
            ))}
          </Select>
        </Paper>

        {/* Add Device Form */}
        <Paper sx={{ padding: "16px", marginBottom: "20px" }}>
          <Typography variant="h6">Add New Device</Typography>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              label="Device Name"
              variant="outlined"
              size="small"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
            <TextField
              label="Serial Number"
              variant="outlined"
              size="small"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
            <TextField
              label="MAC ID"
              variant="outlined"
              size="small"
              value={macId}
              onChange={(e) => setMacId(e.target.value)}
            />
            <TextField
              label="Commissioned Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={commissionedDate}
              onChange={(e) => setCommissionedDate(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddDevice}>
              Add Device
            </Button>
          </Box>
        </Paper>

        {/* Device Table */}
        {devices.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Device Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Serial Number</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>MAC ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Commissioned Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device._id}>
                    <TableCell>{device.deviceName}</TableCell>
                    <TableCell>{device.serialNumber}</TableCell>
                    <TableCell>{device.macId}</TableCell>
                    <TableCell>{new Date(device.commissionedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteDevice(device._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {devices.length === 0 && selectedPlantId && (
          <Typography variant="body1" mt={2}>
            No devices added for this plant yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DeviceDashboard;