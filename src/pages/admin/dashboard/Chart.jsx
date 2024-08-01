import { Grid, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ orders }) => {
  // Process orders to get top services and categories
  const serviceCounts = {};
  const categoryCounts = {};

  orders.forEach(order => {
    order.services.forEach(service => {
      const serviceName = service.serviceId.name;
      const serviceCategory = service.serviceId.category;
      const quantity = service.qty;

      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + quantity;
      categoryCounts[serviceCategory] = (categoryCounts[serviceCategory] || 0) + quantity;
    });
  });

  // Convert to array and sort
  const topService = Object.entries(serviceCounts)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const topCategory = Object.entries(categoryCounts)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">5 Service Terlaris</Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topService}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>

      <Grid
        item
        xs={12}
        md={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">5 Kategori Produk Terlaris</Typography>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default Chart;