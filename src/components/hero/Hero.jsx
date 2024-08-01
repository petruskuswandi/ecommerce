import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useGetStoreDataQuery } from "../../state/api/storeApi";

const Hero = () => {
  // Placeholder images
  const { data } = useGetStoreDataQuery();
  const images = data?.sliders;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ mt: 2, width: "100%" }}
    >
      <Carousel
        animation="slide"
        duration={1500}
        indicators={false}
        sx={{ width: "95%" }}
      >
        {images?.map((imageUrl, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              width: "100%",
              height: { xs: 150, md: 300 },
            }}
          >
            <Box
              component="img"
              src={imageUrl.link}
              alt={`Slide ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 2,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
              }}
            >
              <Typography variant="h5" color="white">
                {data.sliders[index].title}
              </Typography>
              <Typography variant="body2" color="white">
                {data.sliders[index].description}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Carousel>
    </Box>
  );
};

export default Hero;
