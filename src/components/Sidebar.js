import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DevicesIcon from '@mui/icons-material/Devices';
import InsightsIcon from '@mui/icons-material/Insights';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const drawerWidth = 220;

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();          // clear token and user
    navigate('/login'); // redirect to login
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
    { text: 'Plant Dashboard', icon: <AccountTreeIcon />, route: '/plant-dashboard' },
    { text: 'Device Dashboard', icon: <DevicesIcon />, route: '/device-dashboard' },
    { text: 'Telemetry Dashboard', icon: <InsightsIcon />, route: '/telemetry-dashboard' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0d47a1',
          color: 'white',
        },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => navigate(item.route)}>
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: 'white', my: 2 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;