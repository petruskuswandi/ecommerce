import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector } from "react-redux";
import iziToast from "izitoast";
import { useGetTokenMutation } from "../../state/api/paymentApi";
import { useCreateOrderMutation } from "../../state/api/orderApi";
import { useAddToCartMutation } from "../../state/api/cartApi";
import { useValidateVoucherMutation } from "../../state/api/voucherApi";
import { Navigate, useNavigate } from "react-router-dom";
import Protect from "../user/Protect";

function generateOrderId() {
  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`;
}

const Order = ({ service }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const [getToken, { isLoading, data }] = useGetTokenMutation();
  const [createOrder, { isSuccess, reset }] = useCreateOrderMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [validateVoucher, { isLoading: isValidatingVoucher }] =
    useValidateVoucherMutation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [subtotal, setSubtotal] = useState(service?.price || 0);
  const [deliveryOption, setDeliveryOption] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isVoucherValid, setIsVoucherValid] = useState(false);
  const [orderId, setOrderId] = useState("");

  const deliveryOptions = [
    { value: "pickup_by_laundry", label: "Pickup & Delivery", price: 20000 },
    { value: "self_service", label: "Self Drop-off & Pickup", price: 0 },
  ];

  const paymentMethods = [
    { value: "cod", label: "Cash on Delivery" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "gopay", label: "GoPay" },
    { value: "credit_card", label: "Credit Card" },
    { value: "shopeepay", label: "ShopeePay" },
  ];

  const getDeliveryPrice = () => {
    const option = deliveryOptions.find((o) => o.value === deliveryOption);
    return option ? option.price : 0;
  };

  const increaseQty = () => {
    setQty((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (service) {
      setSubtotal(service.price * qty);
    }
  }, [service, qty]);

  const handleAddToCart = async () => {
    if (!isAuth) {
      return iziToast.error({
        title: "Error",
        message: "Please login to add items to cart",
        position: "topRight",
        timeout: 3000,
      });
    }

    try {
      await addToCart({ serviceId: service._id, qty });
      iziToast.success({
        title: "Success",
        message: "Service added to cart",
        position: "topRight",
        timeout: 3000,
      });
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: error.message || "Failed to add service to cart",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode) {
      return iziToast.error({
        title: "Error",
        message: "Please enter a voucher code",
        position: "topRight",
        timeout: 3000,
      });
    }

    try {
      const result = await validateVoucher({
        code: voucherCode,
        services: [{ serviceId: service._id, qty: qty }],
      });

      if (result.data) {
        setVoucherDiscount(result.data.discount);
        setIsVoucherValid(true);
        iziToast.success({
          title: "Success",
          message: "Voucher applied successfully",
          position: "topRight",
          timeout: 3000,
        });
      } else {
        setVoucherDiscount(0);
        setIsVoucherValid(false);
        console.log(result);
        iziToast.error({
          title: "Error",
          message: result.error.data.message || "Invalid voucher",
          position: "topRight",
          timeout: 3000,
        });
      }
    } catch (error) {
      setVoucherDiscount(0);
      setIsVoucherValid(false);
      iziToast.error({
        title: "Error",
        message: error.message || "Failed to validate voucher",
        position: "topRight",
        timeout: 3000,
      });
    }
  };

  const buyHandler = () => {
    if (!isAuth) {
      return iziToast.error({
        title: "Error",
        message: "Please Login to order",
        position: "topRight",
        timeout: 3000,
      });
    }

    if (!user?.phone) {
      iziToast.error({
        title: "Error",
        message: "Please update your phone number in your profile",
        position: "topRight",
        timeout: 3000,
      });
      return navigate("/profile");
    }

    if (deliveryOption === "pickup_by_laundry" && !address) {
      return iziToast.error({
        title: "Error",
        message: "Please insert your address",
        position: "topRight",
        timeout: 3000,
      });
    }

    if (!deliveryOption || !paymentMethod) {
      return iziToast.error({
        title: "Error",
        message: "Please fill all required fields",
        position: "topRight",
        timeout: 3000,
      });
    }

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    const orderData = {
      orderId: newOrderId,
      services: [
        {
          serviceId: service?._id,
          qty: qty,
        },
      ],
      address: address,
      phone: user.phone,
      paymentMethod: paymentMethod,
      deliveryOption: deliveryOption,
      shippingCost: getDeliveryPrice(),
      voucherCode: isVoucherValid ? voucherCode : null,
    };

    createOrder(orderData)
      .unwrap()
      .then((result) => {
        if (paymentMethod.toLowerCase() === "cod") {
          // For COD, we don't need to process payment
          iziToast.success({
            title: "Success",
            message: "Order placed successfully with Cash on Delivery",
            position: "topRight",
            timeout: 3000,
          });
        } else {
          // For other payment methods, proceed with payment processing
          return getToken({ orderId: newOrderId }).unwrap();
        }
      })
      .then((paymentResult) => {
        if (paymentResult && paymentResult.token) {
          // Payment token received, proceed with Snap payment
          window.snap.pay(paymentResult.token, {
            onSuccess: (result) => {
              iziToast.success({
                title: "Success",
                message: "Payment successful",
                position: "topRight",
                timeout: 3000,
              });
              navigate("/");
            },
            onPending: (result) => {
              iziToast.info({
                title: "Pending",
                message: "Payment is pending",
                position: "topRight",
                timeout: 3000,
              });
            },
            onError: (error) => {
              iziToast.error({
                title: "Error",
                message: error.message || "Payment failed",
                position: "topRight",
                timeout: 3000,
              });
            },
            onClose: () => {
              iziToast.info({
                title: "Info",
                message: "You closed the payment window",
                position: "topRight",
                timeout: 3000,
              });
            },
          });
        }
      })
      .catch((error) => {
        iziToast.error({
          title: "Error",
          message: error.message|| error.data.error || "Failed to process order",
          position: "topRight",
          timeout: 3000,
        });
      });
  };

  const createOrderData = (paymentStatus = "pending") => {
    const data = {
      orderId: orderId,
      services: [
        {
          serviceId: service?._id,
          qty: qty,
        },
      ],
      address: address,
      phone: user.phone,
      paymentMethod: paymentMethod,
      deliveryOption: deliveryOption,
      shippingCost: getDeliveryPrice(),
      voucherCode: isVoucherValid ? voucherCode : null,
    };

    createOrder(data);
  };

  useEffect(() => {
    if (data?.token) {
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          createOrderData(result.transaction_status);
        },
        onPending: (result) => {
          createOrderData(result.transaction_status);
        },
        onError: (error) => {
          iziToast.error({
            title: "Error",
            message: error,
            position: "topRight",
            timeout: 3000,
          });
        },
        onClose: () => {
          iziToast.info({
            title: "Info",
            message: "Please complete the payment soon",
            position: "topRight",
            timeout: 3000,
          });
        },
      });
    }
  }, [data?.token]);

  useEffect(() => {
    const midtransScriptUrl = import.meta.env.VITE_MIDTRANS_URL;
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <Protect>
      <Box
        sx={{
          width: isMobile ? "100%" : isTablet ? "90%" : "80%",
          borderRadius: "10px",
          padding: isMobile ? "10px" : "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          height: "auto",
          minHeight: "auto",
          boxShadow: 4,
        }}
      >
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
          Adjust Quantity
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "15px",
            padding: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "15px",
              padding: "2px",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <IconButton onClick={decreaseQty} disabled={qty === 1}>
              <RemoveIcon />
            </IconButton>
            <Box
              sx={{
                width: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {qty}
            </Box>
            <IconButton onClick={increaseQty}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <Typography fontWeight="bold" fontSize={isMobile ? 16 : 18}>
            Subtotal
          </Typography>
          <Typography fontWeight="bold" fontSize={isMobile ? 18 : 20}>
            {`Rp ${parseFloat(subtotal).toLocaleString("id-ID")}`}
          </Typography>
        </Box>

        <TextField
          select
          label="Delivery Option"
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
          fullWidth
        >
          {deliveryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}{" "}
              {option.price > 0 &&
                `- Rp ${option.price.toLocaleString("id-ID")}`}
            </MenuItem>
          ))}
        </TextField>

        {deliveryOption === "pickup_by_laundry" && (
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        )}

        <TextField
          select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          fullWidth
        >
          {paymentMethods.map((method) => (
            <MenuItem key={method.value} value={method.value}>
              {method.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <TextField
            label="Voucher Code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleValidateVoucher}
            disabled={isValidatingVoucher}
          >
            {isValidatingVoucher ? "Validating..." : "Apply"}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <Typography fontWeight="bold" fontSize={isMobile ? 16 : 18}>
            Delivery Cost
          </Typography>
          <Typography fontWeight="bold" fontSize={isMobile ? 18 : 20}>
            {`Rp ${getDeliveryPrice().toLocaleString("id-ID")}`}
          </Typography>
        </Box>

        {isVoucherValid && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <Typography fontWeight="bold" fontSize={isMobile ? 16 : 18}>
              Voucher Discount
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={isMobile ? 18 : 20}
              color="green"
            >
              {`- Rp ${voucherDiscount.toLocaleString("id-ID")}`}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <Typography fontWeight="bold" fontSize={isMobile ? 16 : 18}>
            Total
          </Typography>
          <Typography fontWeight="bold" fontSize={isMobile ? 18 : 20}>
            {`Rp ${parseFloat(
              subtotal + getDeliveryPrice() - voucherDiscount
            ).toLocaleString("id-ID")}`}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={buyHandler}
        >
          {isLoading ? "Processing..." : "Order Now"}
        </Button>
      </Box>
    </Protect>
  );
};

export default Order;
