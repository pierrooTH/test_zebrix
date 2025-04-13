const { getFromCache, setInCache } = require("../services/cacheService");

/**
 * Middleware de cache pour les requêtes API
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next d'Express
 */
const cacheMiddleware = (req, res, next) => {
    const cacheKey = `cache:${req.originalUrl}`;

    getFromCache(cacheKey)
        .then((cachedData) => {
            if (cachedData) {
                return res.json(cachedData);
            }

            // Stocker la réponse originale
            const originalJson = res.json;

            res.json = function (data) {
                // Mise en cache pour 60 secondes
                setInCache(cacheKey, data, 60);

                // Appeler la méthode originale
                return originalJson.call(this, data);
            };

            next();
        })
        .catch((err) => {
            console.error("Erreur de cache:", err);
            next();
        });
};

module.exports = cacheMiddleware;
