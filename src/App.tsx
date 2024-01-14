import React from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Home from "./pages/Home";
import MealList from "./pages/MealList";

function App() {
  const [page, setPage] = React.useState<string>("home");

  const handlePageChange = (page: string) => {
    console.log("page changed to " + page);
    setPage(page);
  }
  
  return (
    <>
    {page === "home" && <Home pageChanged={handlePageChange} />}
    {page === "mealList" && <MealList pageChanged={handlePageChange} />}
    </>
  );
}

export default App;
