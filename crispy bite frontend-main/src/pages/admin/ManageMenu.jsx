import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import { menuService } from "../../services/menuService";
import { formatCurrency } from "../../utils/formatCurrency";

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ category_id: "", item_name: "", description: "", price: "", image: "", availability_status: "available", preparation_time_minutes: 15 });

  const load = async () => {
    const [menuResponse, categoryResponse] = await Promise.all([menuService.getMenu(), menuService.getCategories()]);
    setItems(menuResponse.data);
    setCategories(categoryResponse.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await menuService.createItem(form);
    setForm({ category_id: "", item_name: "", description: "", price: "", image: "", availability_status: "available", preparation_time_minutes: 15 });
    setMessage("Menu item created.");
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await menuService.deleteItem(id);
    setMessage("Menu item deleted.");
    load();
  };

  return (
    <>
      <h1>Admin Menu</h1>
      <AlertMessage type="success" message={message} />
      <form className="dashboard-card mb-4" onSubmit={create}>
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" placeholder="Item name" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          <div className="col-md-3">
            <select className="form-select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div className="col-md-2"><input className="form-control" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div className="col-md-2"><button className="btn btn-danger w-100">Add</button></div>
        </div>
        <textarea className="form-control mt-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </form>
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.category_name}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{item.availability_status}</td>
                <td><button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageMenu;
