import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ha-menu-button': any;
    }
  }
}

export default function MenuAppBar(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { narrow, hass } = props;
  
  const ref = React.useRef<any>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // @todo: replace this by a proper hook / observer
  if(ref.current) {
    ref.current.narrow = narrow;
    ref.current.hass = hass;
  }

  return (
      <><AppBar position="fixed" style={{ width: "calc(100% - var(--mdc-drawer-width, 0px))", background: "#101e24", zIndex:199 }}>
      <Toolbar style={{ minHeight: "55px" }}>
          <ha-menu-button
            slot="navigationIcon" 
            ref={ref}
          />
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: "17.5px", fontWeight: 400 }}>
        MealWish
      </Typography>
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
        </Menu>
      </div>
    </Toolbar><Divider />
      </AppBar></>
  );
}
