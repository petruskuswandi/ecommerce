import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useResetPasswordMutation } from '../../state/api/userApi'; // Sesuaikan path import
import { useParams, useNavigate } from 'react-router-dom';

const Reset = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    try {
      await resetPassword({ token, passwordData: { password, confirmPassword } }).unwrap();
      toast.success('Password reset successful');
      navigate('/login'); // Redirect to login page after successful reset
    } catch (err) {
      toast.error(err.data?.error || 'An error occurred while resetting password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Masukan Password Baru
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            * Pastikan password sesuai
          </Typography>
          <TextField
            type="password"
            fullWidth
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            type="password"
            fullWidth
            label="Konfirmasi Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Paper>
      </Box>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </Container>
  );
};

export default Reset;