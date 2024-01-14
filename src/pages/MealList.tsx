import React from "react"
import { HassContext } from "../HassContext";

import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import { Fab, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MealListAppBar from "../layout/meal-list-app-bar.";

function MealList(props: any) {

  const { pageChanged } = props;
  const [user, setUser] = React.useState<any>({ name: "loading..." });
  const eventEmitter = React.useContext(HassContext);

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


  return (
    <>
      <MealListAppBar pageChanged={pageChanged} />
      <Box
        style={{
          overflow: "auto",
          height: "calc(100vh - 56px)",
          marginTop: "56px",
        }}
        sx={{ bgcolor: "background.paper" }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        ...
        </Container>
        <Fab color="secondary" aria-label="edit" sx={{position: 'absolute',  bottom: 16,  right: 16,}}>
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
}

export default MealList;
