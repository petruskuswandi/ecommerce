import React from "react";
import {
  Box,
  Fade,
  Modal,
  Typography,
  Avatar,
  Rating,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const createMarkUp = (html) => {
  return { __html: html };
};

const Reviews = ({ open, close, reviews }) => {
  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450, md: 550 },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
            p: 3,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Ulasan Produk
            </Typography>
            <IconButton onClick={close} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Box
                key={review._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  p: 2,
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  mb: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={review.user?.avatar}
                    alt={review.user?.name}
                    sx={{ mr: 2 }}
                  >
                    {review.user?.name
                      ? review.user.name.charAt(0).toUpperCase()
                      : ""}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold">
                      {review.user?.name || "Anonymous"}
                    </Typography>
                    <Rating value={review.rating || 0} readOnly size="small" />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={createMarkUp(review.comment)}
                  sx={{ mt: 1, gap: 1 }}
                />
              </Box>
            ))
          ) : (
            <Typography align="center" color="text.secondary">
              Belum ada ulasan untuk produk ini
            </Typography>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default Reviews;
