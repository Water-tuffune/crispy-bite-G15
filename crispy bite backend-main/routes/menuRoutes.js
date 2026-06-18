const express = require("express");
const {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createCategory,
  updateCategory
} = require("../controllers/menuController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { uploadFoodImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/menu", getMenu);
router.get("/menu/:id", getMenuItem);
router.post("/menu", protect, allowRoles("admin", "staff"), uploadFoodImage.single("image"), createMenuItem);
router.put("/menu/:id", protect, allowRoles("admin", "staff"), uploadFoodImage.single("image"), updateMenuItem);
router.delete("/menu/:id", protect, allowRoles("admin", "staff"), deleteMenuItem);

router.get("/categories", getCategories);
router.post("/categories", protect, allowRoles("admin", "staff"), createCategory);
router.put("/categories/:id", protect, allowRoles("admin", "staff"), updateCategory);

module.exports = router;
