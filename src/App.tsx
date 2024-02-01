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
import ManageCategories from "./pages/ManageCategories";

function App() {
  return (
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="meal-list" element={ <MealList/> } />
      <Route path="meal-list/add" element={ <AddMeal/> } />
      <Route path="meal-list/edit/:id" element={ <AddMeal/> } />
      <Route path="manage-categories" element={ <ManageCategories /> } />
    </Routes>
  );
}

export default App;
