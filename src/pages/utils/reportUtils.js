export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const downloadReport = (filteredOrders, startDate, endDate) => {
  console.log(filteredOrders);
  const csvContent = generateCSVContent(filteredOrders, startDate, endDate);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `report_${startDate.toISOString().split("T")[0]}_${
        endDate.toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const generateCSVContent = (orders, startDate, endDate) => {
  const headers = [
    "No",
    "Order ID",
    "Tanggal",
    "Pelanggan",
    "Produk",
    "Jumlah",
    "Harga",
    "Diskon",
    "Ongkir",
    "Total Harga",
    "Profit",
  ];

  if (!orders || orders.length === 0) {
    console.log("No orders to process");
    return headers.join(",");
  }

  const rows = orders.flatMap((order, index) => {
    return order.services.map((service, serviceIndex) => {
      return [
        index + 1,
        order.orderId,
        formatDate(order.createdAt),
        order.user.name,
        `${service.serviceId.name} (${service.serviceId.category})`,
        service.qty,
        (service.serviceId.price * service.qty).toFixed(2),
        serviceIndex === 0 ? order.discount.toFixed(2) : "", // Diskon hanya pada baris pertama
        serviceIndex === 0 ? order.shippingCost.toFixed(2) : "", // Ongkir hanya pada baris pertama
        serviceIndex === 0 ? order.total.toFixed(2) : "", // Total harga hanya pada baris pertama
        (service.serviceId.profit * service.qty).toFixed(2),
      ];
    });
  });

  let csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = orders.reduce(
    (sum, order) => sum + calculateOrderProfit(order),
    0
  );

  csvContent += `\n\nTanggal:,${formatDate(startDate)} - ${formatDate(
    endDate
  )}`;
  csvContent += `\nPendapatan:,${totalRevenue.toFixed(2)}`;
  csvContent += `\nProfit:,${totalProfit.toFixed(2)}`;
  csvContent += `\nJumlah Transaksi:,${orders.length}`;

  return csvContent;
};

const calculateOrderProfit = (order) => {
  return order.services.reduce((totalProfit, service) => {
    return totalProfit + service.serviceId.profit * service.qty;
  }, 0);
};