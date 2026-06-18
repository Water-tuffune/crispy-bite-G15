import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { menuService } from "../../services/menuService";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ category_id: "", item_name: "", description: "", price: "", availability_status: "available", preparation_time_minutes: 15, image: null });

  useEffect(() => {
    menuService.getCategories().then((response) => setCategories(response.data));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => value !== null && data.append(key, value));
      await menuService.createItem(data);
      navigate("/staff/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add item.");
    }
  };

  return (
    <>
      <h1>Add Menu Item</h1>
      <AlertMessage type="danger" message={error} />
      <form className="dashboard-card" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">Item name</label>
            <input className="form-control mb-3" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select className="form-select mb-3" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Choose category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input className="form-control mb-3" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Preparation minutes</label>
            <input className="form-control mb-3" type="number" value={form.preparation_time_minutes} onChange={(e) => setForm({ ...form, preparation_time_minutes: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Availability</label>
            <select className="form-select mb-3" value={form.availability_status} onChange={(e) => setForm({ ...form, availability_status: e.target.value })}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
        <label className="form-label">Description</label>
        <textarea className="form-control mb-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="form-label">Food image</label>
        <input className="form-control mb-3" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
        <button className="btn btn-danger">Save Item</button>
      </form>
    </>
  );
};

export default AddMenuItem;
