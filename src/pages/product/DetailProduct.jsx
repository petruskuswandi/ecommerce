import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { orange } from "@mui/material/colors";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { useState } from "react";
import Order from "./Order";
import Reviews from "./Reviews";
import { useParams } from "react-router-dom";
import { useGetServiceQuery } from "../../state/api/serviceApi";

const createMarkUp = (html) => {
  return { __html: html };
};

const DetailProduct = () => {
  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";

  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { data, error, isLoading } = useGetServiceQuery(params?.name);

  const [imageIndex, setIndex] = useState(0);
  const [openReviews, setOpenReviews] = useState(false);

  const prev = () => {
    setIndex((imageIndex - 1 + data?.images.length) % data?.images.length);
  };

  const next = () => {
    setIndex((imageIndex + 1) % data?.images.length);
  };

  const imageSize = isMobile ? 250 : isTablet ? 350 : 400;

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: "85vh",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flex: 2,
            flexDirection: isMobile || isTablet ? "column" : "row",
            alignItems: "start",
          }}
        >
          {/* Image */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: imageSize,
                height: imageSize,
                position: "relative",
                overflow: "hidden",
                borderRadius: "10px",
              }}
            >
              <img
                src={
                  data?.images && data?.images[imageIndex]
                    ? data?.images[imageIndex].link
                    : defaultImg
                }
                alt={data?.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 10px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <IconButton
                  onClick={prev}
                  size="small"
                  sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                <IconButton
                  onClick={next}
                  size="small"
                  sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <ArrowRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Detail */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              p: 2,
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
              {data?.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{ display: "flex", alignItems: "center", color: "grey" }}
              >
                <StarRoundedIcon sx={{ color: orange[500], mr: 0.5 }} />
                {data?.rating} ({data?.reviews.length} reviewers)
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenReviews(true)}
              >
                See Reviews
              </Button>
            </Box>
            <Typography
              fontWeight="bold"
              variant={isMobile ? "h6" : "h5"}
            >{`Rp. ${parseFloat(data?.price).toLocaleString(
              "id-ID"
            )}`}</Typography>

            <Typography dangerouslySetInnerHTML={createMarkUp(data?.description)} />

            <Typography variant="subtitle1">
              Estimated Duration: {data?.estimatedDuration.days} days, {data?.estimatedDuration.hours} hours
            </Typography>

            <Typography variant="subtitle1">
              Applicable Shoe Types: {data?.applicableShoeTypes.join(", ")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: isMobile ? "auto" : 1,
            p: 2,
            justifyContent: "center",
          }}
        >
          <Order service={data} />
        </Box>
      </Box>
      <Dialog
        open={openReviews}
        onClose={() => setOpenReviews(false)}
        fullWidth
        maxWidth="md"
      >
        <Reviews
          reviews={data?.reviews}
          open={openReviews}
          close={() => setOpenReviews(false)}
        />
      </Dialog>
      <Footer />
    </Box>
  );
};

export default DetailProduct;