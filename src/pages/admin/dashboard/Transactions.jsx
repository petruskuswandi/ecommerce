import React, { useState } from "react";
import {
  Paper,
  TablePagination,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Transactions = ({ orders }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    try {
      const date = new Date(dateString);

      // Fungsi untuk menambahkan nol di depan angka jika kurang dari 10
      const padZero = (num) => num.toString().padStart(2, "0");

      const year = date.getUTCFullYear();
      const month = padZero(date.getUTCMonth() + 1); // getUTCMonth() mengembalikan 0-11
      const day = padZero(date.getUTCDate());
      const hours = padZero(date.getUTCHours());
      const minutes = padZero(date.getUTCMinutes());

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const rows = orders.map((order, index) => ({
    id: order._id,
    no: index + 1,
    orderId: order.orderId,
    customer: order.user.name,
    date: formatDate(order.createdAt),
    paymentStatus: order.paymentStatus,
  }));

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Pelanggan</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Status Pembayaran</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.paymentStatus}</TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Transactions;