const { authenticatedRequest } = require("./authService");
const { loadStockData, isInStock, getStockLevel } = require("./stockService");
const { getFromCache, setInCache } = require("./cacheService");
const {
    CACHE_KEYS,
    FEATURED_DAYS,
    FEATURED_DISCOUNT,
} = require("../utils/constants");

/**
 * Récupère tous les produits de l'API nationale
 * @returns {Promise<Array>} - Liste des produits
 */
const fetchAllProducts = async () => {
    try {
        // Vérifier si les produits sont en cache
        const cachedProducts = await getFromCache(CACHE_KEYS.PRODUCTS);
        if (cachedProducts) {
            return cachedProducts;
        }

        // Récupérer les produits du web service national
        const products = await authenticatedRequest("get", "/products");

        // Mettre en cache des produits
        await setInCache(CACHE_KEYS.PRODUCTS, products);

        return products;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des produits:",
            error.message
        );
        throw error;
    }
};

/**
 * Vérifie si un produit doit être mis en avant (featuredProduct) (DLC à J+3)
 * @param {Object} product - Produit à vérifier
 * @returns {boolean} - True si le produit doit être mis en avant
 */
const isFeaturedProduct = (product) => {
    if (!product.dlc) return false;

    const dlcDate = new Date(product.dlc);
    const today = new Date();

    // Calculer la différence en jours
    const diffTime = dlcDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= FEATURED_DAYS && diffDays > 0;
};

/**
 * Applique une remise au prix du produit
 * @param {Object} product - Produit à modifier
 * @returns {Object} - Produit avec prix réduit
 */
const applyDiscount = (product) => {
    const originalPrice = parseFloat(product.price);
    const discountedPrice = originalPrice * (1 - FEATURED_DISCOUNT);

    return {
        ...product,
        price: discountedPrice.toFixed(2),
    };
};

/**
 * Récupère les produits filtrés et triés pour l'affichage
 * @returns {Promise<Object>} - Produits standards et mis en avant
 */
const getFilteredProducts = async () => {
    try {
        // Récupére tous les produits
        const allProducts = await fetchAllProducts();

        // Charge les données de stock
        const stockMap = await loadStockData();

        // Filtre les produits hors stock
        const productsInStock = allProducts.filter((product) =>
            isInStock(stockMap, product.id)
        );

        // Ajoute les niveaux de stock aux produits
        const productsWithStock = productsInStock.map((product) => ({
            ...product,
            stock: getStockLevel(stockMap, product.id),
        }));

        // Sépare les produits mis en avant et standards
        const featuredProducts = [];
        const standardProducts = [];

        productsWithStock.forEach((product) => {
            console.log("product >> ", product);
            console.log("isFeaturedProduct >> ", isFeaturedProduct(product));
            console.log("applyDiscount >> ", applyDiscount(product));
            if (isFeaturedProduct(product)) {
                featuredProducts.push(applyDiscount(product));
            } else {
                standardProducts.push(product);
            }
        });

        // Trie les produits par prix décroissant
        const sortByPriceDesc = (a, b) =>
            parseFloat(b.price) - parseFloat(a.price);

        console.log("featuredProducts >> ", featuredProducts);
        console.log("standardProducts >> ", standardProducts);

        return {
            featuredProducts: featuredProducts.sort(sortByPriceDesc),
            standardProducts: standardProducts.sort(sortByPriceDesc),
        };
    } catch (error) {
        console.error("Erreur lors du filtrage des produits:", error.message);
        throw error;
    }
};

module.exports = {
    getFilteredProducts,
    fetchAllProducts,
};
