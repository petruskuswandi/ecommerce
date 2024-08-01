import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  Box,
  Typography,
} from "@mui/material";
import { useGetAllOrdersQuery } from "../../../state/api/orderApi";
import { formatDate } from "../../utils/reportUtils.js";
import Protect from "../Protect.jsx";

const ReportTable = ({ searchTerm, startDate, endDate, setFilteredOrders }) => {
  const { data: ordersData } = useGetAllOrdersQuery();
  const [localFilteredOrders, setLocalFilteredOrders] = useState([]);

  useEffect(() => {
    if (ordersData && ordersData.orders) {
      const filtered = ordersData.orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const matchesSearch =
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.services.some((service) =>
            service.serviceId.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );

        // Mengubah startDate dan endDate ke awal dan akhir hari
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        const isWithinDateRange =
          orderDate >= startOfDay && orderDate <= endOfDay;

        return matchesSearch && isWithinDateRange;
      });
      setLocalFilteredOrders(filtered);
      setFilteredOrders(filtered);
    }
  }, [ordersData, searchTerm, startDate, endDate, setFilteredOrders]);

  const calculateOrderProfit = (order) => {
    return order.services.reduce((totalProfit, service) => {
      return totalProfit + service.serviceId.profit * service.qty;
    }, 0);
  };

  const totalRevenue = localFilteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const totalProfit = localFilteredOrders.reduce(
    (sum, order) => sum + calculateOrderProfit(order),
    0
  );

  return (
    <Protect>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Pelanggan</TableCell>
                <TableCell>Produk</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Diskon</TableCell>
                <TableCell>Ongkir</TableCell>
                <TableCell>Total Harga</TableCell>
                <TableCell>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localFilteredOrders.map((order, index) => (
                <TableRow key={order._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>
                    {order.services.map((s) => (
                      <div key={s.serviceId._id}>
                        {s.serviceId.name} ({s.serviceId.category})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.services.map((s) => (
                      <div key={s.serviceId._id}>{s.qty}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.services.map((s) => (
                      <div key={s.serviceId._id}>
                        {(s.serviceId.price * s.qty).toFixed(2)}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.discount.toFixed(2)}</TableCell>
                  <TableCell>{order.shippingCost.toFixed(2)}</TableCell>
                  <TableCell>{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {calculateOrderProfit(order).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={11}>
                  <Box sx={{ width: "100%" }}>
                    <Typography>
                      Tanggal: {formatDate(startDate)} - {formatDate(endDate)}
                    </Typography>
                    <Typography>
                      Pendapatan: {totalRevenue.toFixed(2)}
                    </Typography>
                    <Typography>Profit: {totalProfit.toFixed(2)}</Typography>
                    <Typography>
                      Jumlah Transaksi: {localFilteredOrders.length}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Protect>
  );
};

export default ReportTable;
