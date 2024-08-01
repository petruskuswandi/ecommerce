import {
  Box,
  Button,
  Fade,
  Modal,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGiveReviewMutation } from "../../../state/api/serviceApi";
import iziToast from "izitoast";

const Review = ({ open, close, serviceId }) => {
  const [giveReview, { isLoading }] = useGiveReviewMutation();
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!serviceId) {
      iziToast.error({
        title: "Error",
        message: "Invalid product ID",
        position: "topRight",
        timeout: 3000,
      });
      return;
    }

    try {
      const result = await giveReview({
        id: serviceId,
        body: { rating, comment: review }
      }).unwrap();

      iziToast.success({
        title: "Success",
        message: result.message,
        position: "topRight",
        timeout: 3000,
      });

      close();
    } catch (err) {
      iziToast.error({
        title: "Error",
        message: err.data?.error || "An error occurred",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  useEffect(() => {
    if (open) {
      setRating(1);
      setReview("");
    }
  }, [open]);

  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450 },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            p: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>
          <form
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "15px",
            }}
            onSubmit={submitHandler}
          >
            <Stack spacing={1}>
              <Rating
                name="size-large"
                value={rating}
                size={isMobile ? "medium" : "large"}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </Stack>

            <Box sx={{ width: "100%", height: { xs: 120, sm: 150 } }}>
              <ReactQuill
                theme="snow"
                value={review}
                onChange={setReview}
                style={{ height: "100%" }}
              />
            </Box>

            <Button
              sx={{ mt: 2 }}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>

            <Button onClick={close} fullWidth variant="contained" color="error">
              Close
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default Review;