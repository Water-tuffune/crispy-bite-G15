const db = require("../config/db");

const getOrderTracking = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ot.*, u.full_name AS updated_by_name
       FROM order_tracking ot
       LEFT JOIN users u ON u.id = ot.updated_by
       WHERE ot.order_id = ?
       ORDER BY ot.created_at ASC`,
      [req.params.orderId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load tracking history.", error: error.message });
  }
};

module.exports = { getOrderTracking };
