import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [riderId, setRiderId] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await orderService.staffOrders();
    setOrders(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, action) => {
    await orderService[action](id);
    setMessage("Order status updated.");
    load();
  };

  const assign = async (id) => {
    if (!riderId) {
      setMessage("Enter a rider ID first. Seed rider IDs are 7 and 8.");
      return;
    }
    await orderService.assignRider(id, riderId);
    setMessage("Rider assigned.");
    load();
  };

  return (
    <>
      <h1>Manage Orders</h1>
      <AlertMessage type="success" message={message} />
      <div className="mb-3" style={{ maxWidth: 260 }}>
        <label className="form-label">Rider ID for assignment</label>
        <input className="form-control" value={riderId} onChange={(e) => setRiderId(e.target.value)} placeholder="Example: 7" />
      </div>
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Rider</th><th className="table-actions">Actions</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td><OrderStatusBadge status={order.order_status} /></td>
                <td>{order.rider_name || "Not assigned"}</td>
                <td>
                  <div className="btn-group btn-group-sm flex-wrap">
                    <button className="btn btn-outline-primary" onClick={() => updateStatus(order.id, "preparing")}>Preparing</button>
                    <button className="btn btn-outline-info" onClick={() => updateStatus(order.id, "ready")}>Ready</button>
                    <button className="btn btn-outline-dark" onClick={() => assign(order.id)}>Assign Rider</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageOrders;
