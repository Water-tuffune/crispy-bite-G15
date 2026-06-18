const express = require("express");
const { getOrderTracking } = require("../controllers/trackingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/order/:orderId", protect, getOrderTracking);

module.exports = router;
