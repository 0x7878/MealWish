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
  const { pointer } = props;

  const oldstate = React.useRef<any>({ narrow: undefined, hass: undefined });

  const [narrow, setNarrow] = useState<boolean>(true);
  const [hass, setHass] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const observeChanges = () => {
      // observe narrow
      if (oldstate.current.narrow !== pointer?.narrow) {
        oldstate.current.narrow = pointer.narrow;
        setNarrow(pointer.narrow);
      }
      if (oldstate.current.hass !== pointer?.hass) {
        oldstate.current.hass = pointer?.hass;
        setHass(pointer.hass);
        setUser(pointer.hass.user);
      }
    };

    const intervalId = setInterval(observeChanges, 1000); // Adjust the interval as needed

    return () => clearInterval(intervalId); // Cleanup when the component unmounts
  }, []);

  return (
    <>
      <MenuAppBar narrow={narrow} hass={hass} />
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
                    {user ? user.name : "loading..."}
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
