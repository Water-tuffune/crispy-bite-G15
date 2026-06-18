const db = require("../config/db");

const getOrCreateCart = async (customerId) => {
  const [existing] = await db.query("SELECT * FROM carts WHERE customer_id = ?", [customerId]);
  if (existing.length) return existing[0];

  const [result] = await db.query("INSERT INTO carts (customer_id) VALUES (?)", [customerId]);
  return { id: result.insertId, customer_id: customerId };
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const [items] = await db.query(
      `SELECT ci.*, mi.item_name, mi.price, mi.image, mi.availability_status, mc.name AS category_name,
              (ci.quantity * mi.price) AS subtotal
       FROM cart_items ci
       JOIN menu_items mi ON mi.id = ci.menu_item_id
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       WHERE ci.cart_id = ?
       ORDER BY ci.created_at DESC`,
      [cart.id]
    );

    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    res.json({ cart, items, total });
  } catch (error) {
    res.status(500).json({ message: "Could not load cart.", error: error.message });
  }
};

const addCartItem = async (req, res) => {
  try {
    const { menu_item_id, quantity } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    const [existing] = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
      [cart.id, menu_item_id]
    );

    if (existing.length) {
      await db.query("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [
        Number(quantity || 1),
        existing[0].id
      ]);
    } else {
      await db.query("INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES (?, ?, ?)", [
        cart.id,
        menu_item_id,
        Number(quantity || 1)
      ]);
    }

    res.status(201).json({ message: "Item added to cart." });
  } catch (error) {
    res.status(500).json({ message: "Could not add item to cart.", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const safeQuantity = Math.max(Number(quantity || 1), 1);
    await db.query(
      `UPDATE cart_items ci
       JOIN carts c ON c.id = ci.cart_id
       SET ci.quantity = ?
       WHERE ci.id = ? AND c.customer_id = ?`,
      [safeQuantity, req.params.id, req.user.id]
    );

    res.json({ message: "Cart item updated." });
  } catch (error) {
    res.status(500).json({ message: "Could not update cart item.", error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await db.query(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON c.id = ci.cart_id
       WHERE ci.id = ? AND c.customer_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({ message: "Cart item removed." });
  } catch (error) {
    res.status(500).json({ message: "Could not remove cart item.", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
    res.json({ message: "Cart cleared." });
  } catch (error) {
    res.status(500).json({ message: "Could not clear cart.", error: error.message });
  }
};

module.exports = { getCart, addCartItem, updateCartItem, deleteCartItem, clearCart, getOrCreateCart };
