import React from "react"

import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MealListAppBar from "../layout/meal-list-app-bar.";

function MealList(props: any) {

  return (
    <>
      <MealListAppBar />
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
