const fs = require("fs");
const csvParser = require("csv-parser");
const path = require("path");

const stockFilePath = path.resolve(__dirname, "../data/stock.csv");

/**
 * Charge les données de stock à partir du fichier CSV
 * @returns {Promise<Map>} - Map des stocks par ID de produit
 */
const loadStockData = () => {
    return new Promise((resolve, reject) => {
        const stockMap = new Map();

        fs.createReadStream(stockFilePath)
            .pipe(
                csvParser({
                    separator: ";",
                    headers: ["IdProduct", "stock"],
                })
            )
            .on("data", (row) => {
                // Stocke l'ID du produit et son stock
                stockMap.set(row.IdProduct, parseInt(row.stock, 10));
            })
            .on("end", () => {
                resolve(stockMap);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
};

/**
 * Vérifie si un produit est en stock
 * @param {Map} stockMap - Map des stocks
 * @param {number|string} productId - ID du produit
 * @returns {boolean} - True si en stock
 */
const isInStock = (stockMap, productId) => {
    const productIdStr = String(productId);
    return stockMap.has(productIdStr) && stockMap.get(productIdStr) > 0;
};

/**
 * Obtient le niveau de stock d'un produit
 * @param {Map} stockMap - Map des stocks
 * @param {number|string} productId - ID du produit
 * @returns {number} - Niveau de stock
 */
const getStockLevel = (stockMap, productId) => {
    const productIdStr = String(productId);
    return stockMap.has(productIdStr) ? stockMap.get(productIdStr) : 0;
};

module.exports = {
    loadStockData,
    isInStock,
    getStockLevel,
};
