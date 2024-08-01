import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSendResetPasswordEmailMutation } from '../../state/api/userApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sendResetEmail, { isLoading, isSuccess, isError, error }] = useSendResetPasswordEmailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendResetEmail(email).unwrap();
      // Success akan ditangani oleh isSuccess state
    } catch (err) {
      // Error akan ditangani oleh isError dan error state
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : 400,
          maxWidth: "400px",
          borderRadius: "5px",
          boxShadow: 4,
          p: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Lupa Password
        </Typography>
        <Typography mb={3}>
          Masukkan email Anda untuk menerima link reset password.
        </Typography>

        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Link reset password telah dikirim ke email Anda.
          </Alert>
        )}

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Email"
            label="Email"
            name="username"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />

          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
          </Button>
        </form>

        <Button
          onClick={() => navigate('/login')}
          fullWidth
          sx={{ mt: 2 }}
        >
          Kembali ke Login
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;