import {
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  AppBar,
} from "@mui/material";
import { signInWithPopup, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth, provider } from "../firebaseConfig";

const settings = ["Logout"];

const MyAppBar = ({ user }: any) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    signOut(auth);
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        ></IconButton>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Note
        </Typography>

        {!user ? (
          <Button
            color="inherit"
            onClick={() => signInWithPopup(auth, provider)}
          >
            Login
          </Button>
        ) : (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={user.photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
