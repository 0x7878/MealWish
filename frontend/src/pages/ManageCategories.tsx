import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import DefaultAppBar from "../layout/default-app-bar";
import Card from "@mui/material/Card";
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api_url from "../config";
import {
  DeliveryDining,
  DinnerDining,
  EmojiFoodBeverage,
  Fastfood,
  KebabDining,
  LocalPizza,
  Restaurant,
  SaveOutlined,
  SetMeal,
  SoupKitchen,
} from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FoodBankIcon from "@mui/icons-material/FoodBank";

import NoFoodIcon from "@mui/icons-material/NoFood";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import IcecreamIcon from "@mui/icons-material/Icecream";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import BentoIcon from "@mui/icons-material/Bento";
import CakeIcon from "@mui/icons-material/Cake";
import EggIcon from "@mui/icons-material/Egg";
import EggAltIcon from "@mui/icons-material/EggAlt";
import NoMealsIcon from "@mui/icons-material/NoMeals";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SetMealIcon from "@mui/icons-material/SetMeal";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import TapasIcon from "@mui/icons-material/Tapas";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import BrunchDiningIcon from "@mui/icons-material/BrunchDining";
import LiquorIcon from "@mui/icons-material/Liquor";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import NoDrinksIcon from "@mui/icons-material/NoDrinks";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import LunchDiningIcon from "@mui/icons-material/LunchDining";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const toolbarHeight = 55;

type Section = {
  id?: string;
  name: string;
  icon: string;
};

const ManageCategories = () => {
  const [categories, setCategories] = useState<Section[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [open, setOpen] = useState(false);

  const [nameTouched, setNameTouched] = React.useState(false);

  useEffect(() => {
    // Fetch categories aka Section
    const fetchCategories = async () => {
      const response = await fetch(api_url + "sections");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) {
      setNameTouched(true);
      return;
    }

    const category: Section = {
      name: name,
      icon: icon ? icon : "Restaurant",
    };
    if (id) {
      category.id = id;
    }

    if(id) {
      // Update category
    
      const updateCategory = async () => {
        const response = await fetch(api_url + "sections/" + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        });
        const data = await response.json();
        if (data.id) {
          //clear form
          setName("");
          setIcon("");
          setId("");
  
          //add new category to list
          const newCategories: Section[] = categories.map((category) => {
            if(category.id === id) {
              return data;
            }
            return category;
          });
          setCategories(newCategories);
  
          // Success
          // setOpen(true);
        }
      };
      updateCategory();
      return;
    }
    // Save category
    const saveCategory = async () => {
      const response = await fetch(api_url + "sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
      const data = await response.json();
      if (data.id) {
        //clear form
        setName("");
        setIcon("");
        setId("");

        //add new category to list
        setCategories([...categories, data]);

        // Success
        // setOpen(true);
      }
    };
    saveCategory();
  };

  const handleDelete = () => {
    const endpoint = api_url + "sections/" + id;
    fetch(endpoint, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
      // remove from list
      const newCategories: Section[] = categories.filter((category) => category.id !== id);
      setCategories(newCategories);
      // Success
      setOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const getIconComponent = (name: string) => {
    switch (name) {
      case "meat":
        return <KebabDining />;
      case "fastfood":
        return <Fastfood />;
      case "noodles":
        return <DinnerDining />;
      case "delivery":
        return <DeliveryDining />;
      case "fish":
        return <SetMeal />;
      case "soup":
        return <SoupKitchen />;
      case "pizza":
        return <LocalPizza />;
      case "FoodBeverage":
        return <EmojiFoodBeverage />;
      case "FoodBank":
        return <FoodBankIcon />;
      case "NoFood":
        return <NoFoodIcon />;
      case "DinnerDiningIcon":
        return <DinnerDiningIcon />;
      case "IcecreamIcon":
        return <IcecreamIcon />;
      case "KitchenIcon":
        return <KitchenIcon />;
      case "LocalDiningIcon":
        return <LocalDiningIcon />;
      case "MenuBookIcon":
        return <MenuBookIcon />;
      case "RiceBowlIcon":
        return <RiceBowlIcon />;
      case "BentoIcon":
        return <BentoIcon />;
      case "CakeIcon":
        return <CakeIcon />;
      case "EggIcon":
        return <EggIcon />;
      case "EggAltIcon":
        return <EggAltIcon />;
      case "NoMealsIcon":
        return <NoMealsIcon />;
      case "RestaurantIcon":
        return <RestaurantIcon />;
      case "RestaurantMenuIco":
        return <RestaurantMenuIcon />;
      case "SetMealIcon":
        return <SetMealIcon />;
      case "SoupKitchenIcon":
        return <SoupKitchenIcon />;
      case "TakeoutDiningIcon":
        return <TakeoutDiningIcon />;
      case "TapasIcon":
        return <TapasIcon />;
      case "BreakfastDiningIc":
        return <BreakfastDiningIcon />;
      case "BrunchDiningIcon ":
        return <BrunchDiningIcon />;
      case "LiquorIcon":
        return <LiquorIcon />;
      case "LocalBarIcon":
        return <LocalBarIcon />;
      case "LocalCafeIcon":
        return <LocalCafeIcon />;
      case "LocalPharmacyIcon":
        return <LocalPharmacyIcon />;
      case "NightlifeIcon":
        return <NightlifeIcon />;
      case "NoDrinksIcon":
        return <NoDrinksIcon />;
      case "RamenDiningIcon":
        return <RamenDiningIcon />;
      case "BakeryDiningIcon":
        return <BakeryDiningIcon />;
      case "LocalPizzaIcon":
        return <LocalPizzaIcon />;
      case "LunchDining":
        return <LunchDiningIcon />;
      default:
        return <Restaurant />;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const title = "Manage Categories";

  return (
    <>
      <DefaultAppBar title={title} />
      <Box
        style={{
          overflow: "auto",
          height: "calc(100vh - 56px)",
          marginTop: toolbarHeight + 1,
        }}
        sx={{ bgcolor: "background.paper" }}
      >
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Card>
            <CardHeader title={title} />
            <CardContent>
              <form onSubmit={handleSave}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Here you see a list of all categories. You can add new
                      categories or delete existing ones. If you want to edit a
                      category, just click on the item.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <List sx={{ width: "100%" }}>
                      {categories.map((category: Section) => (
                        <ListItem
                          onClick={() => {
                            setName(category.name);
                            setIcon(category.icon);
                            setId(category.id as string);
                          }}
                          key={category.id}
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete"
                            onClick={() => {
                              setId(category.id as string);
                              handleClickOpen();
                            }}>
                              <DeleteForeverIcon />
                            </IconButton>
                          }
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              {getIconComponent(category.icon)}
                            </ListItemIcon>
                            <ListItemText primary={category.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Add new category
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Name *"
                      variant="outlined"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      error={nameTouched && !name}
                      helperText={
                        nameTouched && !name ? "This field is required" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="category-select">Icon</InputLabel>
                      <Select
                        labelId="category-select"
                        id="category-select"
                        value={icon}
                        label="Icon"
                        onChange={(event) => {
                          setIcon(event.target.value as string);
                        }}
                      >
                        <MenuItem value="NoFood">
                          <NoFoodIcon /> No Food
                        </MenuItem>
                        <MenuItem value="DinnerDiningIcon">
                          <DinnerDiningIcon /> Dinner
                        </MenuItem>
                        <MenuItem value="IcecreamIcon">
                          <IcecreamIcon /> Icecream
                        </MenuItem>
                        <MenuItem value="KitchenIcon">
                          <KitchenIcon /> Kitchen
                        </MenuItem>
                        <MenuItem value="LocalDiningIcon">
                          <LocalDiningIcon /> Dining
                        </MenuItem>
                        <MenuItem value="MenuBookIcon">
                          <MenuBookIcon /> Book
                        </MenuItem>
                        <MenuItem value="RiceBowlIcon">
                          <RiceBowlIcon /> Rice
                        </MenuItem>
                        <MenuItem value="BentoIcon">
                          <BentoIcon /> Bento
                        </MenuItem>
                        <MenuItem value="CakeIcon">
                          <CakeIcon /> Cake
                        </MenuItem>
                        <MenuItem value="EggIcon">
                          <EggIcon /> Egg
                        </MenuItem>
                        <MenuItem value="EggAltIcon">
                          <EggAltIcon /> Egg Alt
                        </MenuItem>
                        <MenuItem value="NoMealsIcon">
                          <NoMealsIcon /> No Meals
                        </MenuItem>
                        <MenuItem value="RestaurantIcon">
                          <RestaurantIcon /> Restaurant
                        </MenuItem>
                        <MenuItem value="RestaurantMenuIcon">
                          <RestaurantMenuIcon /> Menu
                        </MenuItem>
                        <MenuItem value="SetMealIcon">
                          <SetMealIcon /> Set Meal
                        </MenuItem>
                        <MenuItem value="SoupKitchenIcon">
                          <SoupKitchenIcon /> Soup
                        </MenuItem>
                        <MenuItem value="TakeoutDiningIcon">
                          <TakeoutDiningIcon /> Takeout
                        </MenuItem>
                        <MenuItem value="TapasIcon">
                          <TapasIcon /> Tapas
                        </MenuItem>
                        <MenuItem value="BreakfastDiningIc">
                          <BreakfastDiningIcon /> Breakfast
                        </MenuItem>
                        <MenuItem value="BrunchDiningIcon ">
                          <BrunchDiningIcon /> Brunch
                        </MenuItem>
                        <MenuItem value="LiquorIcon">
                          <LiquorIcon /> Liquor
                        </MenuItem>
                        <MenuItem value="LocalBarIcon">
                          <LocalBarIcon /> Bar
                        </MenuItem>
                        <MenuItem value="LocalCafeIcon">
                          <LocalCafeIcon /> Cafe
                        </MenuItem>
                        <MenuItem value="LocalPharmacyIcon">
                          <LocalPharmacyIcon /> Pharmacy
                        </MenuItem>
                        <MenuItem value="NightlifeIcon">
                          <NightlifeIcon /> Nightlife
                        </MenuItem>
                        <MenuItem value="NoDrinksIcon">
                          <NoDrinksIcon /> No Drinks
                        </MenuItem>
                        <MenuItem value="RamenDiningIcon">
                          <RamenDiningIcon /> Ramen
                        </MenuItem>
                        <MenuItem value="BakeryDiningIcon">
                          <BakeryDiningIcon /> Bakery
                        </MenuItem>
                        <MenuItem value="LocalPizzaIcon">
                          <LocalPizzaIcon /> Pizza
                        </MenuItem>
                        <MenuItem value="LunchDining">
                          <LunchDiningIcon /> Lunch
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      startIcon={<SaveOutlined />}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will try to delete the Category if no meals are linked.
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageCategories;
