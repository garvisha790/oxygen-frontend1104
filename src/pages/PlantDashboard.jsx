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
  const [editMode, setEditMode] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

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
      clearForm();
    } catch (err) {
      console.error("Error adding plant:", err);
    }
  };

  const clearForm = () => {
    setPlantName("");
    setLocation("");
    setCapacity("");
    setIsActive(true);
    setEditMode(false);
    setSelectedPlant(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await axios.delete(`http://localhost:5000/api/plants/${id}`);
        fetchPlants();
      } catch (err) {
        console.error("Error deleting plant:", err);
      }
    }
  };

  const handleEdit = (plant) => {
    setEditMode(true);
    setSelectedPlant(plant);
    setPlantName(plant.plantName);
    setLocation(plant.location);
    setCapacity(plant.capacity);
    setIsActive(plant.isActive);
  };

  const updatePlant = async () => {
    try {
      await axios.put(`http://localhost:5000/api/plants/${selectedPlant._id}`, {
        plantName,
        location,
        capacity: parseInt(capacity),
        isActive,
      });
      fetchPlants();
      clearForm();
    } catch (err) {
      console.error("Error updating plant:", err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
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
        <Sidebar />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3, minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Plant Dashboard
        </Typography>
        <Paper sx={{ padding: "16px", marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? "Edit Plant" : "Add New Plant"}
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
              onChange={(e) => setIsActive(e.target.value === "true" || e.target.value === true)}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
            {editMode ? (
              <>
                <Button variant="contained" color="secondary" onClick={updatePlant}>
                  Update
                </Button>
                <Button variant="outlined" onClick={clearForm}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={addPlant}>
                Add Plant
              </Button>
            )}
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Plant Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Capacity</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plants.map((plant) => (
                <TableRow key={plant._id}>
                  <TableCell>{plant.plantName}</TableCell>
                  <TableCell>{plant.location}</TableCell>
                  <TableCell>{plant.capacity}</TableCell>
                  <TableCell>{plant.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary" onClick={() => handleEdit(plant)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(plant._id)}>
                      Delete
                    </Button>
                  </TableCell>
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