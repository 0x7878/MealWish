import React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { HassContext } from './HassContext';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import MenuAppBar from './layout/menu-app-bar';
import MealCard from './components/meal-card';

import Container from '@mui/material/Container';
import { Card, CardContent, Typography } from '@mui/material';

function App() {
  const [user, setUser] = React.useState<any>({ name: "loading..."});
  const eventEmitter = React.useContext(HassContext);

  React.useEffect(() => {
    const handleUserChanged = (hass: any) => {
      if (user.name != hass.user.name) {
        setUser(hass.user);
      }
    }

    eventEmitter.on('hassChanged', handleUserChanged);

    return () => {
      eventEmitter.off('hassChanged', handleUserChanged);
    };
  }, [user]);

  return (
    <>
      <MenuAppBar />
      <Box style={{ overflow: 'auto', height: 'calc(100vh - 57px)', marginTop: "56px" }} sx={{ bgcolor: 'background.paper', }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    content of hass.user
                  </Typography>
                  <Typography variant="body2">
                    {user ? user.name : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <MealCard />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;
