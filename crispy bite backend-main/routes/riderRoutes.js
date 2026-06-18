const express = require("express");
const { getRiderOrders, markPickedUp, markOnTheWay, markDelivered } = require("../controllers/riderController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("rider", "admin"));
router.get("/orders", getRiderOrders);
router.put("/orders/:id/picked-up", markPickedUp);
router.put("/orders/:id/on-the-way", markOnTheWay);
router.put("/orders/:id/delivered", markDelivered);

module.exports = router;
