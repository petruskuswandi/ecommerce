import React, { useState } from "react";
import AdminBar from "../components/navbar/AdminBar";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import VouchersTable from "./VouchersTable";
import Footer from "../../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

const VouchersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminBar />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Daftar Voucher
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Cari Voucher (Kode, Deskripsi)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin-voucher/tambah")}
            >
              Tambah Voucher Baru
            </Button>
          </Box>
          <VouchersTable searchTerm={searchTerm} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default VouchersPage;
