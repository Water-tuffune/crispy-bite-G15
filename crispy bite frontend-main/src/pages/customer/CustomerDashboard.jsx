import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.myOrders().then((response) => setOrders(response.data));
  }, []);

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

  return (
    <>
      <h1>Customer Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">Orders</div><strong className="h3">{orders.length}</strong></div></div>
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">Total spent</div><strong className="h3">{formatCurrency(totalSpent)}</strong></div></div>
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">Active orders</div><strong className="h3">{orders.filter((o) => !["Delivered", "Completed", "Cancelled"].includes(o.order_status)).length}</strong></div></div>
      </div>
      <div className="d-flex gap-2 mb-3">
        <Link className="btn btn-danger" to="/menu">Order Food</Link>
        <Link className="btn btn-outline-dark" to="/customer/orders">View Orders</Link>
      </div>
      <h2 className="h4">Recent Orders</h2>
      <div className="list-group">
        {orders.slice(0, 5).map((order) => (
          <Link key={order.id} className="list-group-item list-group-item-action d-flex justify-content-between" to={`/customer/orders/${order.id}`}>
            <span>{order.order_number}</span>
            <OrderStatusBadge status={order.order_status} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default CustomerDashboard;
