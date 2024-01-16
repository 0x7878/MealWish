import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { HassContext } from "../HassContext";
import { Box } from "@mui/material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ha-menu-button": any;
    }
  }
}

export default function MenuAppBar({currentWeek, year, cwDateChanged}: any) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const ref = React.useRef<any>(null);

 
  const [cwDate, setCwDate] = React.useState<{cw: number, year: number}>({cw: currentWeek, year: year});

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {eventEmitter, hass, narrow} = React.useContext(HassContext);

  // trigger once on load
  React.useEffect(() => {
    if(hass && narrow) {
      ref.current.hass = hass;
      ref.current.narrow = narrow;
    }
    // changeWeek(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const handlehassChanged = (hass: any) => {
      ref.current.hass = hass;
    };

    const handlenarrowChanged = (narrow: any) => {
      ref.current.narrow = narrow;
    };

    eventEmitter.on("hassChanged", handlehassChanged);
    eventEmitter.on("narrowChanged", handlenarrowChanged);

    return () => {
      eventEmitter.off("narrowChanged", handlenarrowChanged);
      eventEmitter.off("hassChanged", handlehassChanged);
    };
  }, [eventEmitter]);


  function changeWeek(arg0: number) {
    if(cwDate.cw + arg0 > 52) {
    setCwDate({cw: 1, year: cwDate.year + 1}); cwDateChanged({cw: 1, year: cwDate.year + 1});
    }
    else if(cwDate.cw + arg0 < 1) {
      setCwDate({cw: 52, year: cwDate.year - 1}); cwDateChanged({cw: 52, year: cwDate.year - 1});
    }
    else
    {
    setCwDate({cw: cwDate.cw + arg0, year: cwDate.year}); cwDateChanged({cw: cwDate.cw + arg0, year: cwDate.year});
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        style={{
          width: "calc(100% - var(--mdc-drawer-width, 0px))",
          background: "#101e24",
          zIndex: 199,
        }}
      >
        <Toolbar style={{ minHeight: "55px" }}>
          <ha-menu-button slot="navigationIcon" ref={ref} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "17.5px", fontWeight: 400 }}
          >
            MealWish
          </Typography>
          <Box sx={{ flexGrow: 1, alignItems: "center",  display: { xs: "flex" } }}>
             <IconButton
              size="large"
              onClick={() => {changeWeek(-1)}}
              color="inherit"
              >            
              <ArrowBackIosIcon />
            </IconButton>
            <Typography
              variant="button"
            >
              KW {String(cwDate.cw).padStart(2, '0')} {cwDate.year}
            </Typography>
             <IconButton
              size="large"
              onClick={() => {changeWeek(+1)}}
              color="inherit"
              >
                <ArrowForwardIosIcon />
              </IconButton>
          </Box>
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
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
        <Divider />
      </AppBar>
    </>
  );
}
