import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

const FoodCard = ({ item, onAddToCart }) => {
  const unavailable = item.availability_status !== "available";

  return (
    <div className="food-card">
      <img className="food-image" src={item.image || "https://placehold.co/600x400?text=CrispyBite"} alt={item.item_name} />
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <h5 className="mb-1">{item.item_name}</h5>
            <div className="text-muted small">{item.category_name}</div>
          </div>
          <strong>{formatCurrency(item.price)}</strong>
        </div>
        <p className="small text-muted mt-2 mb-3">{item.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className={`badge ${unavailable ? "text-bg-secondary" : "text-bg-success"}`}>{item.availability_status}</span>
          <div className="btn-group">
            <Link className="btn btn-outline-dark btn-sm" to={`/menu/${item.id}`}>
              Details
            </Link>
            {onAddToCart && (
              <button className="btn btn-danger btn-sm" disabled={unavailable} onClick={() => onAddToCart(item.id)}>
                <ShoppingCart size={16} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
