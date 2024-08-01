import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../state/api/authApi";
import iziToast from "izitoast";
import { useChangePasswordMutation } from "../../../state/api/userApi";

const SettingAdmin = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const {
    user,
    message,
  } = useSelector((state) => state.auth);

  const [changePassword, { isLoading, isSuccess, isError, error }] =
    useChangePasswordMutation();

  const updateHandler = async (e) => {
    e.preventDefault();

    const data = { username, oldPassword, newPassword };

    await changePassword(data);
  };

  useEffect(() => {
    if (user) {
      setUsername(user?.username);
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: "Password updated successfully",
        position: "topRight",
        timeout: 3000,
      });
      dispatch(logoutUser());
    }

    if (isError) {
      iziToast.error({
        title: "Error",
        message: error?.data?.message || "An error occurred",
        position: "topRight",
        timeout: 3000,
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Update Administrator
        </Typography>
        <Box
          component="form"
          onSubmit={updateHandler}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SettingAdmin;
