const db = require("../config/db");
const { getOrCreateCart } = require("./cartController");

const createTrackingRecord = async (connection, orderId, status, description, updatedBy) => {
  // Every status change inserts a new row, so students can query the full tracking history later.
  await connection.query(
    "INSERT INTO order_tracking (order_id, status, description, updated_by) VALUES (?, ?, ?, ?)",
    [orderId, status, description, updatedBy]
  );
};

const createOrderNumber = () => `QB-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

const placeOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      order_type,
      payment_method,
      customer_notes,
      district,
      area,
      street,
      landmark,
      phone
    } = req.body;

    await connection.beginTransaction();
    const cart = await getOrCreateCart(req.user.id);
    const [cartItems] = await connection.query(
      `SELECT ci.menu_item_id, ci.quantity, mi.price, mi.item_name
       FROM cart_items ci
       JOIN menu_items mi ON mi.id = ci.menu_item_id
       WHERE ci.cart_id = ? AND mi.availability_status = 'available'`,
      [cart.id]
    );

    if (!cartItems.length) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart is empty or items are unavailable." });
    }

    let deliveryAddressId = null;
    if (order_type === "delivery") {
      const [addressResult] = await connection.query(
        `INSERT INTO delivery_addresses (customer_id, district, area, street, landmark, phone)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, district, area, street, landmark || "", phone || req.user.phone]
      );
      deliveryAddressId = addressResult.insertId;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (customer_id, order_number, order_type, delivery_address_id, total_amount, payment_method, payment_status, order_status, customer_notes)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 'Pending', ?)`,
      [
        req.user.id,
        createOrderNumber(),
        order_type || "pickup",
        deliveryAddressId,
        totalAmount,
        payment_method || "cash",
        customer_notes || ""
      ]
    );

    const orderId = orderResult.insertId;
    for (const item of cartItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity, item.price, Number(item.price) * item.quantity]
      );
    }

    await connection.query(
      "INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_reference) VALUES (?, ?, ?, 'pending', ?)",
      [orderId, totalAmount, payment_method || "cash", `PAY-${Date.now()}`]
    );
    await createTrackingRecord(connection, orderId, "Pending", "Order placed by customer.", req.user.id);
    await connection.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
    await connection.commit();

    res.status(201).json({ message: "Order placed successfully.", order_id: orderId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Could not place order.", error: error.message });
  } finally {
    connection.release();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders.", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.full_name AS customer_name, r.full_name AS rider_name, da.district, da.area, da.street, da.landmark, da.phone AS delivery_phone
       FROM orders o
       JOIN users u ON u.id = o.customer_id
       LEFT JOIN users r ON r.id = o.rider_id
       LEFT JOIN delivery_addresses da ON da.id = o.delivery_address_id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (!orders.length) return res.status(404).json({ message: "Order not found." });

    const order = orders[0];
    const canView =
      req.user.role === "admin" ||
      req.user.role === "staff" ||
      order.customer_id === req.user.id ||
      order.rider_id === req.user.id;

    if (!canView) return res.status(403).json({ message: "You cannot view this order." });

    const [items] = await db.query(
      `SELECT oi.*, mi.item_name, mi.image
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: "Could not load order.", error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [orders] = await connection.query(
      "SELECT * FROM orders WHERE id = ? AND customer_id = ?",
      [req.params.id, req.user.id]
    );

    if (!orders.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Order not found." });
    }

    if (!["Pending", "Accepted"].includes(orders[0].order_status)) {
      await connection.rollback();
      return res.status(400).json({ message: "Order cannot be cancelled after preparation starts." });
    }

    await connection.query("UPDATE orders SET order_status = 'Cancelled' WHERE id = ?", [req.params.id]);
    await createTrackingRecord(connection, req.params.id, "Cancelled", "Customer cancelled the order.", req.user.id);
    await connection.commit();
    res.json({ message: "Order cancelled." });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Could not cancel order.", error: error.message });
  } finally {
    connection.release();
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, cancelOrder, createTrackingRecord };
