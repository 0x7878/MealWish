import React from 'react';
import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import MenuAppBar from './layout/menu-app-bar';
import MealCard from './components/meal-card';


import Container from '@mui/material/Container';

function App() {
  return (
  <>
    <MenuAppBar/>
    <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Grid container spacing={2}>
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
      
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
      <Grid item xs={4}>
          <MealCard/>
      </Grid>
    </Grid>
    </Container>
    </Box>
  </>
  );
}

export default App;
