import { Box } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Products from "../product/Products";
import Hero from "../../components/hero/Hero";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Box sx={{ p: 2 }}>
        <Products />
      </Box>
      <Footer />
    </div>
  );
};

export default Home;
