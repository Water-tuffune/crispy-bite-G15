import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { menuService } from "../../services/menuService";

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);

  useEffect(() => {
    menuService.getCategories().then((response) => setCategories(response.data));
    menuService.getItem(id).then((response) => setForm({ ...response.data, imageFile: null }));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = new FormData();
      ["category_id", "item_name", "description", "price", "availability_status", "preparation_time_minutes"].forEach((key) => data.append(key, form[key]));
      if (form.imageFile) data.append("image", form.imageFile);
      await menuService.updateItem(id, data);
      navigate("/staff/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update item.");
    }
  };

  if (!form) return <LoadingSpinner />;

  return (
    <>
      <h1>Edit Menu Item</h1>
      <AlertMessage type="danger" message={error} />
      <form className="dashboard-card" onSubmit={handleSubmit}>
        <label className="form-label">Item name</label>
        <input className="form-control mb-3" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
        <label className="form-label">Category</label>
        <select className="form-select mb-3" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <label className="form-label">Price</label>
        <input className="form-control mb-3" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <label className="form-label">Availability</label>
        <select className="form-select mb-3" value={form.availability_status} onChange={(e) => setForm({ ...form, availability_status: e.target.value })}>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <label className="form-label">Preparation minutes</label>
        <input className="form-control mb-3" type="number" value={form.preparation_time_minutes} onChange={(e) => setForm({ ...form, preparation_time_minutes: e.target.value })} />
        <label className="form-label">Description</label>
        <textarea className="form-control mb-3" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="form-label">Replace image</label>
        <input className="form-control mb-3" type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })} />
        <button className="btn btn-danger">Update Item</button>
      </form>
    </>
  );
};

export default EditMenuItem;
