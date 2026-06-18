const express = require("express");
const {
  getStaffOrders,
  acceptOrder,
  rejectOrder,
  markPreparing,
  markReady,
  assignRider
} = require("../controllers/staffOrderController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("staff", "admin"));
router.get("/orders", getStaffOrders);
router.put("/orders/:id/accept", acceptOrder);
router.put("/orders/:id/reject", rejectOrder);
router.put("/orders/:id/preparing", markPreparing);
router.put("/orders/:id/ready", markReady);
router.put("/orders/:id/assign-rider", assignRider);

module.exports = router;
