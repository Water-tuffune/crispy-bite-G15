const db = require("../config/db");
const { createTrackingRecord } = require("./orderController");

const getRiderOrders = async (req, res) => {
  try {
    const params = req.user.role === "admin" ? [] : [req.user.id];
    const where = req.user.role === "admin" ? "" : "WHERE o.rider_id = ?";
    const [orders] = await db.query(
      `SELECT o.*, u.full_name AS customer_name, da.district, da.area, da.street, da.landmark, da.phone AS delivery_phone
       FROM orders o
       JOIN users u ON u.id = o.customer_id
       LEFT JOIN delivery_addresses da ON da.id = o.delivery_address_id
       ${where}
       ORDER BY o.created_at DESC`,
      params
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load rider orders.", error: error.message });
  }
};

const updateDeliveryStatus = async (req, res, status, description) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const params = [status, req.params.id];
    let riderClause = "";

    if (req.user.role !== "admin") {
      riderClause = " AND rider_id = ?";
      params.push(req.user.id);
    }

    const [result] = await connection.query(
      `UPDATE orders SET order_status = ? WHERE id = ?${riderClause}`,
      params
    );

    if (!result.affectedRows) {
      await connection.rollback();
      return res.status(404).json({ message: "Assigned order not found." });
    }

    const note = req.body.delivery_notes ? `${description} Notes: ${req.body.delivery_notes}` : description;
    await createTrackingRecord(connection, req.params.id, status, note, req.user.id);
    await connection.commit();
    res.json({ message: `Order marked as ${status}.` });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Could not update delivery status.", error: error.message });
  } finally {
    connection.release();
  }
};

const markPickedUp = (req, res) =>
  updateDeliveryStatus(req, res, "Picked Up", "Rider picked up the order from the restaurant.");

const markOnTheWay = (req, res) =>
  updateDeliveryStatus(req, res, "On the Way", "Rider is on the way to the customer.");

const markDelivered = (req, res) =>
  updateDeliveryStatus(req, res, "Delivered", "Order was delivered to the customer.");

module.exports = { getRiderOrders, markPickedUp, markOnTheWay, markDelivered };
