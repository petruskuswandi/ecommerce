import AdminBar from "../components/navbar/AdminBar";
import { Box, Container, Paper, TextField, Typography } from "@mui/material";
import UsersTable from "./UsersTable";
import Footer from "../../../components/footer/Footer";
import { useState } from "react";

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminBar />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Daftar Pelanggan
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
          <UsersTable searchTerm={searchTerm} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default UserPage;
