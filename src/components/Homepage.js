import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Grid } from '@mui/material';
import Login from './Login'; 
import Signup from './Signup'; 

function Homepage() {
  const [value, setValue] = useState(0); // 0 for Login, 1 for Signup

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={8} sx={{ height: '100vh', alignItems: 'center' }}>
        <Grid size={{ xs: 0, md: 1 }}></Grid>
      <Grid size={{ xs: 6, md: 4}}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
          Task Tracker
        </Typography>
      </Grid>
      <Grid size={{ xs: 6, md: 6 }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
          {value === 0 && <Login />}
          {value === 1 && <Signup />}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Homepage;
