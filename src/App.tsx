import React from "react";
import { Routes, Route } from "react-router-dom"
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Home from "./pages/Home";
import MealList from "./pages/MealList";
import AddMeal from "./pages/AddMeal";

function App() {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="meal-list" element={ <MealList/> } />
      <Route path="meal-list/add" element={ <AddMeal/> } />
    </Routes>
  );
}

export default App;
