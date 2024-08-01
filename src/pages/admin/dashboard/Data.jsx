import { Box, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DiscountIcon from '@mui/icons-material/Discount';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import "./style.css";

const Data = ({ orders, products, users, vouchers }) => {
  // Calculate derived data
  const totalOrders = orders.length;
  const completeOrders = orders.filter(order => order.orderStatus === 'finished').length;
  const totalSells = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = orders.reduce((sum, order) => {
    return sum + order.services.reduce((serviceSum, service) => {
      return serviceSum + (service.serviceId.profit * service.qty);
    }, 0);
  }, 0);

  return (
    <Box className="layout">
      <Paper className="paper" sx={{ bgcolor: "#62FF31" }}>
        <GroupIcon className="icon" sx={{ fontSize: { xs: 35, md: 50 } }} />
        <Box sx={{ width: 120 }}>
          <Typography>Pelanggan</Typography>
          <Typography>{users.length}</Typography>
        </Box>
      </Paper>

      <Paper className="paper" sx={{ bgcolor: "#606DFF" }}>
        <LocalLaundryServiceIcon className="icon" sx={{ fontSize: { xs: 35, md: 50 } }} />
        <Box sx={{ width: 120 }}>
          <Typography>Layanan</Typography>
          <Typography>{products.length}</Typography>
        </Box>
      </Paper>

      <Paper className="paper" sx={{ bgcolor: "#3498DB" }}>
        <DiscountIcon className="icon" sx={{ fontSize: { xs: 35, md: 50 } }} />
        <Box sx={{ width: 120 }}>
          <Typography>Voucher</Typography>
          <Typography>{vouchers.vouchers.length}</Typography>
        </Box>
      </Paper>

      <Paper className="paper" sx={{ bgcolor: "#FF9440" }}>
        <ReceiptLongIcon
          className="icon"
          sx={{ fontSize: { xs: 35, md: 50 } }}
        />
        <Box sx={{ width: 120 }}>
          <Typography>Total Transaksi</Typography>
          <Typography>{totalOrders}</Typography>
        </Box>
      </Paper>

      <Paper className="paper" sx={{ bgcolor: "#FDB0AF" }}>
        <PaidIcon
          className="icon"
          sx={{ fontSize: { xs: 35, md: 50 } }}
        />
        <Box sx={{ width: 120 }}>
          <Typography>Transaksi Berhasil</Typography>
          <Typography>{completeOrders}</Typography>
        </Box>
      </Paper>

      <Paper className="paper" sx={{ bgcolor: "#88FEFF" }}>
        <AccountBalanceIcon
          className="icon"
          sx={{ fontSize: { xs: 35, md: 50 } }}
        />
        <Box sx={{ width: 120 }}>
          <Typography>Penjualan</Typography>
          <Typography>
            Rp {totalSells.toLocaleString("id-ID")}
          </Typography>
        </Box>
      </Paper>

      <Paper className="paper" sx={{ bgcolor: "#39FF83" }}>
        <MonetizationOnIcon
          className="icon"
          sx={{ fontSize: { xs: 35, md: 50 } }}
        />
        <Box sx={{ width: 120 }}>
          <Typography>Profit</Typography>
          <Typography>
            Rp {totalProfit.toLocaleString("id-ID")}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Data;