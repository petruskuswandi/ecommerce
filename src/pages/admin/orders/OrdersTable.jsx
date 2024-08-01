import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  TablePagination,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useUpdateDeliveryStatusMutation,
  useDeleteOrderMutation,
  useUploadBeforeWashingImagesMutation,
  useUploadAfterWashingImagesMutation,
} from "../../../state/api/orderApi";

const OrderTable = ({ searchTerm }) => {
  const { data, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [updateDeliveryStatus] = useUpdateDeliveryStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [uploadBeforeWashingImages] = useUploadBeforeWashingImagesMutation();
  const [uploadAfterWashingImages] = useUploadAfterWashingImagesMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusType, setStatusType] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    if (data?.orders) {
      const filtered = data.orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRows(filtered);
      setPage(0);
    }
  }, [data, searchTerm]);

  const handleEditClick = (order, type) => {
    if (type === "paymentMethod" || type === "deliveryOption") {
      return;
    }
    setSelectedOrder(order);
    setStatusType(type);
    setNewStatus(order[type]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setStatusType("");
    setNewStatus("");
  };

  const handleUpdateStatus = async () => {
    try {
      switch (statusType) {
        case "orderStatus":
          await updateOrderStatus({
            orderId: selectedOrder.orderId,
            orderStatus: newStatus,
          }).unwrap();
          break;
        case "paymentStatus":
          await updatePaymentStatus({
            orderId: selectedOrder.orderId,
            paymentStatus: newStatus,
          }).unwrap();
          break;
        case "deliveryStatus":
          await updateDeliveryStatus({
            orderId: selectedOrder.orderId,
            deliveryStatus: newStatus,
          }).unwrap();
          break;
        default:
          console.error("Invalid status type");
          return;
      }
      handleCloseDialog();
      refetch();
    } catch (err) {
      console.error(`Failed to update ${statusType}:`, err);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };

  const handleFileChange = (orderId, serviceId, type, event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [serviceId]: {
          ...prev[orderId]?.[serviceId],
          [type]: files,
        },
      },
    }));
  };

  const handleUploadImages = async (orderId, serviceId, type) => {
    const images = selectedImages[orderId]?.[serviceId]?.[type];
    if (!images || images.length === 0) {
      return;
    }

    try {
      const uploadFunction =
        type === "before"
          ? uploadBeforeWashingImages
          : uploadAfterWashingImages;
      await uploadFunction({ orderId, serviceId, images }).unwrap();
      alert(
        `${
          type === "before" ? "Before" : "After"
        } washing images uploaded successfully`
      );
      // Clear the selected images after successful upload
      setSelectedImages((prev) => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          [serviceId]: {
            ...prev[orderId]?.[serviceId],
            [type]: [],
          },
        },
      }));
    } catch (error) {
      console.error(`Failed to upload ${type} washing images:`, error);
      alert(`Failed to upload ${type} washing images`);
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: "No", label: "No", minWidth: 60 },
    { id: "orderId", label: "Order ID", minWidth: 120 },
    { id: "userName", label: "Customer", minWidth: 150 },
    { id: "phone", label: "Phone", minWidth: 120 },
    { id: "subtotal", label: "Subtotal", minWidth: 120 },
    { id: "discount", label: "Discount", minWidth: 120 },
    { id: "total", label: "Total", minWidth: 120 },
    { id: "paymentMethod", label: "Payment Method", minWidth: 150 },
    { id: "paymentStatus", label: "Payment Status", minWidth: 140 },
    { id: "orderStatus", label: "Order Status", minWidth: 140 },
    { id: "deliveryOption", label: "Delivery Option", minWidth: 150 },
    { id: "deliveryStatus", label: "Delivery Status", minWidth: 150 },
    { id: "shippingCost", label: "Shipping Cost", minWidth: 120 },
    { id: "createdAt", label: "Order Date", minWidth: 170 },
    { id: "images", label: "Images", minWidth: 200 },
    { id: "actions", label: "Actions", minWidth: 100 },
  ];

  const getStatusOptions = (type) => {
    switch (type) {
      case "orderStatus":
        return [
          "pending",
          "confirmed",
          "received",
          "queue",
          "processing",
          "finished",
          "cancelled",
        ];
      case "paymentStatus":
        return ["pending", "settlement", "failed", "expired"];
      case "deliveryStatus":
        return [
          "pending",
          "pickup_scheduled",
          "picked_up",
          "ready_for_delivery",
          "out_for_delivery",
          "delivered",
          "delivery_failed",
        ];
      default:
        return [];
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.orderId}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          { column.id === "No" ? (
                            page * rowsPerPage + index + 1
                          ): column.id === "images" ? (
                            <Box>
                              {row.services.map((service) => (
                                <Box key={service.serviceId._id} mb={1}>
                                  <Typography variant="subtitle2">
                                    {service.serviceId.name}
                                  </Typography>
                                  <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={1}
                                  >
                                    <Box>
                                      <input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                          handleFileChange(
                                            row.orderId,
                                            service.serviceId._id,
                                            "before",
                                            e
                                          )
                                        }
                                      />
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() =>
                                          handleUploadImages(
                                            row.orderId,
                                            service.serviceId._id,
                                            "before"
                                          )
                                        }
                                      >
                                        Upload Before
                                      </Button>
                                    </Box>
                                    <Box>
                                      <input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                          handleFileChange(
                                            row.orderId,
                                            service.serviceId._id,
                                            "after",
                                            e
                                          )
                                        }
                                      />
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() =>
                                          handleUploadImages(
                                            row.orderId,
                                            service.serviceId._id,
                                            "after"
                                          )
                                        }
                                      >
                                        Upload After
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          ) : column.id === "paymentMethod" ||
                            column.id === "deliveryOption" ? (
                            <Chip
                              label={value}
                              color="primary"
                              variant="outlined"
                            />
                          ) : column.id === "paymentStatus" ||
                            column.id === "orderStatus" ||
                            column.id === "deliveryStatus" ? (
                            <Chip
                              label={value}
                              color="primary"
                              variant="outlined"
                              onClick={() => handleEditClick(row, column.id)}
                            />
                          ) : column.id === "actions" ? (
                            <>
                              <IconButton
                                onClick={() => handleViewDetails(row)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteOrder(row.orderId)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          ) : column.id === "subtotal" ||
                            column.id === "discount" ||
                            column.id === "total" ||
                            column.id === "shippingCost" ? (
                            `Rp ${value?.toLocaleString("id-ID") || "0"}`
                          ) : column.id === "createdAt" ? (
                            formatDate(value)
                          ) : column.id === "userName" ? (
                            row.user?.name || "N/A"
                          ) : (
                            value || "-"
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Update {statusType} for Order {selectedOrder?.orderId}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label={`New ${statusType}`}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            margin="normal"
            variant="outlined"
            SelectProps={{
              native: true,
            }}
          >
            {getStatusOptions(statusType).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Order Details: {selectedOrder?.orderId}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6">Customer Information</Typography>
              <Typography>
                Name:{" "}
                {selectedOrder.user && typeof selectedOrder.user === "object"
                  ? selectedOrder.user.name
                  : "N/A"}
              </Typography>
              <Typography>Phone: {selectedOrder.phone}</Typography>
              <Typography>Address: {selectedOrder.address || "N/A"}</Typography>

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
                Delivery Status: {selectedOrder.deliveryStatus}
              </Typography>
              {selectedOrder.shippingCost && (
                <Typography>
                  Shipping Cost: Rp{" "}
                  {selectedOrder.shippingCost.toLocaleString("id-ID")}
                </Typography>
              )}
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
                  <Typography>
                    Service:{" "}
                    {typeof service.serviceId === "object"
                      ? service.serviceId.name
                      : `Service ID: ${service.serviceId}`}
                  </Typography>
                  {typeof service.serviceId === "object" && (
                    <>
                      <Typography>
                        Category: {service.serviceId.category}
                      </Typography>
                      <Typography>
                        Price: Rp{" "}
                        {service.serviceId.price?.toLocaleString("id-ID")}
                      </Typography>
                    </>
                  )}
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
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderTable;
