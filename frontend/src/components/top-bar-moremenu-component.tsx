import { IconButton } from "@mui/material";
import * as React from "react";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

export default function TopBarMoreMenuComponent(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

 const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);

  };

  const navigate = useNavigate();

  return (
    <div>
    <IconButton
      size="large"
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
      <MenuItem onClick={() => navigate("/mealwish/manage-categories")}>{t('Manage Categories')}</MenuItem>
    </Menu>
  </div>
  );
}