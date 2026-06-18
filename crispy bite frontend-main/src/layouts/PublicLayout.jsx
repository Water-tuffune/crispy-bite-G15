import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => (
  <div className="app-shell">
    <Navbar />
    <Outlet />
  </div>
);

export default PublicLayout;
