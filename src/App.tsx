import React, { useEffect, useState } from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import MenuAppBar from './layout/menu-app-bar';
import MealCard from './components/meal-card';

import Container from '@mui/material/Container';
import { Card, CardContent, Typography } from '@mui/material';

function App(props: any) {
  const { wc } = props;
  
  const [user, setUser] = useState<any>(null);

  useEffect(() => { 
    //wait for hass.user to be available try every 100ms and stop after 10s
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if(wc.hass && wc.hass.user) {
        setUser(wc.hass.user);
        clearInterval(interval);
      }
      if (count > 100) {
        setUser({name: "could not get user"});
        clearInterval(interval);
      }
    
    }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
  <>
  {/* <div style={{backgroundColor: "red", height: "100vh", width: "300px", zIndex: 1000, position:'fixed'}}></div> */}
    <MenuAppBar />
    <Box style={{ overflow: 'auto', height: 'calc(100vh - 57px)', marginTop: "56px" }} sx={{ bgcolor: 'background.paper',}}>
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    
    <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
         content of hass.user 
        </Typography>
        <Typography variant="body2">
        {user ? user.name : "loading..."}
        </Typography>
      </CardContent>
    </Card>
      </Grid>
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
      
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={12} md={4}>
          <MealCard/>
      </Grid>
    </Grid>
    </Container>
    </Box>
  </>
  );
}

export default App;
