import React from 'react';
import Sidebar from './siteView/Sidebar'; // adjust path if needed
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '200px', height: '100vh', backgroundColor: '#0d47a1', color: 'white', position: 'fixed' }}>
        <Sidebar />
      </Box>
      <Box sx={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;