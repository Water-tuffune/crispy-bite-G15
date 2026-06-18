import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  const loadOrder = async () => {
    const response = await orderService.getOrder(id);
    setOrder(response.data);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    await orderService.cancelOrder(id);
    setMessage("Order cancelled.");
    loadOrder();
  };

  if (!order) return <LoadingSpinner />;

  return (
    <>
      <h1>{order.order_number}</h1>
      <AlertMessage type="success" message={message} />
      <div className="dashboard-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <OrderStatusBadge status={order.order_status} />
          <strong>{formatCurrency(order.total_amount)}</strong>
        </div>
        <p className="mt-3 mb-0">Type: {order.order_type} | Payment: {order.payment_method}</p>
        {order.order_type === "delivery" && <p className="mb-0">Address: {order.area}, {order.street}, {order.district}</p>}
      </div>
      <div className="dashboard-card mb-3">
        <h2 className="h5">Items</h2>
        {order.items.map((item) => (
          <div className="d-flex justify-content-between border-bottom py-2" key={item.id}>
            <span>{item.quantity} x {item.item_name}</span>
            <strong>{formatCurrency(item.subtotal)}</strong>
          </div>
        ))}
      </div>
      <Link className="btn btn-outline-dark me-2" to={`/customer/track/${order.id}`}>Track Order</Link>
      {["Pending", "Accepted"].includes(order.order_status) && <button className="btn btn-outline-danger" onClick={handleCancel}>Cancel Order</button>}
    </>
  );
};

export default OrderDetails;
