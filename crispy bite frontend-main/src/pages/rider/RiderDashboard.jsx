import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";

const RiderDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.riderOrders().then((response) => setOrders(response.data));
  }, []);

  return (
    <>
      <h1>Rider Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">Assigned</div><strong className="h3">{orders.length}</strong></div></div>
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">On the way</div><strong className="h3">{orders.filter((o) => o.order_status === "On the Way").length}</strong></div></div>
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">Delivered</div><strong className="h3">{orders.filter((o) => o.order_status === "Delivered").length}</strong></div></div>
      </div>
      <div className="list-group">
        {orders.slice(0, 5).map((order) => (
          <Link className="list-group-item list-group-item-action d-flex justify-content-between" key={order.id} to={`/rider/deliveries/${order.id}`}>
            <span>{order.order_number} - {order.customer_name}</span>
            <OrderStatusBadge status={order.order_status} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default RiderDashboard;
