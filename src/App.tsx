import React from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { HassContext } from "./HassContext";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import MenuAppBar from "./layout/menu-app-bar";
import MealCard from "./components/meal-card";

import Container from "@mui/material/Container";
import api_url from "./config";
import { Typography } from "@mui/material";

function App() {
  const [user, setUser] = React.useState<any>({ name: "loading..." });
  const [meals, setMeals] = React.useState<any[]>([]);
  const eventEmitter = React.useContext(HassContext);

  const [cwDate, setCwDate] = React.useState<{
    cw: number;
    year: number;
  } | null>();

  //get all data from plan for current week
  React.useEffect(() => {
    async function fetchData() {
      if (!cwDate) return;
      const endpoint =
        api_url +
        "meals_in_plan?_embed=meal&_embed=plan&plan.year=" +
        cwDate.year +
        "&plan.cw=" +
        cwDate.cw;
      const data = await fetch(endpoint).then((response) => response.json());
      setMeals(data);
    }
    fetchData();
  }, [cwDate]);

  React.useEffect(() => {
    const handleUserChanged = (hass: any) => {
      if (user.name !== hass.user.name) {
        setUser(hass.user);
      }
    };

    eventEmitter.on("hassChanged", handleUserChanged);

    return () => {
      eventEmitter.off("hassChanged", handleUserChanged);
    };
  }, [eventEmitter, user]);

  const cwDateChanged = (cwDate: { cw: number; year: number }) => {
    setCwDate(cwDate);
  };

  return (
    <>
      <MenuAppBar cwDateChanged={cwDateChanged} />
      <Box
        style={{
          overflow: "auto",
          height: "calc(100vh - 56px)",
          marginTop: "56px",
        }}
        sx={{ bgcolor: "background.paper" }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
            {meals &&
              meals.map((entry: any, index: number) => {
                return (
                  <Grid item xs={12} md={4} key={index}>
                    <MealCard
                      user={entry.added_by}
                      meal={entry.meal.name}
                      image={entry.meal.image_url}
                    />
                  </Grid>
                );
              })}
            {meals.length === 0 && (
              <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '80vh' }}
            >
              <Grid item xs={3}>
             <Typography variant="h3" component="div" sx={{ flexGrow: 1, color: "grey"}}>
                No meals found for this week
              </Typography> 
              </Grid>
            </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;
