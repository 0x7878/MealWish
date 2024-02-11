import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { blue, pink, red } from '@mui/material/colors';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';
import placeholder from '../other/base64_placeholder';
import { useNavigate } from "react-router-dom";
import api_url from "../config";
import { t } from 'i18next';

export default function MealCard(props: any) {

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const removeItemFromMealsInPlan = async (id: number) => {
      const endpoint = api_url + "meals_in_plan/" + id;
      await fetch(endpoint, {
        method: "DELETE",
      });
      // props.setSnackbar({ message: props.meal +" removed", open: true });
      props.removeMeal();      
  }

   const prevOpen = React.useRef(open);
   
   React.useEffect(() => {
     if (prevOpen.current === true && open === false) {
       anchorRef.current!.focus();
     }
     prevOpen.current = open;
   }, [open]);
 
  const { user, meal, image, discription} = props;
  const username = user ? user[0] ? user[0].toUpperCase() : "?" : "?";
  const avatarColor = username==="M" ? red[500] : username==="N" ? pink[500] : blue[500];
  const imageUrl = image ? image : placeholder;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: avatarColor }} aria-label="recipe">
          {username}
          </Avatar>
        }
        action={
          <IconButton aria-label="more"
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}>
            <MoreVertIcon />
          </IconButton>
        }
        title={meal}
      />
       <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="left-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                  >
                    <MenuItem onClick={() => removeItemFromMealsInPlan(props.id)}>{t('Remove from day')}</MenuItem>
                    <MenuItem onClick={() => navigate("meal-list/edit/" + props.meal_id, {state: props.state})}>{t('Edit')}</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      <CardMedia
        component="img"
        height="194"
        image={imageUrl}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
            {discription.split("\n").map((i: string, key: number) => {
              return <div style={{ minHeight: '1rem' }} key={key}>{i}</div>;
            }
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
