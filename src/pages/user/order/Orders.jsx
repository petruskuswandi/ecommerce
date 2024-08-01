import React, { useState } from "react";
import { Box, Container, Paper, Typography, useTheme, useMediaQuery, TextField } from "@mui/material";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import ListOrders from "./ListOrders";

const Orders = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      backgroundColor: theme.palette.background.default
    }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 3, md: 4 } }}>
        <Paper elevation={3} sx={{
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[6],
          },
        }}>
          <Box sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: 300, sm: 400, md: 500 },
          }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              mb: 3,
            }}>
              Pesanan Kamu
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari pesanan..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 3 }}
            />
            <ListOrders searchTerm={searchTerm} />
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Orders;