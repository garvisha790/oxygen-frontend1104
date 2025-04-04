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

const drawerWidth = 200;

const PlantDashboard = () => {
  const [plants, setPlants] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/plants");
      setPlants(response.data);
    } catch (err) {
      console.error("Error fetching plants:", err);
    }
  };

  const addPlant = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/plants", {
        plantName,
        location,
        capacity: parseInt(capacity),
        isActive,
      });
      setPlants([...plants, response.data]);
      setPlantName("");
      setLocation("");
      setCapacity("");
      setIsActive(true);
    } catch (err) {
      console.error("Error adding plant:", err);
    }
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
          Plant Dashboard
        </Typography>

        {/* Add Plant Form */}
        <Paper sx={{ padding: "16px", marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Add New Plant
          </Typography>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              label="Plant Name"
              variant="outlined"
              size="small"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
            />
            <TextField
              label="Location"
              variant="outlined"
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              label="Capacity"
              variant="outlined"
              type="number"
              size="small"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
            <Select
              value={isActive}
              size="small"
              onChange={(e) => setIsActive(e.target.value === "true")}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
            <Button variant="contained" color="primary" onClick={addPlant}>
              Add Plant
            </Button>
          </Box>
        </Paper>

        {/* Plant Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Plant Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Capacity</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plants.map((plant, index) => (
                <TableRow key={index}>
                  <TableCell>{plant.plantName}</TableCell>
                  <TableCell>{plant.location}</TableCell>
                  <TableCell>{plant.capacity}</TableCell>
                  <TableCell>{plant.isActive ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PlantDashboard;