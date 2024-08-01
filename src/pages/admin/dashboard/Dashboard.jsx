import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Data from "./Data";
import Transactions from "./Transactions";
import Chart from "./Chart";
import Protect from "../Protect";
import AdminBar from "../components/navbar/AdminBar";
import { useGetUsersQuery } from "../../../state/api/userApi";
import { useGetServicesQuery } from "../../../state/api/serviceApi";
import { useGetAllOrdersQuery } from "../../../state/api/orderApi";
import Footer from "../../../components/footer/Footer";
import { useGetAllVouchersQuery } from "../../../state/api/voucherApi";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: userError,
  } = useGetUsersQuery();

  const {
    data: servicesData,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: serviceError,
  } = useGetServicesQuery();

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: orderError,
  } = useGetAllOrdersQuery();

  const {
    data: voucherData,
    isLoading: isLoadingVouchers,
    isError: isErrorVouchers,
    error: voucherError,
  } = useGetAllVouchersQuery();

  if (isLoadingUsers || isLoadingServices || isLoadingOrders || isLoadingVouchers) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorUsers || isErrorServices || isErrorOrders || isErrorVouchers) {
    return (
      <Alert severity="error">
        {userError?.message || serviceError?.message || orderError?.message || voucherError?.message}
      </Alert>
    );
  }

  return (
    <Protect>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <AdminBar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Box container spacing={3}>
            <Grid container>
              <Data
                orders={ordersData?.orders || []}
                products={servicesData || []}
                users={usersData || []}
                vouchers ={voucherData || []}
              />
            </Grid>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Transactions orders={ordersData?.orders || []} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Chart orders={ordersData?.orders || []} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Box>
    </Protect>
  );
};

export default Dashboard;
