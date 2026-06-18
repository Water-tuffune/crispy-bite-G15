import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user || user.role !== "customer") return;
    setLoading(true);
    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "customer") {
      loadCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [user?.id]);

  // CartContext centralizes cart changes so Menu, Cart, and Checkout stay synchronized.
  const addToCart = async (menuItemId, quantity = 1) => {
    await cartService.addItem({ menu_item_id: menuItemId, quantity });
    await loadCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await cartService.updateItem(cartItemId, { quantity });
    await loadCart();
  };

  const removeFromCart = async (cartItemId) => {
    await cartService.removeItem(cartItemId);
    await loadCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    await loadCart();
  };

  return (
    <CartContext.Provider value={{ cart, loading, loadCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
