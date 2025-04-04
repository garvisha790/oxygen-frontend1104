import React from "react";
import { Box, Typography, Paper, Grid, Drawer } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/Sidebar";  // ✅ Import Sidebar

const drawerWidth = 200;

const MainDashboard = () => {
  const getSelectedLocation = () => {
    return [12.9716, 77.5946];
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
        <Sidebar />  {/* ✅ Use Sidebar component */}
      </Drawer>

      {/* Main content */}
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
          Main Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12}>
            <Paper elevation={3}>
              <div style={{ height: "400px", width: "100%" }}>
                <MapContainer
                  center={getSelectedLocation()}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </div>
            </Paper>
          </Grid>

          {/* Device Status Summary */}
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              {[
                { status: "Offline", color: "#d4f1f9" },
                { status: "Error", color: "#f7d7da" },
                { status: "Warning", color: "#fff4d1" },
                { status: "Normal", color: "#d4f9d7" },
              ].map((item, index) => (
                <Grid item key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "15px",
                      textAlign: "center",
                      width: "120px",
                      backgroundColor: item.color,
                      color: "#000",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography variant="h6">{item.status}</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {Math.floor(Math.random() * 5)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Logs and Alerts */}
          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{
                height: "200px",
                padding: "15px",
                backgroundColor: "#e3f2fd",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                List of Logs (Auto Refresh)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{
                height: "200px",
                padding: "15px",
                backgroundColor: "#fce4ec",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                List of Alerts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainDashboard;