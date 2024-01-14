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
import api_url from './config';

function App() {
  const [user, setUser] = React.useState<any>({ name: "loading..."});
  const [meals, setMeals] = React.useState<any[]>([]);
  const eventEmitter = React.useContext(HassContext);

 //get all data from plan for current week
 React.useEffect(() => {
  async function fetchData() {
    const today = new Date() as any;
    const currentWeek = today.getWeek();
    const year = today.getFullYear();
    // const endpoint = api_url + "plan?year=" + year + "&cw=" + currentWeek;
    const endpoint = api_url + "meals_in_plan?_embed=meal&_embed=plan&plan.year=" + year + "&plan.cw=" + currentWeek;
    const data = await fetch(endpoint).then(response => response.json());
    setMeals(data);
  }
  fetchData();

 }, []); 

  React.useEffect(() => {
    const handleUserChanged = (hass: any) => {
      if (user.name !== hass.user.name) {
        setUser(hass.user);
      }
    }

    eventEmitter.on('hassChanged', handleUserChanged);

    return () => {
      eventEmitter.off('hassChanged', handleUserChanged);
    };
  }, [eventEmitter, user]);
console.info("render app")
console.dir(meals)
  return (
    <>
      <MenuAppBar />
      <Box style={{ overflow: 'auto', height: 'calc(100vh - 57px)', marginTop: "56px" }} sx={{ bgcolor: 'background.paper', }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
           {meals && meals.map((entry: any, index: number) => {
              return (
                <Grid item xs={12} md={4} key={index}>
                  <MealCard user={entry.added_by} meal={entry.meal.name} image={entry.meal.image_url} />
                </Grid>
              )
            }
           )}  
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;
