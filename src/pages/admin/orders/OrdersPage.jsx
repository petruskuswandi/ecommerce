import React, { useState } from "react";
import { Box, TextField, Typography, Container, Paper } from "@mui/material";
import AdminBar from "../components/navbar/AdminBar";
import OrdersTable from "./OrdersTable";
import Footer from "../../../components/footer/Footer";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AdminBar />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Daftar Pesanan
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Cari Pesanan (ID, Pelanggan, Status)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <OrdersTable searchTerm={searchTerm} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default OrdersPage;
