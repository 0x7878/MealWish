import React from "react"
import { HassContext } from "../HassContext";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import MenuAppBar from "../layout/menu-app-bar";
import MealCard from "../components/meal-card";

import Container from "@mui/material/Container";
import api_url from "../config";
import {Fab, Snackbar, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from "react-router-dom";


function Home() {

  const navigate = useNavigate();

  const [meals, setMeals] = React.useState<any[]>([]);
  const {eventEmitter, hass} = React.useContext(HassContext);
  const initialName = hass?.user.name || "loading...";
  const [user, setUser] = React.useState<any>({ name: initialName });

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    showAction?: boolean;
    data?: any;
  }>({ open: false, showAction:true, message: "" });


  const location = useLocation();
  const loc_cw = location?.state?.cw;
  const loc_year = location?.state?.year;

  const today = new Date() as any;
  const currentWeek = loc_cw || today.getWeek();
  const year = loc_year || today.getFullYear();

  const [cwDate, setCwDate] = React.useState<{
    cw: number;
    year: number;
  }>({ cw: currentWeek, year: year });

  //get all data from plan for current week
  React.useEffect(() => {
    async function fetchData() {
      if (!cwDate) return;
      const endpoint =
        api_url +
        "meals_in_plan?_expand=meal&_expand=plan&plan.year=" +
        // "meals_in_plan?_embed=meal&_embed=plan&plan.year=" + //alpha query
        cwDate.year +
        "&plan.cw=" +
        cwDate.cw;
        try {
          const data = await fetch(endpoint).then((response) => response.json());
          // since the filter is not working on the backend, we need to filter the data here
          setMeals(data.filter((entry: any) => entry.plan.year === cwDate.year && entry.plan.cw === cwDate.cw));
          // setMeals(data);
        }
        catch (e) {
          //todo show dialog / modal or something
          console.log(e);
        }
    }
    fetchData();
  }, [cwDate]);

  /**
   * Update user when it changes in the context
   */
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

 const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({ ...snackbar, open: false });
  };

  const removeMeal = (entry: any)  => {
    setMeals(meals.filter((meal) => meal.id !== entry.id));
    setSnackbar({ ...snackbar, message: entry.meal.name + " removed", open: true });
  };


  return (
    <>
      <MenuAppBar currentWeek={currentWeek} year={year} cwDateChanged={cwDateChanged} />
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
                      discription={entry.meal.description}
                      image={entry.meal.image_url}
                      meal_id={entry.meal.id}
                      id={entry.id}
                      state={{ cw: cwDate.cw, year: cwDate.year }}
                      removeMeal={() => removeMeal(entry)}
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
             <Typography variant="h3" component="div" sx={{ flexGrow: 1, color: "grey", textAlign: "center"}}>
                No meals found for this week
              </Typography> 
              </Grid>
            </Grid>
            )}
          </Grid>
        </Container>
      <Fab color="secondary" aria-label="edit" sx={{position: 'absolute',  bottom: 16,  right: 16,}}
      onClick={() => {navigate("meal-list", {state: {"cw": cwDate.cw, "year": cwDate.year}})}}>
        <AddIcon />
      </Fab>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />
    </>
  );
}

export default Home;
