const { getFilteredProducts } = require("../services/productService");

/**
 * Récupère les produits filtrés
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next d'Express
 */
const getProducts = async (req, res, next) => {
    try {
        const products = await getFilteredProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
};
