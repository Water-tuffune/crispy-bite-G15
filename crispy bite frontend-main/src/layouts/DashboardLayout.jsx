import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardLayout = () => (
  <div className="app-shell bg-light">
    <Navbar />
    <main className="container py-4">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
