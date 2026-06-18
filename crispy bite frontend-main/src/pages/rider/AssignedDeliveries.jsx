import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";
import { formatDate } from "../../utils/formatDate";

const AssignedDeliveries = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.riderOrders().then((response) => setOrders(response.data));
  }, []);

  return (
    <>
      <h1>Assigned Deliveries</h1>
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Order</th><th>Customer</th><th>Address</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{order.area}, {order.street}</td>
                <td>{formatDate(order.created_at)}</td>
                <td><OrderStatusBadge status={order.order_status} /></td>
                <td><Link className="btn btn-outline-dark btn-sm" to={`/rider/deliveries/${order.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AssignedDeliveries;
