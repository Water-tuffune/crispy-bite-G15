import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import CartItem from "../../components/CartItem";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { useState } from "react";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [message, setMessage] = useState("");

  const handleClear = async () => {
    if (window.confirm("Clear every item from your cart?")) {
      await clearCart();
      setMessage("Cart cleared.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1>Your Cart</h1>
      <AlertMessage type="success" message={message} />
      {!cart.items?.length ? (
        <div className="dashboard-card">
          <p>Your cart is empty.</p>
          <Link className="btn btn-danger" to="/menu">Browse Menu</Link>
        </div>
      ) : (
        <div className="dashboard-card">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} onUpdate={updateQuantity} onRemove={removeFromCart} />
          ))}
          <div className="d-flex justify-content-between align-items-center pt-3">
            <button className="btn btn-outline-danger" onClick={handleClear}>Clear Cart</button>
            <div className="text-end">
              <div className="h4">Total: {formatCurrency(cart.total)}</div>
              <Link className="btn btn-danger" to="/customer/checkout">Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
