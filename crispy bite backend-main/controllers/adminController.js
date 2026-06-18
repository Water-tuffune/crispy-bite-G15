const db = require("../config/db");

const getStats = async (req, res) => {
  try {
    const [[totals]] = await db.query(
      `SELECT
        COUNT(*) AS total_orders,
        SUM(order_status = 'Pending') AS pending_orders,
        SUM(order_status = 'Preparing') AS preparing_orders,
        SUM(order_status = 'Delivered') AS delivered_orders,
        COALESCE(SUM(CASE WHEN order_status IN ('Delivered', 'Completed') THEN total_amount ELSE 0 END), 0) AS total_sales
       FROM orders`
    );
    const [popular] = await db.query(
      `SELECT mi.item_name, SUM(oi.quantity) AS total_sold
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       GROUP BY mi.id, mi.item_name
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    res.json({ ...totals, popular_items: popular });
  } catch (error) {
    res.status(500).json({ message: "Could not load stats.", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, full_name, email, phone, role, status, created_at, updated_at FROM users ORDER BY created_at DESC"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Could not load users.", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.full_name AS customer_name, r.full_name AS rider_name
       FROM orders o
       JOIN users u ON u.id = o.customer_id
       LEFT JOIN users r ON r.id = o.rider_id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders.", error: error.message });
  }
};

const getAdminMenu = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT mi.*, mc.name AS category_name
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       ORDER BY mi.created_at DESC`
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Could not load menu.", error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: "User status updated." });
  } catch (error) {
    res.status(500).json({ message: "Could not update user.", error: error.message });
  }
};

module.exports = { getStats, getUsers, getOrders, getAdminMenu, updateUserStatus };
