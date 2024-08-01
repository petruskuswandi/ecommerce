import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Container,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AdminBar from "../components/navbar/AdminBar";
import ReportTable from "./ReportTable";
import Footer from "../../../components/footer/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { downloadReport } from "../../utils/reportUtils.js";

const ReportPage = () => {
  const [today] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredOrders, setFilteredOrders] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <Button variant="outlined" onClick={onClick} ref={ref} fullWidth={isMobile}>
      {value}
    </Button>
  ));

  const handleDownload = () => {
    downloadReport(filteredOrders, startDate, endDate);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminBar />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Laporan Penjualan
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between", 
            alignItems: isMobile ? "stretch" : "center",
            gap: 2,
            mb: 3 
          }}>
            <Box sx={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center", 
              gap: 2,
              width: isMobile ? "100%" : "auto"
            }}>
              <Typography>Dari:</Typography>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<CustomDateInput />}
                dateFormat="dd/MM/yyyy"
              />
            </Box>
            <Box sx={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center", 
              gap: 2,
              width: isMobile ? "100%" : "auto"
            }}>
              <Typography>Sampai:</Typography>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                customInput={<CustomDateInput />}
                dateFormat="dd/MM/yyyy"
                maxDate={today}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              fullWidth={isMobile}
            >
              Download
            </Button>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Cari Laporan (ID, Pelanggan, Produk)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <ReportTable
            searchTerm={searchTerm}
            startDate={startDate}
            endDate={endDate}
            setFilteredOrders={setFilteredOrders}
          />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ReportPage;