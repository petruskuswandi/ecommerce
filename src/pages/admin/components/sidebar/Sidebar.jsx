import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ListMenu from "./ListMenu";
import LogoutIcon from "@mui/icons-material/Logout";
import { blue } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authReset } from "../../../../state/slice/authSlice";
import { useEffect } from "react";
import { logoutUser } from "../../../../state/api/authApi";
import iziToast from "izitoast";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLogout, message } = useSelector((state) => state.auth);

  const toHome = () => navigate("/");

  const logout = () => dispatch(logoutUser());

  useEffect(() => {
    if (isLogout) {
      iziToast.success({
        title: "Success",
        message: message,
        position: "topRight",
        timeout: 3000,
      });

      localStorage.removeItem("login");

      dispatch(authReset());
      toHome();
    }
  }, [isLogout, message]);
  return (
    <Box sx={{ width: 200, p: 1 }}>
      <List>
        {ListMenu.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label}></ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem onClick={() => logout()}>
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon sx={{ color: blue[800] }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default Sidebar;
