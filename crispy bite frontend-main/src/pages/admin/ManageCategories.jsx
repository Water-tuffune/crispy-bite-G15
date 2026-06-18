import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import { menuService } from "../../services/menuService";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", description: "", status: "active" });

  const load = async () => {
    const response = await menuService.getCategories();
    setCategories(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await menuService.createCategory(form);
    setForm({ name: "", description: "", status: "active" });
    setMessage("Category created.");
    load();
  };

  const toggle = async (category) => {
    await menuService.updateCategory(category.id, { ...category, status: category.status === "active" ? "inactive" : "active" });
    setMessage("Category updated.");
    load();
  };

  return (
    <>
      <h1>Manage Categories</h1>
      <AlertMessage type="success" message={message} />
      <form className="dashboard-card mb-4" onSubmit={create}>
        <div className="row g-2">
          <div className="col-md-4"><input className="form-control" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="col-md-2"><button className="btn btn-danger w-100">Add</button></div>
        </div>
      </form>
      <div className="dashboard-card">
        {categories.map((category) => (
          <div className="d-flex justify-content-between align-items-center border-bottom py-2" key={category.id}>
            <div>
              <strong>{category.name}</strong>
              <div className="text-muted small">{category.description}</div>
            </div>
            <button className="btn btn-outline-dark btn-sm" onClick={() => toggle(category)}>{category.status}</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageCategories;
