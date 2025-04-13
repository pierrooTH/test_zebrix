const express = require("express");
const { getProducts } = require("../controllers/productController");
const cacheMiddleware = require("../middleware/cacheMiddleware");

const router = express.Router();

router.get("/", cacheMiddleware, getProducts);

module.exports = router;
