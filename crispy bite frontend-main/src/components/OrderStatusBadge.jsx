const colors = {
  Pending: "secondary",
  Accepted: "primary",
  Rejected: "dark",
  Preparing: "warning",
  "Ready for Pickup": "info",
  "Assigned to Rider": "primary",
  "Picked Up": "info",
  "On the Way": "warning",
  Delivered: "success",
  Completed: "success",
  Cancelled: "danger"
};

const OrderStatusBadge = ({ status }) => (
  <span className={`badge text-bg-${colors[status] || "secondary"}`}>{status}</span>
);

export default OrderStatusBadge;
