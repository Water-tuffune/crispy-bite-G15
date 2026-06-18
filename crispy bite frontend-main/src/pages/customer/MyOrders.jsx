import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.myOrders().then((response) => setOrders(response.data));
  }, []);

  return (
    <>
      <h1>My Orders</h1>
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td><OrderStatusBadge status={order.order_status} /></td>
                <td><Link className="btn btn-outline-dark btn-sm" to={`/customer/orders/${order.id}`}>Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyOrders;
