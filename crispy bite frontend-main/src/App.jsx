import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Menu from "./pages/public/Menu";
import FoodDetails from "./pages/public/FoodDetails";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetails from "./pages/customer/OrderDetails";
import TrackOrder from "./pages/customer/TrackOrder";
import StaffDashboard from "./pages/staff/StaffDashboard";
import IncomingOrders from "./pages/staff/IncomingOrders";
import ManageOrders from "./pages/staff/ManageOrders";
import StaffManageMenu from "./pages/staff/ManageMenu";
import AddMenuItem from "./pages/staff/AddMenuItem";
import EditMenuItem from "./pages/staff/EditMenuItem";
import RiderDashboard from "./pages/rider/RiderDashboard";
import AssignedDeliveries from "./pages/rider/AssignedDeliveries";
import DeliveryDetails from "./pages/rider/DeliveryDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminManageMenu from "./pages/admin/ManageMenu";
import AdminManageOrders from "./pages/admin/ManageOrders";
import ManageCategories from "./pages/admin/ManageCategories";

const App = () => (
  <BrowserRouter>
    {/* React Router maps URLs to screens. Nested routes reuse layouts and guard groups of pages. */}
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<FoodDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleBasedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/cart" element={<Cart />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/orders" element={<MyOrders />} />
            <Route path="/customer/orders/:id" element={<OrderDetails />} />
            <Route path="/customer/track/:id" element={<TrackOrder />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["staff"]} />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/incoming" element={<IncomingOrders />} />
            <Route path="/staff/orders" element={<ManageOrders />} />
            <Route path="/staff/menu" element={<StaffManageMenu />} />
            <Route path="/staff/menu/add" element={<AddMenuItem />} />
            <Route path="/staff/menu/:id/edit" element={<EditMenuItem />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["rider"]} />}>
            <Route path="/rider" element={<RiderDashboard />} />
            <Route path="/rider/deliveries" element={<AssignedDeliveries />} />
            <Route path="/rider/deliveries/:id" element={<DeliveryDetails />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/menu" element={<AdminManageMenu />} />
            <Route path="/admin/orders" element={<AdminManageOrders />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
