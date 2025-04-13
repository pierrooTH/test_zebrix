const express = require("express");
const productRoutes = require("./productRoutes");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Restaurant API is running",
    });
});

router.use("/api/products", productRoutes);

module.exports = router;
