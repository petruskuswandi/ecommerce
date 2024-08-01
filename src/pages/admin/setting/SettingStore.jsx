import React, { useEffect, useState, useCallback } from "react";
import {
  useGetCitiesQuery,
  useGetProvincesQuery,
} from "../../../state/api/shipmentApi";
import {
  useUpdateStoreMutation,
  useDeleteSliderMutation,
  useUpdateSliderMutation,
  useGetStoreDataQuery,
} from "../../../state/api/storeApi";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const SettingStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    province: "",
    city: "",
    address: "",
    logo: null,
    sliders: [],
  });
  const [editingSlider, setEditingSlider] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: provinces } = useGetProvincesQuery();
  const { data: cities } = useGetCitiesQuery(formData.province, {
    skip: !formData.province,
  });
  const { data: storeData, isLoading: isLoadingStoreData } =
    useGetStoreDataQuery();
  const [updateStore, { isLoading: isUpdatingStore }] =
    useUpdateStoreMutation();
  const [deleteSlider] = useDeleteSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();

  useEffect(() => {
    if (storeData) {
      setFormData({
        name: storeData.name || "",
        province: storeData.province || "",
        city: storeData.city || "",
        address: storeData.address || "",
        logo: storeData.logo || null,
        sliders: storeData.sliders || [],
      });
    }
  }, [storeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = useCallback((e, type) => {
    const files = Array.from(e.target.files);
    if (type === "logo" && files.length > 0) {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else if (type === "sliders") {
      setFormData((prev) => ({
        ...prev,
        sliders: [
          ...prev.sliders,
          ...files.map((file) => ({
            file,
            title: "",
            description: "",
            isNew: true,
          })),
        ],
      }));
    }
  }, []);

  const removeSlider = async (index, sliderId) => {
    if (sliderId && !formData.sliders[index].isNew) {
      try {
        await deleteSlider(sliderId).unwrap();
        iziToast.success({
          title: "Success",
          message: "Slider deleted successfully",
          position: "topRight",
        });
      } catch (err) {
        iziToast.error({
          title: "Error",
          message: err.data?.message || "Failed to delete slider",
          position: "topRight",
        });
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      sliders: prev.sliders.filter((_, i) => i !== index),
    }));
  };

  const handleEditSlider = (slider, index) => {
    setEditingSlider({ ...slider, index });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingSlider(null);
    setOpenDialog(false);
  };

  const handleUpdateSlider = async () => {
    if (!editingSlider) {
      return;
    }

    try {
      const formData = new FormData();
      if (editingSlider.file) {
        formData.append("image", editingSlider.file);
      }
      formData.append("title", editingSlider.title || "");
      formData.append("description", editingSlider.description || "");

      const result = await updateSlider({
        sliderId: editingSlider._id,
        body: formData,
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        sliders: prev.sliders.map((slider, index) =>
          index === editingSlider.index ? result.store.sliders[index] : slider
        ),
      }));

      iziToast.success({
        title: "Success",
        message: "Slider updated successfully",
        position: "topRight",
      });

      handleCloseDialog();
    } catch (err) {
      iziToast.error({
        title: "Error",
        message: err.data?.message || "Failed to update slider",
        position: "topRight",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);

      if (formData.logo instanceof File) {
        formDataToSend.append("logo", formData.logo);
      }

      formData.sliders.forEach((slider, index) => {
        if (slider.isNew) {
          formDataToSend.append("sliders", slider.file);
          formDataToSend.append(
            `sliderTitles[${slider.file.name}]`,
            slider.title || ""
          );
          formDataToSend.append(
            `sliderDescriptions[${slider.file.name}]`,
            slider.description || ""
          );
        }
      });

      const result = await updateStore(formDataToSend).unwrap();

      setFormData((prev) => ({
        ...prev,
        logo: result.store.logo,
        sliders: result.store.sliders,
      }));

      iziToast.success({
        title: "Success",
        message: "Store updated successfully",
        position: "topRight",
      });
    } catch (err) {
      iziToast.error({
        title: "Error",
        message: err.data?.message || "An error occurred",
        position: "topRight",
      });
    }
  };

  if (isLoadingStoreData) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Store Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Store Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Province</InputLabel>
            <Select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              label="Province"
            >
              {provinces?.map((item) => (
                <MenuItem key={item.province_id} value={item.province_id}>
                  {item.province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>City</InputLabel>
            <Select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              label="City"
              disabled={!formData.province}
            >
              {cities?.map((item) => (
                <MenuItem key={item.city_id} value={item.city_id}>
                  {item.type} {item.city_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Full Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="logo-upload"
            onChange={(e) => handleFileUpload(e, "logo")}
          />
          <label htmlFor="logo-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
              startIcon={<CloudUploadIcon />}
            >
              Upload Logo
            </Button>
          </label>
          {formData.logo && (
            <Box
              mt={2}
              sx={{
                backgroundColor: "#f0f0f0",
                padding: 2,
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #e0e0e0",
              }}
            >
              <img
                src={
                  formData.logo instanceof File
                    ? URL.createObjectURL(formData.logo)
                    : formData.logo
                }
                alt="Store Logo"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            id="slider-upload"
            onChange={(e) => handleFileUpload(e, "sliders")}
          />
          <label htmlFor="slider-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
              startIcon={<CloudUploadIcon />}
            >
              Upload Slider Images
            </Button>
          </label>
          {formData.sliders.length > 0 && (
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {formData.sliders.map((slider, index) => (
                <Box key={index} position="relative">
                  <img
                    src={
                      slider.file
                        ? URL.createObjectURL(slider.file)
                        : slider.link
                    }
                    alt={`Slider ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    size="small"
                    onClick={() => removeSlider(index, slider._id)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      minWidth: "auto",
                      p: 0,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleEditSlider(slider, index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      minWidth: "auto",
                      p: 0,
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                </Box>
              ))}
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isUpdatingStore}
          >
            {isUpdatingStore ? "Updating..." : "Update Store Information"}
          </Button>
        </form>
      </CardContent>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Slider</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingSlider?.title || ""}
            onChange={(e) =>
              setEditingSlider({ ...editingSlider, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editingSlider?.description || ""}
            onChange={(e) =>
              setEditingSlider({
                ...editingSlider,
                description: e.target.value,
              })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditingSlider({ ...editingSlider, file: e.target.files[0] })
            }
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateSlider}>Update</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SettingStore;
