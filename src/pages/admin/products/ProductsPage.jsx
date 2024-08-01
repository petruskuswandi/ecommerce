import { Box, IconButton, Input, Tooltip } from "@mui/material";
import AdminBar from "../components/navbar/AdminBar";
import Products from "./Products";
import Footer from "../../../components/footer/Footer";

const ProductsPage = () => {
  return (
    <Box sx={{ height: "100vh" }}>
      <AdminBar />

      {/* produk */}
      <Box sx={{ p: 2 }}>
        <Products />
      </Box>

      <Footer />
    </Box>
  );
};

export default ProductsPage;
