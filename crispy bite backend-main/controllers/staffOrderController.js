const db = require("../config/db");
const { createTrackingRecord } = require("./orderController");

const updateOrderStatus = async (orderId, status, description, userId, extraFields = {}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const assignments = ["order_status = ?"];
    const params = [status];

    if (extraFields.rider_id) {
      assignments.push("rider_id = ?");
      params.push(extraFields.rider_id);
    }

    params.push(orderId);
    await connection.query(`UPDATE orders SET ${assignments.join(", ")} WHERE id = ?`, params);
    await createTrackingRecord(connection, orderId, status, description, userId);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getStaffOrders = async (req, res) => {
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
    res.status(500).json({ message: "Could not load staff orders.", error: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, "Accepted", "Restaurant accepted the order.", req.user.id);
    res.json({ message: "Order accepted." });
  } catch (error) {
    res.status(500).json({ message: "Could not accept order.", error: error.message });
  }
};

const rejectOrder = async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, "Rejected", "Restaurant rejected the order.", req.user.id);
    res.json({ message: "Order rejected." });
  } catch (error) {
    res.status(500).json({ message: "Could not reject order.", error: error.message });
  }
};

const markPreparing = async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, "Preparing", "Kitchen started preparing the food.", req.user.id);
    res.json({ message: "Order marked as preparing." });
  } catch (error) {
    res.status(500).json({ message: "Could not update order.", error: error.message });
  }
};

const markReady = async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, "Ready for Pickup", "Order is ready for pickup.", req.user.id);
    res.json({ message: "Order marked as ready." });
  } catch (error) {
    res.status(500).json({ message: "Could not update order.", error: error.message });
  }
};

const assignRider = async (req, res) => {
  try {
    const { rider_id } = req.body;
    if (!rider_id) return res.status(400).json({ message: "rider_id is required." });

    await updateOrderStatus(req.params.id, "Assigned to Rider", "Delivery rider assigned.", req.user.id, { rider_id });
    res.json({ message: "Rider assigned." });
  } catch (error) {
    res.status(500).json({ message: "Could not assign rider.", error: error.message });
  }
};

module.exports = { getStaffOrders, acceptOrder, rejectOrder, markPreparing, markReady, assignRider };
