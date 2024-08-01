import { Box, Typography } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Footer from "../../components/footer/Footer";

const Confirm = () => {
  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckCircleIcon color="primary" sx={{ fontSize: 130 }} />
        <Typography>Pesanan Berhasil disimpan</Typography>
      </Box>
      <Footer />
    </Box>
  );
};

export default Confirm;
