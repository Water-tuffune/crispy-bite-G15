import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

const IncomingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await orderService.staffOrders();
    setOrders(response.data.filter((order) => order.order_status === "Pending"));
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, action) => {
    await orderService[action](id);
    setMessage(`Order ${action} updated.`);
    load();
  };

  return (
    <>
      <h1>Incoming Orders</h1>
      <AlertMessage type="success" message={message} />
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th className="table-actions">Actions</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td><OrderStatusBadge status={order.order_status} /></td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => update(order.id, "accept")}>Accept</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => update(order.id, "reject")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default IncomingOrders;
