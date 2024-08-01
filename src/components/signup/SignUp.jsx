import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import {
  checkAuthStatus,
  googleLogin,
  register,
} from "../../state/api/authApi";
import { useEffect, useState } from "react";
import iziToast from "izitoast";
import { useDispatch } from "react-redux";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Phone,
  Lock,
} from "@mui/icons-material";

const SignUp = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      console.log("Attempting to register");
      const result = await dispatch(register(formData)).unwrap();
      console.log(result);
      if (result.isRegister) {
        iziToast.success({
          title: "Success",
          message: "Registration successful!",
          position: "topRight",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.log(error);
      iziToast.error({
        title: "Error",
        message: error.message || error,
        position: "topRight",
      });
    }
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
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
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              color: "white",
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Welcome!
            </Typography>
            <Typography variant="body1" align="center">
              Join our community and start your journey with us.
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
            Create Your Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Nama Lengkap"
              label="Nama Lengkap"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              placeholder="Email"
              label="Email"
              name="username"
              type="email"
              required
              value={formData.username}
              onChange={handleChange}
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
              fullWidth
              placeholder="Password"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
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
            <TextField
              fullWidth
              placeholder="No. Handphone"
              label="No. Handphone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" color="textSecondary" mt={1} mb={2}>
              *Kami menjaga data Anda. No. Handphone digunakan untuk
              mengkonfirmasi pengiriman barang.
            </Typography>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Daftar
            </Button>
          </form>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            onClick={handleGoogleLogin}
            sx={{ mt: 2, mb: 2 }}
          >
            Daftar dengan Google
          </Button>
          <Typography align="center">
            Sudah punya akun?{" "}
            <Link component="button" onClick={() => navigate("/login")}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;
