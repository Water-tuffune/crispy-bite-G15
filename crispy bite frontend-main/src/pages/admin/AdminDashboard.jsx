import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.stats().then((response) => setStats(response.data));
  }, []);

  if (!stats) return null;

  return (
    <>
      <h1>Admin Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-2"><div className="dashboard-card"><div className="text-muted">Orders</div><strong className="h3">{stats.total_orders}</strong></div></div>
        <div className="col-md-2"><div className="dashboard-card"><div className="text-muted">Pending</div><strong className="h3">{stats.pending_orders}</strong></div></div>
        <div className="col-md-2"><div className="dashboard-card"><div className="text-muted">Preparing</div><strong className="h3">{stats.preparing_orders}</strong></div></div>
        <div className="col-md-2"><div className="dashboard-card"><div className="text-muted">Delivered</div><strong className="h3">{stats.delivered_orders}</strong></div></div>
        <div className="col-md-4"><div className="dashboard-card"><div className="text-muted">Sales</div><strong className="h3">{formatCurrency(stats.total_sales)}</strong></div></div>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Link className="btn btn-danger" to="/admin/users">Manage Users</Link>
        <Link className="btn btn-outline-dark" to="/admin/menu">Manage Menu</Link>
        <Link className="btn btn-outline-dark" to="/admin/orders">Manage Orders</Link>
        <Link className="btn btn-outline-dark" to="/admin/categories">Categories</Link>
      </div>
      <div className="dashboard-card">
        <h2 className="h5">Popular Menu Items</h2>
        {stats.popular_items?.map((item) => (
          <div className="d-flex justify-content-between border-bottom py-2" key={item.item_name}>
            <span>{item.item_name}</span>
            <strong>{item.total_sold}</strong>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminDashboard;
