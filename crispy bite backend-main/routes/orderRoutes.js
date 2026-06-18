const express = require("express");
const { placeOrder, getMyOrders, getOrderById, cancelOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", allowRoles("customer"), placeOrder);
router.get("/my-orders", allowRoles("customer"), getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", allowRoles("customer"), cancelOrder);

module.exports = router;
