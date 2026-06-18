import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

const Checkout = () => {
  const { cart, loadCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    order_type: "pickup",
    payment_method: "cash",
    customer_notes: "",
    district: "",
    area: "",
    street: "",
    landmark: "",
    phone: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await orderService.placeOrder(form);
      await loadCart();
      navigate(`/customer/orders/${response.data.order_id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <>
      <h1>Checkout</h1>
      <AlertMessage type="danger" message={error} />
      <div className="row g-4">
        <div className="col-lg-7">
          <form className="dashboard-card" onSubmit={handleSubmit}>
            <label className="form-label">Order type</label>
            <select className="form-select mb-3" value={form.order_type} onChange={(e) => setForm({ ...form, order_type: e.target.value })}>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
            {form.order_type === "delivery" && (
              <div className="row">
                {["district", "area", "street", "landmark", "phone"].map((field) => (
                  <div className="col-md-6" key={field}>
                    <label className="form-label text-capitalize">{field.replace("_", " ")}</label>
                    <input className="form-control mb-3" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                  </div>
                ))}
              </div>
            )}
            <label className="form-label">Payment method</label>
            <select className="form-select mb-3" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile money</option>
              <option value="card">Card</option>
            </select>
            <label className="form-label">Customer notes</label>
            <textarea className="form-control mb-3" value={form.customer_notes} onChange={(e) => setForm({ ...form, customer_notes: e.target.value })} />
            <button className="btn btn-danger" disabled={!cart.items?.length}>Place Order</button>
          </form>
        </div>
        <div className="col-lg-5">
          <div className="dashboard-card">
            <h2 className="h5">Order Summary</h2>
            {cart.items?.map((item) => (
              <div className="d-flex justify-content-between border-bottom py-2" key={item.id}>
                <span>{item.quantity} x {item.item_name}</span>
                <strong>{formatCurrency(item.subtotal)}</strong>
              </div>
            ))}
            <div className="h4 text-end mt-3">{formatCurrency(cart.total)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
