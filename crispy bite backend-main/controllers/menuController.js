const db = require("../config/db");

const getMenu = async (req, res) => {
  try {
    const { name, category, maxPrice, availability } = req.query;
    const filters = [];
    const params = [];

    if (name) {
      filters.push("mi.item_name LIKE ?");
      params.push(`%${name}%`);
    }
    if (category) {
      filters.push("(mc.name = ? OR mi.category_id = ?)");
      params.push(category, category);
    }
    if (maxPrice) {
      filters.push("mi.price <= ?");
      params.push(Number(maxPrice));
    }
    if (availability) {
      filters.push("mi.availability_status = ?");
      params.push(availability);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [items] = await db.query(
      `SELECT mi.*, mc.name AS category_name
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       ${where}
       ORDER BY mi.created_at DESC`,
      params
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Could not load menu.", error: error.message });
  }
};

const getMenuItem = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT mi.*, mc.name AS category_name
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       WHERE mi.id = ?`,
      [req.params.id]
    );

    if (!items.length) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    res.json(items[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not load menu item.", error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { category_id, item_name, description, price, availability_status, preparation_time_minutes } = req.body;
    const image = req.file ? `/uploads/food-images/${req.file.filename}` : req.body.image || null;

    // This insert shows students how form fields and optional Multer images become a database record.
    const [result] = await db.query(
      `INSERT INTO menu_items
       (category_id, item_name, description, price, image, availability_status, preparation_time_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        item_name,
        description || "",
        price,
        image,
        availability_status || "available",
        preparation_time_minutes || 15
      ]
    );

    const [created] = await db.query("SELECT * FROM menu_items WHERE id = ?", [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not create menu item.", error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { category_id, item_name, description, price, availability_status, preparation_time_minutes } = req.body;
    const image = req.file ? `/uploads/food-images/${req.file.filename}` : req.body.image;

    await db.query(
      `UPDATE menu_items
       SET category_id = ?, item_name = ?, description = ?, price = ?, image = COALESCE(?, image),
           availability_status = ?, preparation_time_minutes = ?
       WHERE id = ?`,
      [
        category_id,
        item_name,
        description || "",
        price,
        image || null,
        availability_status || "available",
        preparation_time_minutes || 15,
        req.params.id
      ]
    );

    const [updated] = await db.query("SELECT * FROM menu_items WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not update menu item.", error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    await db.query("DELETE FROM menu_items WHERE id = ?", [req.params.id]);
    res.json({ message: "Menu item deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete menu item.", error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM menu_categories ORDER BY name");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Could not load categories.", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const [result] = await db.query(
      "INSERT INTO menu_categories (name, description, status) VALUES (?, ?, ?)",
      [name, description || "", status || "active"]
    );
    const [created] = await db.query("SELECT * FROM menu_categories WHERE id = ?", [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not create category.", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    await db.query(
      "UPDATE menu_categories SET name = ?, description = ?, status = ? WHERE id = ?",
      [name, description || "", status || "active", req.params.id]
    );
    const [updated] = await db.query("SELECT * FROM menu_categories WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not update category.", error: error.message });
  }
};

module.exports = {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createCategory,
  updateCategory
};
