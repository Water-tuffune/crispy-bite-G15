import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { menuService } from "../../services/menuService";
import { formatCurrency } from "../../utils/formatCurrency";

const FoodDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    menuService.getItem(id).then((response) => setItem(response.data));
  }, [id]);

  const handleAdd = async () => {
    if (!user || user.role !== "customer") {
      setMessage("Log in with a customer account to add this item.");
      return;
    }
    await addToCart(item.id, 1);
    setMessage("Item added to cart.");
  };

  if (!item) return <main className="container py-5"><LoadingSpinner /></main>;

  return (
    <main className="container py-5">
      <AlertMessage type="success" message={message} />
      <div className="row g-4">
        <div className="col-md-6">
          <img className="img-fluid rounded" src={item.image || "https://placehold.co/700x500?text=CrispyBite"} alt={item.item_name} />
        </div>
        <div className="col-md-6">
          <div className="text-muted">{item.category_name}</div>
          <h1>{item.item_name}</h1>
          <p className="lead">{item.description}</p>
          <h2 className="h4">{formatCurrency(item.price)}</h2>
          <p>Preparation time: {item.preparation_time_minutes} minutes</p>
          <button className="btn btn-danger me-2" disabled={item.availability_status !== "available"} onClick={handleAdd}>Add to Cart</button>
          <Link className="btn btn-outline-dark" to="/menu">Back to Menu</Link>
        </div>
      </div>
    </main>
  );
};

export default FoodDetails;
