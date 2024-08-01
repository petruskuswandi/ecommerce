import React from "react";
import { Box, Dialog, DialogTitle, DialogContent, Typography, Avatar, Rating, Divider, IconButton, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const createMarkup = (html) => {
  return { __html: html };
};

const Reviews = ({ open, close, reviews }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog 
      open={open} 
      onClose={close}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Customer Reviews
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <React.Fragment key={review._id}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Avatar 
                  src={review.user.avatar} 
                  alt={review.user.name} 
                  sx={{ mr: 2 }}
                >
                  {review.user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      {review.user.name}
                    </Typography>
                    <Rating value={review.rating || 5} readOnly size="small" />
                  </Box>
                  <Box 
                    sx={{ 
                      '& .ql-editor': { padding: 0 },
                      '& *': { margin: 0 }
                    }}
                    dangerouslySetInnerHTML={createMarkup(review.comment)}
                  />
                </Box>
              </Box>
              {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 3 }}>
            No reviews yet. Be the first to review this product!
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Reviews;