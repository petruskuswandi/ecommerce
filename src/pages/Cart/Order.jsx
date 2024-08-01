import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import iziToast from "izitoast";
import { useGetTokenMutation } from "../../state/api/paymentApi";
import { useCreateOrderFromCartMutation } from "../../state/api/orderApi";
import { useValidateVoucherMutation } from "../../state/api/voucherApi.js";
import Protect from "../user/Protect.jsx";

function generateOrderId() {
  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`;
}

const Order = ({ cart }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const [getToken, { isLoading, data }] = useGetTokenMutation();
  const [createOrderFromCart, { isSuccess, reset }] =
    useCreateOrderFromCartMutation();
  const [validateVoucher, { isLoading: isValidatingVoucher }] =
    useValidateVoucherMutation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [subtotal, setSubtotal] = useState(0);
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

  const checkedServices =
    cart?.services?.filter((item) => item.isChecked) || [];

  useEffect(() => {
    if (cart && cart.services) {
      const newSubtotal = cart.services
        .filter((item) => item.isChecked)
        .reduce((sum, item) => sum + item.serviceId.price * item.qty, 0);
      setSubtotal(newSubtotal);
    }
  }, [cart]);

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
        services: checkedServices.map((item) => ({
          serviceId: item.serviceId._id,
          qty: item.qty,
        })),
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

  const total = subtotal + getDeliveryPrice() - voucherDiscount;

  const buyHandler = () => {
    if (!isAuth) {
      return iziToast.error({
        title: "Error",
        message: "Please login to order",
        position: "topRight",
        timeout: 3000,
      });
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
      address: address,
      phone: user?.phone,
      paymentMethod: paymentMethod,
      deliveryOption: deliveryOption,
      shippingCost: getDeliveryPrice(),
      selectedServices: checkedServices.map((item) => item.serviceId._id),
      total: total,
      voucherCode: isVoucherValid ? voucherCode : null,
      discount: voucherDiscount,
    };

    createOrderFromCart(orderData)
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
          // Initiate Midtrans payment
          window.snap.pay(paymentResult.token, {
            onSuccess: (result) => {
              iziToast.success({
                title: "Success",
                message: "Payment successful",
                position: "topRight",
                timeout: 3000,
              });
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
        console.log(error);
        iziToast.error({
          title: "Error",
          message: error.message || error.data.error || "Failed to create order",
          position: "topRight",
          timeout: 3000,
        });
      });
  };

  useEffect(() => {
    if (data?.token) {
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          createOrderFromCart(result.transaction_status);
        },
        onPending: (result) => {
          createOrderFromCart(result.transaction_status);
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
          Buat Pesanan
        </Typography>

        {checkedServices.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Layanan yang Dipilih:
            </Typography>
            <List dense>
              {checkedServices.map((item) => (
                <ListItem key={item.serviceId._id}>
                  <ListItemText
                    primary={item.serviceId.name}
                    secondary={`${
                      item.qty
                    } x Rp ${item.serviceId.price.toLocaleString("id-ID")}`}
                  />
                  <Typography>
                    Rp{" "}
                    {(item.qty * item.serviceId.price).toLocaleString("id-ID")}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Tidak ada layanan yang dipilih.
          </Typography>
        )}

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
            label="Alamat"
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
            Biaya Pengiriman
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
            {`Rp ${parseFloat(total).toLocaleString("id-ID")}`}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
          onClick={buyHandler}
          disabled={checkedServices.length === 0 || isLoading}
        >
          {isLoading ? "Memproses..." : "SELESAIKAN PEMBAYARAN"}
        </Button>
      </Box>
    </Protect>
  );
};

export default Order;
