import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Typography,
  Input,
  Tooltip,
  Grid,
  Pagination,
  CircularProgress,
  Modal,
  Fade,
  Button,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { blue, orange, red, yellow } from "@mui/material/colors";
import iziToast from "izitoast";
import { useNavigate } from "react-router-dom";
import Product from "./Product";
import Reviews from "./Reviews";
import UploadProducts from "./UploadProducts";
import {
  useDeleteServiceMutation,
  useDeleteServicesMutation,
  useGetServiceQuery,
  useGetServicesQuery,
} from "../../../state/api/serviceApi";

const Products = () => {
  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const [valid, setValid] = useState(false);

  const [deleteProduct, { data, isSuccess, error, isLoading, reset }] =
    useDeleteServiceMutation();

  const [deleteProducts, { datas, isSuccesss, isLoadings, errors, resets }] =
    useDeleteServicesMutation();

  const delAll = () => deleteProducts();

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: datas?.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();

      setValid(false);
    }

    if (error) {
      iziToast.success({
        title: "Success",
        message: error?.datas.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccesss, datas, errors]);

  const {
    data: productDetail,
    isLoading: prodLoading,
    isSuccess: prodSuccess,
  } = useGetServiceQuery(name, {
    skip: !name,
  });

  const { data: products, refetch } = useGetServicesQuery();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;

  const deleteHandler = (id) => deleteProduct(id);

  const detailHandler = (name) => {
    setName(name), setOpen(true);
  };

  const showReview = (review) => {
    setReviews(review);
    setShow(true);
  };

  const addPage = () => navigate("/admin-produk/tambah");

  const editPage = (name) => navigate(`/admin-produk/edit/${name}`);

  useEffect(() => {
    if (isSuccess) {
      iziToast.success({
        title: "Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }

    if (error) {
      iziToast.success({
        title: "Success",
        message: error?.data.message,
        position: "topRight",
        timeout: 3000,
      });

      reset();
    }
  }, [isSuccess, error, data]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return products?.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const paginatedData = useMemo(() => {
    return filteredData?.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Search and action buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Input
          placeholder="Cari Produk"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ p: 1, width: { xs: "100%", sm: "auto" } }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Tambah Produk">
            <IconButton onClick={addPage}>
              <AddIcon sx={{ color: blue[500] }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Upload Produk dari Excel">
            <IconButton onClick={handleOpenUploadModal}>
              <UploadFileIcon sx={{ color: orange[500] }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Hapus Semua Produk">
            <IconButton onClick={() => setValid(true)}>
              <DeleteIcon sx={{ color: red[500] }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Modal open={valid} onClose={() => setValid(false)}>
        <Fade in={valid}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Konfirmasi Penghapusan
            </Typography>
            <Typography variant="body1" gutterBottom>
              Apakah Anda yakin akan menghapus seluruh produk?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="outlined" onClick={() => setValid(false)}>
                Batalkan
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={delAll}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Lanjutkan"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <UploadProducts
        open={isUploadModalOpen}
        close={handleCloseUploadModal}
        onUploadSuccess={refetch}
      />

      {/* Product grid */}
      <Grid container spacing={2}>
        {paginatedData?.map((service) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height={224}
                  image={
                    service.images && service.images[0]
                      ? service.images[0].link
                      : defaultImg
                  }
                  alt={service.name}
                  onClick={() => detailHandler(service.name)}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                />
              </CardActionArea>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" align="center" gutterBottom>
                  {service.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="center"
                  fontStyle="italic"
                  gutterBottom
                >
                  {service.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Rating value={service.rating} readOnly />
                </Box>
              </CardContent>
              <CardActions>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <IconButton onClick={() => showReview(service.reviews)}>
                    <ChatIcon sx={{ color: orange[500] }} />
                  </IconButton>
                  <IconButton onClick={() => editPage(service.name)}>
                    <EditIcon sx={{ color: yellow[800] }} />
                  </IconButton>
                  <IconButton onClick={() => deleteHandler(service._id)}>
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RemoveIcon sx={{ color: red[800] }} />
                    )}
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Product
        open={open}
        close={() => setOpen(false)}
        productDetail={productDetail}
      />
      <Reviews open={show} close={() => setShow(false)} reviews={reviews} />

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil((filteredData?.length || 0) / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Products;
