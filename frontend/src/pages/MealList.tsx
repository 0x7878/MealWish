import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { HassContext } from "../HassContext";
import MealListAppBar from "../layout/meal-list-app-bar";
import api_url from "../config";
import placeholder from "../other/base64_placeholder";

//#region Material Components
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  SwipeableDrawer,
  Toolbar,
} from "@mui/material";
//#endregion

//#region Material Icons
import {
  DeliveryDining,
  DinnerDining,
  Fastfood,
  KebabDining,
  LocalPizza,
  Restaurant,
  SetMeal,
  SoupKitchen,
} from "@mui/icons-material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
//#endregion

const drawerWidth = 250;
const toolbarHeight = 55;

type Category = {
  id: number;
  name: string;
  icon: string;
};

type Meal = {
  id: number;
  name: string;
  image_url: string;
  sectionId: number;
  section?: Category;
};

type Wish = {
  id: number;
  mealId: number;
  added_by: string;
  meal: Meal;
};

type Plan = {
  id?: string;
  year: number;
  cw: number;
};

function MealList() {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [wishes, setWishes] = React.useState<Wish[]>([]);
  const [meals, setMeals] = React.useState<Meal[]>([]);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    showAction?: boolean;
    data?: any;
  }>({ open: false, showAction:true, message: t('Added to the list')});

  const {eventEmitter, hass} = React.useContext(HassContext);
  
  const listRef = React.useRef<HTMLUListElement>(null);
  const planId = React.useRef<string>("");

  // @todo: get user from hass correctly (Hass is not filled in the context here)
  const userRef = React.useRef<string>(  hass?.user.name || "unknown" );

  const location = useLocation();

  const cw = location?.state?.cw || 0;
  const year = location?.state?.year || 0;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const endpoint = api_url + "sections";
        const data = await fetch(endpoint).then((response) => response.json());
        setCategories(data);
      };
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const endpoint = api_url + "wishes?_embed=meal";
        const data = await fetch(endpoint).then((response) => response.json());
        setWishes(data);
      };
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const endpoint = api_url + "meals?_embed=section";
        const data = await fetch(endpoint).then((response) => response.json());
        setMeals(data);
      };
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  React.useEffect(() => {
    const handleUserChanged = (hass: any) => {
      if (userRef.current !== hass.user.name) {
        console.log("user changed");
        console.log(hass.user.name);
        userRef.current = hass.user.name;
      }
    };

    eventEmitter.on("hassChanged", handleUserChanged);

    return () => {
      eventEmitter.off("hassChanged", handleUserChanged);
    };
  }, [eventEmitter]);

  const getOrCreatePlan = async () => {
    //check if current cw is in plan
    const endpoint = api_url + "plans?year="+year + "&cw=" + cw;
    if (cw === 0 || year === 0) {
      console.log("no cw or year");
      return;
    }
    const data = await fetch(endpoint).then((response) => response.json());
    if (data.length === 0) {
      console.log("no plan found");
     //Create a new plan
      var plan: Plan = {
        year: year,
        cw: cw,
      };
      const endpoint = api_url + "plans";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      });
      const data = await response.json();
      planId.current = data.id;
    }else {
      planId.current = data[0].id;
    }
  };

  const addToList = async (meal_id: number) => {
    var user = userRef.current;
    await getOrCreatePlan();
    //check if meal is already in plan
    const endpoint = api_url + "meals_in_plan?planId="+planId.current + "&mealId=" + meal_id;
    // console.log(endpoint);
    const data = await fetch(endpoint).then((response) => response.json());
    if (data.length === 0) {
      // console.log("no meal found");
     //Create a new plan
      var mealInPlan = {
        planId: planId.current,
        mealId: meal_id,
        added_by: user
      };
      const endpoint = api_url + "meals_in_plan";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealInPlan),
      });
       const data = await response.json();
       const mealName = meals.find((meal) => meal.id === data.mealId)?.name;
      setSnackbar({ data: data.id, showAction:true, open: true, message: t("Added meal to the list", { mealName: mealName })});
    }else
    {
      const mealName = meals.find((meal) => meal.id === data[0].mealId)?.name; 
      setSnackbar({ showAction:false, open: true, message: t('is already in plan', {mealName: mealName})});
      // console.log("meal found");
    }
  }

  const deleteMealInList = async () => {
    const endpoint = api_url + "meals_in_plan/" + snackbar.data;
    await fetch(endpoint, {
      method: "DELETE",
    });
    setSnackbar({ ...snackbar, open: false });
  }

  const removeFromWishList = (wishId: number)  => {
    const endpoint = api_url + "wishes/" + wishId;
    fetch(endpoint, {
      method: "DELETE",
    });
    //remove from list
    const newWishes = wishes.filter((wish) => wish.id !== wishId);
    setWishes(newWishes);
    setSnackbar({ ...snackbar, showAction:false, message: t("Removed from the wish list"), open: true });
  }

const addToWishList = async (mealId: number) => {
    var user = userRef.current;
    //check if meal is already in plan
    const endpoint = api_url + "wishes?mealId="+mealId;
    const data = await fetch(endpoint).then((response) => response.json());
    if (data.length === 0) {
      // console.log("no meal found");
      //Create a new plan
      var wish = {
        mealId: mealId,
        added_by: user
      };
      const endpoint = api_url + "wishes";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wish),
      });
       const data = await response.json();
       const mealName = meals.find((meal) => meal.id === data.mealId)?.name;
      setSnackbar({ data: data.id, showAction:false, open: true, message: t('Added meal to the list', {mealName: mealName})});
      //Refresh wishes
      const endpointWishes = api_url + "wishes?_embed=meal";
      const dataWishes = await fetch(endpointWishes).then((response) => response.json());
      setWishes(dataWishes);

    }else
    {
      const mealName = meals.find((meal) => meal.id === data[0].mealId)?.name; 
      setSnackbar({ showAction:false, open: true, message: t('is already in plan', {mealName: mealName}) });
      // console.log("meal found");
    }
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
      default:
        return <Restaurant />;
    }
  };

  const scrollTo = (id: string) => {
    const element = listRef.current?.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const list = () => (
    <Box
      sx={{ width: drawerWidth - 1 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => scrollTo("Wishes")}>
            <ListItemIcon>
              <CardGiftcardIcon />
            </ListItemIcon>
            <ListItemText primary={t("Wishes")} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton onClick={() => scrollTo(category.name)}>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {getIconComponent(category.icon)}
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const action = (
    <React.Fragment>
      <Button color="primary" size="small" onClick={deleteMealInList}>
        {t('undo')}
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <MealListAppBar />
      <SwipeableDrawer
        sx={{ display: { xs: "block", sm: "none" } }}
        anchor={"left"}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            zIndex: 198,
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar style={{ minHeight: toolbarHeight }} />
        <Box sx={{ overflow: "auto" }}>{list()}</Box>
      </Drawer>
      <Box
        style={{
          overflow: "auto",
          height: "calc(100vh - 56px)",
          marginTop: toolbarHeight + 1,
        }}
        sx={{ bgcolor: "background.paper" }}
      >
        <Container
          maxWidth="lg"
          sx={{
            color: "white",
            height: "calc(100% - " + toolbarHeight + "px)",
            marginLeft: { xs: "auto", sm: drawerWidth + "px" },
            width: { xs: "100%", sm: "calc(100vw - " + drawerWidth + "px)" },
          }}
        >
          <List
            ref={listRef}
            style={{
              scrollbarWidth: "thin",
            }}
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: "calc(100vh - 64px)",
              "& ul": { padding: 0 },
            }}
            subheader={<li />}
          >
            {/* list all wishes */}
            <li id="Wishes">
              <ul>
                <ListSubheader>{t('Wishes')}</ListSubheader>
                {wishes.map((wish) => (
                  <ListItem
                  key={wish.id}
                    disablePadding
                    secondaryAction={
                      <>
                      <IconButton
                        color="warning"
                        edge="end"
                        aria-label="Edit meal"
                        onClick={() => navigate("edit/"+wish.meal.id)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        color="error"
                        aria-label="Remove from wishlist"
                        onClick={() => removeFromWishList(wish.id)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                      </>
                    }
                  >
                    <ListItemButton
                      onClick={() => {
                        addToList(wish.meal.id); 
                        removeFromWishList(wish.id);
                      }
                    }
                    >
                      <ListItemAvatar>
                        <Avatar src={wish.meal.image_url || placeholder} />
                      </ListItemAvatar>
                      <ListItemText primary={wish.meal.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </ul>
            </li>
            {/* list all meals sorted by section */}
            {categories.map((category, index) => (
              <li id={category.name} key={category.id + index}>
                <ul>
                  <ListSubheader>{category.name}</ListSubheader>
                  {meals
                    .filter((meal) => meal.sectionId === category.id)
                    .map((meal) => (
                      <ListItem
                        key={meal.id}
                        secondaryAction={
                          <>
                            <IconButton
                              color="warning"
                              edge="end"
                              aria-label="Edit meal"
                              onClick={() => navigate("edit/"+meal.id)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            {wishes.find((wish) => wish.mealId === meal.id) ? (
                              <IconButton
                                edge="end"
                                color="error"
                                aria-label="Already in wishlist"
                                onClick={() => setSnackbar({ showAction:false, open: true, message: t("Already in the wish list") })}
                              >
                                <FavoriteIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                edge="end"
                                color="error"
                                aria-label="Add to wishlist"
                                onClick={() => addToWishList(meal.id)}
                              >
                                <FavoriteBorderOutlinedIcon />
                              </IconButton>
                            )}
                          </>
                        }
                        disablePadding
                      >
                        <ListItemButton
                        onClick={() => addToList(meal.id)}
                        >
                          <ListItemAvatar>
                            <Avatar src={meal.image_url || placeholder} />
                          </ListItemAvatar>
                          <ListItemText primary={meal.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </ul>
              </li>
            ))}
            {/* one empty list item to fill the space */}
            <li key={`empty`} style={{ height: "48px" }}></li>
          </List>
        </Container>
        <Fab
          color="secondary"
          aria-label="edit"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          onClick={() => {navigate("add")}}
        >
          <AddIcon />
        </Fab>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
        {...(snackbar.showAction && {action})}
      />
    </>
  );
}

export default MealList;
