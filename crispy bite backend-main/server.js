const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const staffOrderRoutes = require("./routes/staffOrderRoutes");
const riderRoutes = require("./routes/riderRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "CrispyBite API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/staff", staffOrderRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || "Request failed." });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`QuickBite backend running on http://localhost:${PORT}`);
});
