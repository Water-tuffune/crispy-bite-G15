import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.staffOrders().then((response) => setOrders(response.data));
  }, []);

  const count = (status) => orders.filter((order) => order.order_status === status).length;

  return (
    <>
      <h1>Staff Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="dashboard-card"><div className="text-muted">Pending</div><strong className="h3">{count("Pending")}</strong></div></div>
        <div className="col-md-3"><div className="dashboard-card"><div className="text-muted">Preparing</div><strong className="h3">{count("Preparing")}</strong></div></div>
        <div className="col-md-3"><div className="dashboard-card"><div className="text-muted">Ready</div><strong className="h3">{count("Ready for Pickup")}</strong></div></div>
        <div className="col-md-3"><div className="dashboard-card"><div className="text-muted">Completed</div><strong className="h3">{count("Completed") + count("Delivered")}</strong></div></div>
      </div>
      <div className="d-flex gap-2">
        <Link className="btn btn-danger" to="/staff/incoming">Incoming Orders</Link>
        <Link className="btn btn-outline-dark" to="/staff/orders">Manage Orders</Link>
        <Link className="btn btn-outline-dark" to="/staff/menu">Manage Menu</Link>
      </div>
    </>
  );
};

export default StaffDashboard;
