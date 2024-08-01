import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Popover,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Review from "./Review";
import { useGetMyOrdersQuery } from "../../../state/api/orderApi";
import { useUpdateStatusMutation } from "../../../state/api/paymentApi";

const ListOrders = ({ searchTerm }) => {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  const [openModal, setOpen] = useState(false);
  const [reviewServiceId, setReviewServiceId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, refetch } = useGetMyOrdersQuery();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data?.orders) {
      const filtered = data.orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.paymentStatus
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.deliveryOption.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [data, searchTerm]);

  const updateHandler = (id) => updateStatus(id);

  const reviewHandler = (service) => {
    setReviewServiceId(service.serviceId._id);
    setOpen(true);
  };

  const handleClick = (e, services) => {
    setAnchorEl(e.currentTarget);
    setSelectedServices(services);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: "orderId", label: "Order ID", minWidth: 130 },
    { id: "total", label: "Total", minWidth: 130 },
    { id: "createdAt", label: "Order Date", minWidth: 180 },
    { id: "paymentStatus", label: "Payment Status", minWidth: 150 },
    {
      id: "deliveryInfo",
      label: "Delivery Option & Order Status",
      minWidth: 180,
    },
    { id: "shippingCost", label: "Shipping Cost", minWidth: 130 },
    { id: "actions", label: "Actions", minWidth: 200 },
  ];

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        if (
                          column.id === "total" ||
                          column.id === "shippingCost"
                        ) {
                          return (
                            <TableCell key={column.id}>
                              {`Rp ${parseFloat(row[column.id]).toLocaleString(
                                "id-ID"
                              )}`}
                            </TableCell>
                          );
                        }
                        if (column.id === "createdAt") {
                          return (
                            <TableCell key={column.id}>
                              {formatDate(row[column.id])}
                            </TableCell>
                          );
                        }
                        if (column.id === "deliveryInfo") {
                          return (
                            <TableCell key={column.id}>
                              <Typography>
                                {row.deliveryOption}
                                {row.deliveryOption && row.orderStatus
                                  ? ", "
                                  : ""}
                                {row.orderStatus}
                              </Typography>
                            </TableCell>
                          );
                        }
                        if (column.id === "paymentStatus") {
                          return (
                            <TableCell key={column.id}>
                              <Chip
                                label={row[column.id]}
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                          );
                        }
                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                <Button
                                  startIcon={<SyncIcon />}
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  disabled={
                                    row.paymentStatus === "settlement" ||
                                    row.paymentStatus === "expire" ||
                                    isUpdating
                                  }
                                  onClick={() => updateHandler(row.orderId)}
                                >
                                  {isUpdating ? "..." : "Update"}
                                </Button>
                                <Button
                                  startIcon={<RateReviewIcon />}
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  onClick={() => reviewHandler(row.services[0])}
                                >
                                  Review
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleOpenDetails(row)}
                                >
                                  Details
                                </Button>
                              </Box>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id}>
                            {row[column.id]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Review
        open={openModal}
        close={() => {
          setOpen(false);
          setReviewServiceId(null);
        }}
        serviceId={reviewServiceId}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          {selectedServices.map((service) => (
            <Box key={service._id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {service.serviceId.name}
              </Typography>
              <Typography variant="body2">Quantity: {service.qty}</Typography>
              <Typography variant="body2">
                Price: Rp {service.serviceId.price.toLocaleString("id-ID")}
              </Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Order Details: {selectedOrder?.orderId}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Order Information
              </Typography>
              <Typography>
                Subtotal: Rp {selectedOrder.subtotal?.toLocaleString("id-ID")}
              </Typography>
              <Typography>
                Discount: Rp {selectedOrder.discount?.toLocaleString("id-ID")}
              </Typography>
              <Typography>
                Total: Rp {selectedOrder.total?.toLocaleString("id-ID")}
              </Typography>
              <Typography>
                Payment Method: {selectedOrder.paymentMethod}
              </Typography>
              <Typography>
                Payment Status: {selectedOrder.paymentStatus}
              </Typography>
              <Typography>Order Status: {selectedOrder.orderStatus}</Typography>
              <Typography>
                Delivery Option: {selectedOrder.deliveryOption}
              </Typography>
              <Typography>
                Delivery Status: {selectedOrder.deliveryStatus || "N/A"}
              </Typography>
              <Typography>
                Shipping Cost: Rp{" "}
                {selectedOrder.shippingCost?.toLocaleString("id-ID")}
              </Typography>
              <Typography>
                Created At: {formatDate(selectedOrder.createdAt)}
              </Typography>
              {selectedOrder.estimatedFinishTime && (
                <Typography>
                  Estimated Finish Time:{" "}
                  {formatDate(selectedOrder.estimatedFinishTime)}
                </Typography>
              )}

              <Typography variant="h6" sx={{ mt: 2 }}>
                Services
              </Typography>
              {selectedOrder.services.map((service, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography>Service: {service.serviceId.name}</Typography>
                  <Typography>
                    Category: {service.serviceId.category}
                  </Typography>
                  <Typography>
                    Price: Rp {service.serviceId.price?.toLocaleString("id-ID")}
                  </Typography>
                  <Typography>Quantity: {service.qty}</Typography>
                  {/* Before Washing Images */}
                  {service.beforeWashingImages &&
                    service.beforeWashingImages.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                          Before Washing
                        </Typography>
                        {service.beforeWashingImages.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image.link}
                            alt={`Before Washing ${imgIndex + 1}`}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              marginTop: "8px",
                            }}
                          />
                        ))}
                      </Box>
                    )}

                  {/* After Washing Images */}
                  {service.afterWashingImages &&
                    service.afterWashingImages.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                          After Washing
                        </Typography>
                        {service.afterWashingImages.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image.link}
                            alt={`After Washing ${imgIndex + 1}`}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              marginTop: "8px",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                </Box>
              ))}

              <Typography variant="h6" sx={{ mt: 2 }}>
                Status Timestamps
              </Typography>
              {selectedOrder.confirmedTime && (
                <Typography>
                  Confirmed: {formatDate(selectedOrder.confirmedTime)}
                </Typography>
              )}
              {selectedOrder.ReceivedTime && (
                <Typography>
                  Received: {formatDate(selectedOrder.ReceivedTime)}
                </Typography>
              )}
              {selectedOrder.queueTime && (
                <Typography>
                  Queue: {formatDate(selectedOrder.queueTime)}
                </Typography>
              )}
              {selectedOrder.processingTime && (
                <Typography>
                  Processing: {formatDate(selectedOrder.processingTime)}
                </Typography>
              )}
              {selectedOrder.finishTime && (
                <Typography>
                  Finished: {formatDate(selectedOrder.finishTime)}
                </Typography>
              )}
              {selectedOrder.cancelledTime && (
                <Typography>
                  Cancelled: {formatDate(selectedOrder.cancelledTime)}
                </Typography>
              )}

              <Typography variant="h6" sx={{ mt: 2 }}>
                Delivery Timestamps
              </Typography>
              {selectedOrder.pickupScheduledTime && (
                <Typography>
                  Pickup Scheduled:{" "}
                  {formatDate(selectedOrder.pickupScheduledTime)}
                </Typography>
              )}
              {selectedOrder.pickedUpTime && (
                <Typography>
                  Picked Up: {formatDate(selectedOrder.pickedUpTime)}
                </Typography>
              )}
              {selectedOrder.readyForDeliveryTime && (
                <Typography>
                  Ready for Delivery:{" "}
                  {formatDate(selectedOrder.readyForDeliveryTime)}
                </Typography>
              )}
              {selectedOrder.outForDeliveryTime && (
                <Typography>
                  Out for Delivery:{" "}
                  {formatDate(selectedOrder.outForDeliveryTime)}
                </Typography>
              )}
              {selectedOrder.deliveredTime && (
                <Typography>
                  Delivered: {formatDate(selectedOrder.deliveredTime)}
                </Typography>
              )}
              {selectedOrder.deliveryFailedTime && (
                <Typography>
                  Delivery Failed:{" "}
                  {formatDate(selectedOrder.deliveryFailedTime)}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListOrders;
