import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/customer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 560 }}>
      <h1>Create Customer Account</h1>
      <AlertMessage type="danger" message={error} />
      <form onSubmit={handleSubmit}>
        <label className="form-label">Full name</label>
        <input className="form-control mb-3" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="form-label">Phone</label>
        <input className="form-control mb-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <label className="form-label">Password</label>
        <input className="form-control mb-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-danger w-100">Register</button>
      </form>
      <p className="mt-3">Already registered? <Link to="/login">Login</Link></p>
    </main>
  );
};

export default Register;
