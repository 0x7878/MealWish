import React from 'react';
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

function App() {
  return (
  <>
  {/* <div style={{backgroundColor: "red", height: "100vh", width: "300px", zIndex: 1000, position:'fixed'}}></div> */}
    <MenuAppBar />
    <Box style={{ overflow: 'auto', height: 'calc(100vh - 66px)', marginTop: "64px",  width : "calc(100% - var(--mdc-drawer-width, 0px))"}} sx={{ bgcolor: 'background.paper',}}>
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Grid container spacing={2}>
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
