import { Link, NavLink } from "react-router-dom";
import { LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const dashboardPath = {
    admin: "/admin",
    customer: "/customer",
    staff: "/staff",
    rider: "/rider"
  }[user?.role];

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-mark">CB</span>CrispyBite
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/menu">Menu</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            {dashboardPath && <NavLink className="nav-link" to={dashboardPath}>Dashboard</NavLink>}
            {user?.role === "staff" && <NavLink className="nav-link" to="/staff/orders">Orders</NavLink>}
            {user?.role === "rider" && <NavLink className="nav-link" to="/rider/deliveries">Deliveries</NavLink>}
            {user?.role === "admin" && <NavLink className="nav-link" to="/admin/users">Users</NavLink>}
          </div>
          <div className="navbar-nav align-items-lg-center gap-lg-2">
            {user?.role === "customer" && (
              <NavLink className="btn btn-outline-dark btn-sm" to="/customer/cart">
                <ShoppingCart size={16} /> Cart ({cart.items?.length || 0})
              </NavLink>
            )}
            {user ? (
              <>
                <span className="small text-muted">{user.full_name}</span>
                <button className="btn btn-danger btn-sm" onClick={logout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">Login</NavLink>
                <NavLink className="btn btn-danger btn-sm" to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
