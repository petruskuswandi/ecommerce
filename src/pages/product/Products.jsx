import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Input,
  Grid,
  Pagination,
  CardActionArea,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetServicesQuery } from "../../state/api/serviceApi";

const Products = () => {
  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const navigate = useNavigate();
  const { data } = useGetServicesQuery();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTerm, setCategoryTerm] = useState("");
  const itemsPerPage = 30;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategoryTerm(event.target.value === "all" ? "" : event.target.value);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return data?.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        service.category.toLowerCase().includes(categoryTerm.toLowerCase())
    );
  }, [data, searchTerm, categoryTerm]);

  const paginatedData = useMemo(() => {
    return filteredData?.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  const categories = useMemo(() => {
    return [...new Set(data?.map((service) => service.category))];
  }, [data]);

  const detailServicePage = (serviceName) => {
    navigate(`${serviceName}`);
  };

  return (
    <Box sx={{ p: 2 }}>
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
          placeholder="Cari Layanan"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ p: 1, width: { xs: "100%", sm: 300 } }}
        />

        <FormControl sx={{ width: { xs: "100%", sm: 300 } }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={categoryTerm}
            onChange={handleCategoryChange}
            label="Kategori"
          >
            <MenuItem value="all">Semua Layanan</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {paginatedData?.map((service) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={service._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardActionArea
                onClick={() => detailServicePage(service.name)}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <CardMedia
                  component="img"
                  height={224}
                  image={
                    service.images && service.images[0]
                      ? service.images[0].link
                      : defaultImg
                  }
                  alt={service.name}
                />
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
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

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