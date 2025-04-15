import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/Sidebar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlarmNotification from "../components/siteView/alarmNotification";

const drawerWidth = 200;

const statusSummary = [
  { label: "Offline", color: "#d4f1f9", count: 2 },
  { label: "Error", color: "#f7d7da", count: 1 },
  { label: "Warning", color: "#fff4d1", count: 1 },
  { label: "Normal", color: "#d4f9d7", count: 8 },
];

const StatusCard = ({ label, color, count }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "16px",
      textAlign: "center",
      width: "140px",
      backgroundColor: color,
      borderRadius: "16px",
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold">
      {label}
    </Typography>
    <Typography variant="h5" fontWeight="bold">
      {count}
    </Typography>
  </Paper>
);

const MainDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const getSelectedLocation = () => [12.9716, 77.5946];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleClose();
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "black",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: "bold", textAlign: "center" }}
          >
            Oxygen Plant Monitor
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlarmNotification />
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>{user?.email || "User"}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#ffffff",
          p: 3,
          minHeight: "100vh",
          marginTop: "0.5px",
        }}
      >
        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ borderRadius: "16px" }}>
              <div style={{ height: "300px", width: "100%" }}>
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

          {/* Status Summary */}
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              {statusSummary.map((item, index) => (
                <Grid item key={index}>
                  <StatusCard
                    label={item.label}
                    color={item.color}
                    count={item.count}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Logs and Alerts */}
          <Grid item xs={6}>
            <Paper
              elevation={3}
              sx={{
                height: "200px",
                padding: "16px",
                backgroundColor: "#e3f2fd",
                borderRadius: "16px",
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
              sx={{
                height: "200px",
                padding: "16px",
                backgroundColor: "#fce4ec",
                borderRadius: "16px",
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
