import { useEffect, useState } from "react";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminService.orders().then((response) => setOrders(response.data));
  }, []);

  return (
    <>
      <h1>All Orders</h1>
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Order</th><th>Customer</th><th>Rider</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{order.rider_name || "Not assigned"}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td>{formatDate(order.created_at)}</td>
                <td><OrderStatusBadge status={order.order_status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageOrders;
