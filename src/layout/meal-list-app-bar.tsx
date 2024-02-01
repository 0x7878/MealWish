import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { HassContext } from "../HassContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from "react-router-dom";
import TopBarMoreMenuComponent from "../components/top-bar-moremenu-component";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ha-menu-button": any;
    }
  }
}

export default function MealListAppBar(props: any) {


  const navigate = useNavigate();
  const location = useLocation();


  const cw = location?.state?.cw || 0;
  const year = location?.state?.year || 0;

  const ref = React.useRef<any>(null);



  const {eventEmitter, hass, narrow} = React.useContext(HassContext);

  // trigger once on load
  React.useEffect(() => {
    if(hass && narrow) {
      ref.current.hass = hass;
      ref.current.narrow = narrow;
    }
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
          <IconButton size="large" aria-label="back" color="inherit" onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "17.5px", fontWeight: 400 }}
          >
          Manage Meals (CW {cw} {year})
          </Typography>
          
          <TopBarMoreMenuComponent />

        </Toolbar>
        <Divider />
      </AppBar>
    </>
  );
}
