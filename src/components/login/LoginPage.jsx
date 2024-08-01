import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthStatus,
  googleLogin,
  loginUser,
} from "../../state/api/authApi";
import iziToast from "izitoast";
import { clearError } from "../../state/slice/authSlice";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { isAuth, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const toSignUp = () => navigate("/daftar");

  const handleLogin = () => {
    dispatch(loginUser({ username: email, password }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  useEffect(() => {
    if (isAuth && user) {
      iziToast.success({
        title: "Success",
        message: `Welcome, ${user.name || user.username}!`,
        position: "topRight",
        timeout: 3000,
      });
      navigate("/");
      localStorage.setItem("login", JSON.stringify("login"));

      window.location.reload();

      return;
    } else if (error) {
      iziToast.error({
        title: "Error",
        message: error.message || error,
        position: "topRight",
        timeout: 3000,
      });
      setTimeout(() => dispatch(clearError()), 3000);

      return;
    }
  }, [isAuth, error, user, navigate, dispatch]);

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
    localStorage.setItem("login", JSON.stringify("login"));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.grey[100],
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: isMobile ? "90%" : isTablet ? "70%" : "60%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
          borderRadius: "15px",
        }}
      >
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              bgcolor: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              color: "white",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Welcome Back!
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Login to Your Account
          </Typography>
          <TextField
            placeholder="Email"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Password"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Link
            component="button"
            variant="body2"
            onClick={handleForgotPassword}
            align="right"
            sx={{ mt: 1, display: "block" }}
          >
            Lupa Password?
          </Link>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Login with Google
          </Button>
          <Typography align="center">
            Belum punya akun?{" "}
            <Link component="button" onClick={toSignUp}>
              Daftar
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
