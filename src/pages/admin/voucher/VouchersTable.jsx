import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Modal,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import {
  useDeleteVoucherMutation,
  useGetAllVouchersQuery,
} from "../../../state/api/voucherApi";

const VouchersTable = ({ searchTerm }) => {
  const { data, isLoading, refetch } = useGetAllVouchersQuery();
  const [deleteVoucher] = useDeleteVoucherMutation();
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: [] });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.vouchers) {
      const processedRows = data.vouchers.map((voucher, index) => ({
        id: voucher._id || index,
        no: index + 1,
        ...voucher,
      }));
      console.log("Processed rows:", processedRows);
      setRows(processedRows);
      refetch();
    }
  }, [data, refetch]);

  const handleModalOpen = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  const handleModalClose = () => setModalOpen(false);

  const handleEdit = async (code) => {
    navigate(`/admin-voucher/edit/${code}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteVoucher(id).unwrap();
      iziToast.success({
        title: "Success",
        message: "Voucher deleted successfully!",
        position: "topRight",
        timeout: 3000,
      });
      navigate("/admin-voucher");
      refetch();
    } catch (err) {
      iziToast.error({
        title: "Error",
        message:
          err.data?.message || "An error occurred while deleting the voucher",
        position: "topRight",
        timeout: 3000,
      });
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
    { id: "no", label: "No", minWidth: 50 },
    { id: "code", label: "Kode", minWidth: 100 },
    { id: "description", label: "Deskripsi", minWidth: 170 },
    { id: "applicableServices", label: "Layanan yang Berlaku", minWidth: 170 },
    {
      id: "excludedServices",
      label: "Layanan yang Dikecualikan",
      minWidth: 170,
    },
    { id: "discount", label: "Diskon", minWidth: 100 },
    { id: "period", label: "Periode Berlaku", minWidth: 170 },
    { id: "usage", label: "Penggunaan", minWidth: 100 },
    { id: "isActive", label: "Status", minWidth: 100 },
    { id: "actions", label: "Actions", minWidth: 100 },
  ];

  const filteredRows = rows.filter(
    (row) =>
      row?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TableContainer component={Paper}>
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
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    {row.applicableServices?.length || 0}
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleModalOpen(
                          "Layanan yang Berlaku",
                          row.applicableServices?.map((service) => ({
                            serviceName: service.name,
                            price: service.price,
                          })) || []
                        )
                      }
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {row.excludedServices?.length || 0}
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleModalOpen(
                          "Layanan yang Dikecualikan",
                          row.excludedServices?.map((service) => ({
                            serviceName: service.name,
                            price: service.price,
                          }))
                        )
                      }
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {row.discountType === "percentage"
                      ? `${row.discountValue}%`
                      : `Rp ${row.discountValue?.toLocaleString()}`}
                    {row.maxDiscount > 0 &&
                      ` (Max: Rp ${row.maxDiscount?.toLocaleString()})`}
                  </TableCell>
                  <TableCell>
                    {row.startDate && row.endDate
                      ? (() => {
                          const formatDate = (dateString) => {
                            const [datePart, timePart] = dateString.split("T");
                            const [year, month, day] = datePart.split("-");
                            const time = timePart.substring(0, 5);
                            return `${day}/${month}/${year} ${time}`;
                          };

                          const formattedStartDate = formatDate(row.startDate);
                          const formattedEndDate = formatDate(row.endDate);

                          return `${formattedStartDate} - ${formattedEndDate}`;
                        })()
                      : "Invalid Date"}
                  </TableCell>
                  <TableCell>{`${row.usageCount} / ${row.usageLimit}`}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.isActive ? "Aktif" : "Tidak Aktif"}
                      color={row.isActive ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(row.code)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
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

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {modalContent?.title}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalContent?.content.length > 0 ? (
              <ul>
                {modalContent?.content.map((item, index) => (
                  <li key={index}>
                    <strong>{item.serviceName}</strong> (Harga: {item.price})
                  </li>
                ))}
              </ul>
            ) : (
              "Tidak ada layanan"
            )}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default VouchersTable;
