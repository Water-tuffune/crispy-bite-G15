export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "UGX" }).format(Number(amount || 0));
