import React, { useEffect, useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  SwipeableDrawer,
  Drawer,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../state/api/authApi";
import iziToast from "izitoast";
import { authReset } from "../../state/slice/authSlice";
import { useGetCartQuery } from "../../state/api/cartApi";
import { throttle } from "lodash";
import { useGetStoreDataQuery } from "../../state/api/storeApi";
import {
  useDeleteNotificationsMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../../state/api/notificationApi";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [cartItemCount, setCartItemCount] = useState(0);

  const { data: cart } = useGetCartQuery();
  const { data: store } = useGetStoreDataQuery();
  const {
    data: notifications,
    refetch: refetchNotifications,
    isLoading: isLoadingNotifications,
  } = useGetNotificationsQuery();

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();

  const { user, isLogout, message } = useSelector((state) => state.auth);

  const throttledUpdateCartCount = useMemo(
    () =>
      throttle((count) => {
        setCartItemCount(count);
      }, 300),
    []
  );

  const userMenu = [
    { menu: "Profile", link: "/profile" },
    { menu: "Order", link: "/order" },
  ];

  const adminMenu = [
    { menu: "Setting", link: "/admin-settings" },
    { menu: "Dashboard", link: "/admin-dashboard" },
  ];

  const [open, setOpen] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);

  const menuOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const menuClose = () => {
    setOpen(null);
  };

  const toCart = () => navigate("/cart");
  const toHome = () => navigate("/");
  const toLoginPage = () => navigate("/login");

  const toPage = (link) => {
    navigate(link);
    menuClose();
  };

  const logout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("login");
  };

  useEffect(() => {
    if (isLogout) {
      iziToast.success({
        title: "Success",
        message: message,
        position: "topRight",
        timeout: 3000,
      });

      localStorage.removeItem("login");
      localStorage.removeItem("cart");
      dispatch(authReset());
      navigate("/");
    }
  }, [isLogout, message, dispatch, navigate]);

  useEffect(() => {
    if (cart && cart.services) {
      const totalQuantity = cart.services.reduce(
        (total, service) => total + service.qty,
        0
      );
      throttledUpdateCartCount(totalQuantity);
    }
  }, [cart, throttledUpdateCartCount]);

  const handleNotificationClick = () => {
    setOpenNotification(true);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    refetchNotifications();
  };

  const handleDeleteNotifications = async (id) => {
    await deleteNotifications(id);
    refetchNotifications();
  };

  const notificationCount = notifications?.filter((n) => !n.isRead).length || 0;

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    try {
      const date = new Date(dateString);

      // Fungsi untuk menambahkan nol di depan angka jika kurang dari 10
      const padZero = (num) => num.toString().padStart(2, "0");

      const year = date.getUTCFullYear();
      const month = padZero(date.getUTCMonth() + 1); // getUTCMonth() mengembalikan 0-11
      const day = padZero(date.getUTCDate());
      const hours = padZero(date.getUTCHours());
      const minutes = padZero(date.getUTCMinutes());

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const notificationModal = (
    <>
      {isMobile ? (
        <Drawer
          anchor="top"
          open={openNotification}
          onClose={handleCloseNotification}
          onOpen={() => setOpenNotification(true)}
          PaperProps={{
            sx: {
              height: "50%",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" component="h2">
                Notifications
              </Typography>
              <IconButton onClick={handleCloseNotification} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            {isLoadingNotifications ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                  flex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            ) : notifications && notifications.length > 0 ? (
              <List sx={{ flex: 1, overflow: "auto" }}>
                {notifications.map((notification) => (
                  <React.Fragment key={notification._id}>
                    <ListItem
                      sx={{
                        bgcolor: notification.isRead
                          ? "transparent"
                          : "action.hover",
                        borderRadius: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.type}
                            </Typography>
                            {" — "}
                            {formatDate(notification.createdAt)}
                          </>
                        }
                      />
                      <Box sx={{ mt: 1, alignSelf: "flex-end" }}>
                        {!notification.isRead && (
                          <Button
                            onClick={() => handleMarkAsRead(notification._id)}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          onClick={() =>
                            handleDeleteNotifications(notification._id)
                          }
                          color="error"
                          size="small"
                        >
                          Delete
                        </Button>
                      </Box>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>
                No notifications
              </Typography>
            )}
          </Box>
        </Drawer>
      ) : (
        <Modal
          open={openNotification}
          onClose={handleCloseNotification}
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openNotification}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                outline: "none",
                overflow: "auto",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" component="h2">
                  Notifications
                </Typography>
                <IconButton onClick={handleCloseNotification} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              {isLoadingNotifications ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress />
                </Box>
              ) : notifications && notifications.length > 0 ? (
                <List>
                  {notifications.map((notification) => (
                    <React.Fragment key={notification._id}>
                      <ListItem
                        sx={{
                          bgcolor: notification.isRead
                            ? "transparent"
                            : "action.hover",
                          borderRadius: 1,
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <ListItemText
                          primary={notification.message}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {notification.type}
                              </Typography>
                              {" — "}
                              {formatDate(notification.createdAt)}
                            </>
                          }
                        />
                        <Box sx={{ mt: 1, alignSelf: "flex-end" }}>
                          {!notification.isRead && (
                            <Button
                              onClick={() => handleMarkAsRead(notification._id)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            onClick={() =>
                              handleDeleteNotifications(notification._id)
                            }
                            color="error"
                            size="small"
                          >
                            Delete
                          </Button>
                        </Box>
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" textAlign="center">
                  No notifications
                </Typography>
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{ cursor: "pointer", alignItems: "center" }}
            onClick={toHome}
          >
            <img
              src={store?.logo}
              alt="logo"
              style={{
                height: isMobile ? "40px" : "60px",
                width: isMobile ? "80px" : "120px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: isMobile ? 0.5 : 1 }}>
            {user ? (
              <>
                <IconButton color="inherit" onClick={handleNotificationClick}>
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                {user.role === "user" && (
                  <IconButton color="inherit" onClick={toCart}>
                    <Badge badgeContent={cartItemCount} color="error">
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                  </IconButton>
                )}
                <IconButton
                  color="inherit"
                  onClick={menuOpen}
                  sx={{ padding: 0 }}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name || "User Avatar"}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "1rem",
                    }}
                  >
                    {!user.avatar &&
                      (user.name ? user.name[0].toUpperCase() : "U")}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={open}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(open)}
                  onClose={menuClose}
                >
                  {(user.role === "user" ? userMenu : adminMenu).map(
                    (item, index) => (
                      <MenuItem key={index} onClick={() => toPage(item.link)}>
                        {item.menu}
                      </MenuItem>
                    )
                  )}
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton color="inherit" onClick={toLoginPage}>
                <LoginIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
        {notificationModal}
      </AppBar>
      <Toolbar /> {/* This empty Toolbar acts as a spacer */}
    </Box>
  );
};

export default Navbar;
