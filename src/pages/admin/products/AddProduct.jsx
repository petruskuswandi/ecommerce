import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import iziToast from "izitoast";
import AdminBar from "../components/navbar/AdminBar";
import {
  useAddServiceMutation,
  useGetServicesQuery,
} from "../../../state/api/serviceApi";
import Protect from "../Protect";

const AddProduct = () => {
  const navigate = useNavigate();
  const [addService, { isLoading }] = useAddServiceMutation();
  const { data: existingServices } = useGetServicesQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    estimatedDuration: { days: 0, hours: 0 },
    materials: [],
    laborCost: "",
    applicableShoeTypes: [],
    note: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [newShoeType, setNewShoeType] = useState("");
  const [calculatedProfit, setCalculatedProfit] = useState(0);
  const [newMaterial, setNewMaterial] = useState({ name: "", cost: "" });

  useEffect(() => {
    const price = Number(formData.price) || 0;
    const laborCost = Number(formData.laborCost) || 0;
    const materialsCost = formData.materials.reduce(
      (sum, material) => sum + (Number(material.cost) || 0),
      0
    );
    const totalCost = laborCost + materialsCost;
    setCalculatedProfit(price - totalCost);
  }, [formData.price, formData.laborCost, formData.materials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      estimatedDuration: { ...prev.estimatedDuration, [name]: Number(value) },
    }));
  };

  const handleAddShoeType = () => {
    if (newShoeType) {
      setFormData((prev) => ({
        ...prev,
        applicableShoeTypes: [...prev.applicableShoeTypes, newShoeType],
      }));
      setNewShoeType("");
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.cost) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, newMaterial],
      }));
      setNewMaterial({ name: "", cost: "" });
    }
  };

  const handleRemoveMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveShoeType = (index) => {
    setFormData((prev) => ({
      ...prev,
      applicableShoeTypes: prev.applicableShoeTypes.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (
        key === "estimatedDuration" ||
        key === "materials" ||
        key === "applicableShoeTypes"
      ) {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    formDataToSend.append("profit", calculatedProfit.toString());

    newImages.forEach((file, index) => {
      formDataToSend.append("image", file);
    });

    try {
      await addService(formDataToSend).unwrap();
      iziToast.success({
        title: "Success",
        message: "Service added successfully!",
        position: "topRight",
        timeout: 3000,
      });
      navigate("/admin-services");
    } catch (err) {
      iziToast.error({
        title: "Error",
        message:
          err.data?.message || err.data?.error || "An error occurred while adding the service",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  const categories = [
    ...new Set(existingServices?.map((service) => service.category) || []),
  ];

  return (
    <Protect>
      <>
        <AdminBar />
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Add New Service
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    required
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleInputChange}
                      name="category"
                      label="Category"
                    >
                      {categories.map((category, index) => (
                        <MenuItem key={index} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Price (IDR)"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Labor Cost (IDR)"
                    name="laborCost"
                    value={formData.laborCost}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    required
                  />
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Duration (Days)"
                      name="days"
                      value={formData.estimatedDuration.days}
                      onChange={handleDurationChange}
                      type="number"
                      required
                    />
                    <TextField
                      label="Duration (Hours)"
                      name="hours"
                      value={formData.estimatedDuration.hours}
                      onChange={handleDurationChange}
                      type="number"
                      required
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Description
                    </Typography>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, description: value }))
                      }
                      style={{
                        height: isMobile ? "150px" : "200px",
                        marginBottom: isMobile ? "80px" : "50px",
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Materials
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        value={newMaterial.name}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            name: e.target.value,
                          })
                        }
                        label="Material Name"
                      />
                      <TextField
                        value={newMaterial.cost}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            cost: e.target.value,
                          })
                        }
                        label="Cost"
                        type="number"
                      />
                      <Button onClick={handleAddMaterial}>Add</Button>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {formData.materials.map((material, index) => (
                        <Chip
                          key={index}
                          label={`${material.name} - ${material.cost}`}
                          onDelete={() => handleRemoveMaterial(index)}
                        />
                      ))}
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    label="Calculated Profit (IDR)"
                    value={calculatedProfit}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Applicable Shoe Types
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        value={newShoeType}
                        onChange={(e) => setNewShoeType(e.target.value)}
                        label="Add Shoe Type"
                      />
                      <Button onClick={handleAddShoeType}>Add</Button>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {formData.applicableShoeTypes.map((type, index) => (
                        <Chip
                          key={index}
                          label={type}
                          onDelete={() => handleRemoveShoeType(index)}
                        />
                      ))}
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    label="Note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                  <Box
                    sx={{
                      p: 2,
                      border: "2px dashed #ccc",
                      borderRadius: 2,
                      textAlign: "center",
                      mb: 2,
                      mt: 2,
                    }}
                    onDrop={handleImageDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Images
                      </Button>
                    </label>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      or drag and drop images here
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    {newImages.map((img, index) => (
                      <Grid item key={`new-${index}`} xs={4} sm={3} md={2}>
                        <Box sx={{ position: "relative" }}>
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`New Preview ${index}`}
                            style={{
                              width: "100%",
                              height: "auto",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bgcolor: "background.paper",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Service"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </>
    </Protect>
  );
};

export default AddProduct;
