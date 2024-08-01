import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Footer from "../../components/footer/Footer";
import { loadUser, uploadAvatar } from "../../state/api/authApi";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "../../state/api/userApi";
import iziToast from "izitoast";
import { avatarReset } from "../../state/slice/authSlice";

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { user, isUploadAvatar, isUploadAvatarError, message, error } =
    useSelector((state) => state.auth);

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData((prevState) => ({
        ...prevState,
        name: user.name || "",
        email: user.username || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const avatarHandler = () => {
    document.getElementById("avatarInput").click();
  };

  const avatar = (e) => {
    const file = e.target.files[0];

    if (file) {
      dispatch(uploadAvatar(file));
    }
  };

  useEffect(() => {
    if (isUploadAvatar) {
      iziToast.success({
        title: "Success",
        message: message,
        position: "topRight",
        timeout: 3000,
      });
      dispatch(loadUser());
      dispatch(avatarReset());
    }

    if (isUploadAvatarError) {
      iziToast.error({
        title: "Error",
        message: error,
        position: "topRight",
        timeout: 3000,
      });
    }
  }, [isUploadAvatar, message, isUploadAvatarError, error]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      }).unwrap();
      iziToast.success({
        title: "Success",
        message: "Profile updated successfully!",
        position: "topRight",
      });
    } catch (error) {
      iziToast.error({
        title: "Error",
        message:
          error.message || error.data.error || "failed to update profile",
        position: "topRight",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword({
        oldPassword: profileData.oldPassword,
        newPassword: profileData.newPassword,
      }).unwrap();
      iziToast.success({
        title: "Success",
        message: "Password Berhasil Diubah!",
        position: "topRight",
      });
      setProfileData((prevState) => ({
        ...prevState,
        oldPassword: "",
        newPassword: "",
      }));
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.data.message,
        position: "topRight",
      });
    }
  };

  return (
    <Fragment>
      <Navbar />
      <Container component="main" maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              height: 200,
              position: "relative",
              backgroundImage: `url('background-profile.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Avatar
              src={user?.avatar}
              alt={user?.name || "User Avatar"}
              sx={{
                width: 120,
                height: 120,
                position: "absolute",
                bottom: -60,
                left: "50%",
                transform: "translateX(-50%)",
                border: "4px solid white",
                cursor: "pointer",
              }}
              onClick={avatarHandler}
            />
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={avatar}
            />
          </Box>
          <Box sx={{ mt: 8, p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {user?.name || "User Profile"}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Old Password"
                  type="password"
                  name="oldPassword"
                  value={profileData.oldPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    sx={{
                      flex: isMobile ? 1 : "inherit",
                      mr: isMobile ? 0 : 1,
                    }}
                  >
                    Update Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleChangePassword}
                    sx={{
                      flex: isMobile ? 1 : "inherit",
                      ml: isMobile ? 0 : 1,
                    }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default Profile;
