import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import iziToast from "izitoast";
import AdminBar from "../components/navbar/AdminBar";
import {
  useUpdateVoucherMutation,
  useGetVoucherByCodeQuery,
} from "../../../state/api/voucherApi";
import { useGetServicesQuery } from "../../../state/api/serviceApi";
import { useGetUsersQuery } from "../../../state/api/userApi";
import Protect from "../Protect";

const EditVoucher = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [updateVoucher, { isLoading: isUpdating }] = useUpdateVoucherMutation();
  const { data: voucherData } = useGetVoucherByCodeQuery(code);
  const { data: services } = useGetServicesQuery();
  const { data: users } = useGetUsersQuery();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    maxDiscount: 0,
    minPurchase: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    isActive: false,
    applicableServices: [],
    excludedServices: [],
    users: [],
  });

  useEffect(() => {
    if (voucherData) {
      setFormData({
        ...voucherData,
        startDate: voucherData.startDate.slice(0, 16),
        endDate: voucherData.endDate.slice(0, 16),
        applicableServices: voucherData.applicableServices.map(
          (service) => service._id
        ),
        excludedServices: voucherData.excludedServices.map(
          (service) => service._id
        ),
        users: voucherData.users.map((user) => user._id),
      });
    }
  }, [voucherData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleServicesChange = (event, field) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleUserChange = (event, field) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      discountValue: Number(formData.discountValue),
      maxDiscount: Number(formData.maxDiscount),
      minPurchase: Number(formData.minPurchase),
      usageLimit: Number(formData.usageLimit),
    };
    try {
      await updateVoucher({ id: voucherData._id, ...dataToSubmit }).unwrap();
      iziToast.success({
        title: "Success",
        message: "Voucher updated successfully!",
        position: "topRight",
        timeout: 3000,
      });
      navigate("/admin-voucher");
    } catch (err) {
      iziToast.error({
        title: "Error",
        message:
          err.data?.message || "An error occurred while updating the voucher",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  return (
    <Protect>
      <>
        <AdminBar />
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Edit Voucher
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Voucher Code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      value={formData.discountType}
                      onChange={handleInputChange}
                      name="discountType"
                      label="Discount Type"
                    >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="fixed">Fixed Amount</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label={
                      formData.discountType === "percentage"
                        ? "Discount Percentage"
                        : "Discount Amount"
                    }
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    required
                  />
                  {formData.discountType === "percentage" && (
                    <TextField
                      fullWidth
                      label="Max Discount"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                      type="number"
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Min Purchase"
                    name="minPurchase"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Usage Limit"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    required
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        name="isActive"
                        type="checkbox"
                      />
                    }
                    label="Is Active"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Applicable Services</InputLabel>
                    <Select
                      multiple
                      value={formData.applicableServices}
                      onChange={(e) =>
                        handleServicesChange(e, "applicableServices")
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                services?.find((s) => s._id === value)?.name ||
                                value
                              }
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {services?.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Excluded Services</InputLabel>
                    <Select
                      multiple
                      value={formData.excludedServices}
                      onChange={(e) =>
                        handleServicesChange(e, "excludedServices")
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                services?.find((s) => s._id === value)?.name ||
                                value
                              }
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {services?.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Users</InputLabel>
                    <Select
                      multiple
                      value={formData.users}
                      onChange={(e) => handleUserChange(e, "users")}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                users?.find((u) => u._id === value)?.name ||
                                value
                              }
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {users?.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Voucher"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </>
    </Protect>
  );
};

export default EditVoucher;
