import React, { useState } from "react";
import {
  Box,
  Fade,
  IconButton,
  Modal,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Product = ({ open, close, productDetail }) => {
  const service = productDetail;
  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const [imageIndex, setIndex] = useState(0);

  const left = () => {
    setIndex((prevIndex) => 
      (prevIndex - 1 + (service?.images?.length || 1)) % (service?.images?.length || 1)
    );
  };

  const right = () => {
    setIndex((prevIndex) => 
      (prevIndex + 1) % (service?.images?.length || 1)
    );
  };

  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "80%", md: "70%", lg: "60%" },
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={close}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", width: "100%", paddingTop: "100%" }}>
                <img
                  src={service?.images?.[imageIndex]?.link || defaultImg}
                  alt={service?.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                {service?.images?.length > 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      px: 1,
                    }}
                  >
                    <IconButton onClick={left} sx={{ bgcolor: "rgba(255,255,255,0.7)" }}>
                      <ArrowBackIosNewIcon />
                    </IconButton>
                    <IconButton onClick={right} sx={{ bgcolor: "rgba(255,255,255,0.7)" }}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>{service?.name}</Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Rp {parseFloat(service?.price).toLocaleString("id-ID")}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>Detail Layanan:</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2">Biaya Tenaga Kerja:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    Rp {parseFloat(service?.laborCost).toLocaleString("id-ID")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Profit:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    Rp {parseFloat(service?.profit).toLocaleString("id-ID")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Estimasi Durasi: {service?.estimatedDuration?.days} hari {service?.estimatedDuration?.hours} jam</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Bahan-bahan:</Typography>
              {service?.materials?.map((material, index) => (
                <Chip 
                  key={index}
                  label={`${material.name}: Rp ${parseFloat(material.cost).toLocaleString("id-ID")}`}
                  sx={{ m: 0.5 }}
                />
              ))}
              
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Jenis Sepatu:</Typography>
              {service?.applicableShoeTypes?.map((type, index) => (
                <Chip key={index} label={type} sx={{ m: 0.5 }} />
              ))}
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Deskripsi Layanan</Typography>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{ __html: service?.description }}
          />
          
          {service?.note && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Catatan</Typography>
              <Typography variant="body2">{service?.note}</Typography>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default Product;