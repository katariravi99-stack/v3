const router = require("express").Router();
const products = require("../data/products.json");

// GET all
router.get("/", (req, res) => {
  res.json(products);
});

// GET by id
router.get("/:id", (req, res, next) => {
  const item = products.find(p => p.id === req.params.id);
  if (!item) return next(); // falls through to 404
  res.json(item);
});

// (Optional) POST create – in-memory demo only
router.post("/", (req, res) => {
  const body = req.body || {};
  if (!body.name) return res.status(400).json({ message: "name is required" });

  const newItem = {
    id: `p-${Date.now()}`,
    name: body.name,
    price: body.price || 0,
    images: body.images || [],
    type: body.type || "generic",
    stock: body.stock ?? 0
  };
  products.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;
