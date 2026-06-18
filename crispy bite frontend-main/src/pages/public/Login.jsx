import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "customer@crispybite.test", password: "password123" });
  const [error, setError] = useState("");

  const dashboards = { admin: "/admin", customer: "/customer", staff: "/staff", rider: "/rider" };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      // Form submit handlers call service/context methods, then redirect based on the returned role.
      const user = await login(form.email, form.password);
      navigate(dashboards[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <h1>Login</h1>
      <AlertMessage type="danger" message={error} />
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="form-label">Password</label>
        <input className="form-control mb-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-danger w-100">Login</button>
      </form>
      <p className="mt-3">Need an account? <Link to="/register">Register</Link></p>
    </main>
  );
};

export default Login;
