const express = require("express");
const { getStats, getUsers, getOrders, getAdminMenu, updateUserStatus } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/orders", getOrders);
router.get("/menu", getAdminMenu);
router.put("/users/:id/status", updateUserStatus);

module.exports = router;
