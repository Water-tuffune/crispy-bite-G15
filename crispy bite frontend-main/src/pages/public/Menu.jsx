import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import FoodCard from "../../components/FoodCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { menuService } from "../../services/menuService";

const Menu = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ name: "", category: "", maxPrice: "", availability: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadMenu = async () => {
    setLoading(true);
    try {
      const response = await menuService.getMenu(filters);
      setItems(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    menuService.getCategories().then((response) => setCategories(response.data));
  }, []);

  useEffect(() => {
    loadMenu();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadMenu();
  };

  const handleAdd = async (id) => {
    if (!user) {
      setMessage("Please log in as a customer before adding items to cart.");
      return;
    }
    if (user.role !== "customer") {
      setMessage("Only customer accounts can add items to cart.");
      return;
    }
    await addToCart(id, 1);
    setMessage("Item added to cart.");
  };

  return (
    <main className="container py-5">
      <h1>Menu</h1>
      <AlertMessage type="success" message={message} />
      <form className="row g-2 align-items-end mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <label className="form-label">Search</label>
          <input className="form-control" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Max price</label>
          <input className="form-control" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
        <div className="col-md-2">
          <label className="form-label">Availability</label>
          <select className="form-select" value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
            <option value="">Any</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-danger w-100">Filter</button>
        </div>
      </form>
      {loading ? <LoadingSpinner /> : (
        <div className="row g-4">
          {items.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.id}>
              <FoodCard item={item} onAddToCart={handleAdd} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Menu;
