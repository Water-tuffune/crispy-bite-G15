import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { menuService } from "../../services/menuService";
import { formatCurrency } from "../../utils/formatCurrency";

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await menuService.getMenu();
    setItems(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await menuService.deleteItem(id);
    setMessage("Menu item deleted.");
    load();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Manage Menu</h1>
        <Link className="btn btn-danger" to="/staff/menu/add">Add Item</Link>
      </div>
      <AlertMessage type="success" message={message} />
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
                <td>
                  <Link className="btn btn-outline-dark btn-sm me-2" to={`/staff/menu/${item.id}/edit`}>Edit</Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => remove(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageMenu;
