import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Order from "./Order";
import { useState, useEffect, useMemo } from "react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "../../state/api/cartApi";
import { throttle } from "lodash";
import Protect from "../user/Protect";

const CartItem = ({
  service,
  onQuantityChange,
  onRemove,
  onCheckChange,
  isUpdating,
}) => {
  const defaultImg = "http://dummyimage.com/650x650.png/cc0000/ffffff";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const throttledQuantityChange = useMemo(
    () => throttle((id, qty) => onQuantityChange(id, qty), 300),
    [onQuantityChange]
  );

  const [isChecked, setIsChecked] = useState(service.isChecked);

  useEffect(() => {
    setIsChecked(service.isChecked);
  }, [service.isChecked]);

  const handleCheckboxChange = (event) => {
    const newCheckedState = event.target.checked;
    setIsChecked(newCheckedState);
    onCheckChange(service.serviceId._id, newCheckedState);
  };

  return (
    <Protect>
      <Paper
        elevation={3}
        sx={{
          mb: 2,
          p: 2,
          position: "relative",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            />
            <img
              src={
                service.serviceId.images && service.serviceId.images.length > 0
                  ? service.serviceId.images[0].link
                  : defaultImg
              }
              alt={service.serviceId.name || "Service"}
              style={{
                height: "120px",
                width: "120px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {service.serviceId.name}
            </Typography>
            <Typography variant="h6" color="primary">{`Rp ${parseFloat(
              service.serviceId.price * service.qty
            ).toLocaleString("id-ID")}`}</Typography>
            <Typography variant="body2" color="text.secondary">
              {service.serviceId.weight || 0} gram
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={() =>
                    throttledQuantityChange(
                      service.serviceId._id,
                      Math.max(1, service.qty - 1)
                    )
                  }
                  disabled={service.qty === 1 || isUpdating}
                  sx={{
                    bgcolor: "action.selected",
                    "&:hover": { bgcolor: "action.hover" },
                    width: 40,
                    height: 40,
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{ minWidth: "40px", textAlign: "center" }}
                >
                  {service.qty}
                </Typography>
                <IconButton
                  onClick={() =>
                    throttledQuantityChange(
                      service.serviceId._id,
                      Math.min(service.qty + 1)
                    )
                  }
                  disabled={isUpdating}
                  sx={{
                    bgcolor: "action.selected",
                    "&:hover": { bgcolor: "action.hover" },
                    width: 40,
                    height: 40,
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <IconButton
                onClick={() => onRemove(service.serviceId._id)}
                sx={{
                  color: "error.main",
                  "&:hover": { bgcolor: "error.light" },
                  width: 40,
                  height: 40,
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Protect>
  );
};

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: cart } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const [localCart, setLocalCart] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    if (cart) {
      setLocalCart((prevLocalCart) => {
        const updatedServices = cart.services.map((service) => ({
          ...service,
          isChecked:
            prevLocalCart?.services.find(
              (p) => p.serviceId._id === service.serviceId._id
            )?.isChecked || false,
        }));
        return { ...cart, services: updatedServices };
      });
    }
  }, [cart]);

  const handleCheckItem = (serviceId, isChecked) => {
    setLocalCart((prevCart) => ({
      ...prevCart,
      services: prevCart.services.map((service) =>
        service.serviceId._id === serviceId
          ? { ...service, isChecked }
          : service
      ),
    }));
  };

  const handleQuantityChange = async (serviceId, newQuantity) => {
    setLocalCart((prevCart) => ({
      ...prevCart,
      services: prevCart.services.map((service) =>
        service.serviceId._id === serviceId
          ? { ...service, qty: newQuantity }
          : service
      ),
    }));

    setUpdatingItems((prev) => ({ ...prev, [serviceId]: true }));

    try {
      await updateCartItem({ serviceId, qty: newQuantity });
    } catch (error) {
      console.error("Failed to update quantity", error);
      // Optionally show an error message to the user
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleRemoveItem = async (serviceId) => {
    setLocalCart((prevCart) => ({
      ...prevCart,
      services: prevCart.services.filter(
        (item) => item.serviceId._id !== serviceId
      ),
    }));

    try {
      await removeFromCart(serviceId);
    } catch (error) {
      console.error("Failed to remove item", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ margin: { xs: "15px", sm: "30px" } }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Keranjang Belanja
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
          }}
        >
          <Box sx={{ flex: 2, mr: { xs: 0, md: 2 }, mb: { xs: 2, md: 0 } }}>
            {localCart && localCart.services.length > 0 ? (
              localCart.services.map((item) => (
                <CartItem
                  key={item._id}
                  service={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onCheckChange={handleCheckItem}
                  isUpdating={updatingItems[item._id]}
                />
              ))
            ) : (
              <Typography>
                Yuk isi beranjang belanja kamu kosong nih...
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Order cart={localCart} />
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default Cart;
