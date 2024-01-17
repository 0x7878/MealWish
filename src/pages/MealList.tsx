import React, { useEffect } from "react"
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Avatar, Divider, Drawer, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, SwipeableDrawer, Toolbar, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MealListAppBar from "../layout/meal-list-app-bar";

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { DeliveryDining, DinnerDining, Fastfood, Height, KebabDining, LocalPizza, Restaurant,  SetMeal, SoupKitchen } from "@mui/icons-material";
import api_url from "../config";
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CommentIcon from '@mui/icons-material/Comment';
import placeholder from "../other/base64_placeholder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const drawerWidth = 250;
const toolbarHeight = 55;

type Category = {
  id: number;
  name: string;
  icon: string;
}

type Meal = {
  id: number,
  name: string, 
  image_url: string,
  sectionId : number,
  section?: Category
}

type Wish = {
 id: number, 
 mealId: number,
 added_by: string,
 meal: Meal
}

function MealList() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [wishes, setWishes] = React.useState<Wish[]>([]);
  const [meals, setMeals] = React.useState<Meal[]>([]);

  const listRef = React.useRef<HTMLUListElement>(null);

  const toggleDrawer =(open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen( open );
    };

    useEffect(() => {
      try {
        const fetchData = async () => {
         const endpoint = api_url + "sections";
         const data = await fetch(endpoint).then((response) => response.json());
         setCategories(data);
        }
        fetchData();
      }
      catch (e) {
        console.log(e);
      }
    }, []);
  
    useEffect(() => {
      try {
        const fetchData = async () => {
         const endpoint = api_url + "wishes?_embed=meal";
         const data = await fetch(endpoint).then((response) => response.json());
         setWishes(data);
        }
        fetchData();
      }
      catch (e) {
        console.log(e);
      }
    }, []);

    useEffect(() => {
      try {
        const fetchData = async () => {
         const endpoint = api_url + "meals?_embed=section";
         const data = await fetch(endpoint).then((response) => response.json());
         setMeals(data);
        }
        fetchData();
      }
      catch (e) {
        console.log(e);
      }
    }, []);

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
  }

  const scrollTo = (id: string) => {
    const element = listRef.current?.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  const list = () => (
    <Box
      sx={{ width:  (drawerWidth -1) }}
      role="presentation"
      onClick={toggleDrawer( false)}
      onKeyDown={toggleDrawer( false)}
    >
       <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => scrollTo("Wishes")}>
              <ListItemIcon>
                <CardGiftcardIcon /> 
              </ListItemIcon>
              <ListItemText primary={"Wishes"} />
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
            <li id="Wishes" key={`wishes`}>
              <ul>
                <ListSubheader>{`Wishes`}</ListSubheader>
                {wishes.map((wish) => (
                  <ListItemButton key={wish.id} onClick={() => console.log(listRef.current)}>
                    <ListItemAvatar>
                      <Avatar src={wish.meal.image_url || placeholder} />
                    </ListItemAvatar>
                    <ListItemText primary={wish.meal.name} />
                  </ListItemButton>
                ))}
              </ul>
            </li>
            {/* list all meals sorted by section */}
            {categories.map((category) => (
              <li id={category.name} key={category.id}>
                <ul>
                  <ListSubheader>{category.name}</ListSubheader>
                  {meals.filter((meal) => meal.sectionId === category.id).map((meal) => (
                  <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="Add to wishlist">
                      <FavoriteBorderOutlinedIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton>
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
            <li key={`empty`} style={{height: "48px"}}>
              
            </li>
          </List>
        </Container>
        <Fab
          color="secondary"
          aria-label="edit"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
}

export default MealList;