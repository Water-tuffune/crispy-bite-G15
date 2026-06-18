const express = require("express");
const { getCart, addCartItem, updateCartItem, deleteCartItem, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("customer"));
router.get("/", getCart);
router.post("/items", addCartItem);
router.put("/items/:id", updateCartItem);
router.delete("/items/:id", deleteCartItem);
router.delete("/clear", clearCart);

module.exports = router;
