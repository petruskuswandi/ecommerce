import React, { useEffect, useState, useMemo } from "react";
import {
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../../state/api/userApi";

const UsersTable = ({ searchTerm }) => {
  const { data: fetchedUsers, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(
        fetchedUsers.map((user, index) => ({ ...user, index: index + 1 }))
      );
    }
  }, [fetchedUsers]);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleWhatsAppClick = (phoneNumber) => {
    // Membuat URL WhatsApp
    const whatsappUrl = `https://wa.me/62${phoneNumber}`;
    // Membuka URL di tab baru
    window.open(whatsappUrl, "_blank");
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>No. HP</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.index}</TableCell>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Tooltip title="WhatsApp">
                      <IconButton
                        color="success"
                        onClick={() => handleWhatsAppClick(user.phone)}
                      >
                        <WhatsAppIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => handleDelete(user._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UsersTable;
