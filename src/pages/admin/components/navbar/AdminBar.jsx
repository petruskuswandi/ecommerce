import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Badge,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Fade,
  List,
  ListItem,
  ListItemText,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../../state/api/authApi";
import { useEffect } from "react";
import { authReset } from "../../../../state/slice/authSlice";
import CloseIcon from "@mui/icons-material/Close";
import {
  useDeleteNotificationsMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../../../../state/api/notificationApi";

const AdminBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: notifications,
    refetch: refetchNotifications,
    isLoading: isLoadingNotifications,
  } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();

  const { user, isLogout, message } = useSelector((state) => state.auth);

  const toHome = () => navigate("/");

  const toSetting = () => navigate("/admin-settings");

  const logout = () => dispatch(logoutUser());

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    if (isLogout) {
      localStorage.removeItem("login");

      dispatch(authReset());
      toHome();
    }
  }, [isLogout, message]);

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
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor={isMobile ? "left" : "left"}
            open={open}
            onClose={toggleDrawer(false)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Box
              sx={{ width: isMobile ? 250 : 250 }} // Ubah ini agar tidak full di mobile
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <Sidebar />
            </Box>
          </Drawer>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            }}
            onClick={handleTitleClick}
          >
            {isMobile ? "Admin" : "Administrator"}{" "}
            {/* Opsi untuk menyingkat judul di mobile */}
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AdminPanelSettingsIcon />
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
            <MenuItem onClick={() => toSetting()}>Setting</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        {notificationModal}
      </AppBar>
      <Toolbar /> {/* This empty Toolbar acts as a spacer */}
    </Box>
  );
};

export default AdminBar;
