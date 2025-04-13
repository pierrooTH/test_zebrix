// Clés de cache
const CACHE_KEYS = {
    AUTH_TOKEN: "auth:token",
    PRODUCTS: "products:all",
};

// Nombre de jours pour les produits mis en avant
const FEATURED_DAYS = 3;

// Remise de 30% pour les produits mis en avant
const FEATURED_DISCOUNT = 0.3;

module.exports = {
    CACHE_KEYS,
    FEATURED_DAYS,
    FEATURED_DISCOUNT,
};
