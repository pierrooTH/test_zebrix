const { nationalApiInstance } = require("../config/axios");
const { getFromCache, setInCache } = require("./cacheService");
const { CACHE_KEYS } = require("../utils/constants");
const config = require("../config/env");

/**
 * Authentifie auprès du web service national et récupère un token JWT
 * @returns {Promise<string>} - Token JWT
 */
const getAuthToken = async () => {
    try {
        // Vérifie si le token est en cache
        const cachedToken = await getFromCache(CACHE_KEYS.AUTH_TOKEN);
        if (cachedToken) {
            return cachedToken;
        }

        // Si non récupère un nouveau token
        const credentials = {
            name: config.RESTAURANT_USERNAME,
            resto: config.RESTAURANT_CODE,
            pwd: config.RESTAURANT_PASSWORD,
        };

        const response = await nationalApiInstance.post("/login", credentials);

        if (response.data && response.data.token) {
            // Mise en cache du token
            await setInCache(CACHE_KEYS.AUTH_TOKEN, response.data.token, 7000);
            return response.data.token;
        } else {
            throw new Error("Token non trouvé dans la réponse");
        }
    } catch (error) {
        console.error("Erreur d'authentification:", error.message);
        throw new Error(`Échec de l'authentification: ${error.message}`);
    }
};

/**
 * Effectue une requête authentifiée vers le web service national
 * @param {string} method
 * @param {string} endpoint - Endpoint API
 * @param {Object} data - Données pour les requêtes POST
 * @returns {Promise<any>} - Réponse de l'API
 */
const authenticatedRequest = async (method, endpoint, data = null) => {
    try {
        const token = await getAuthToken();

        const config = {
            headers: {
                Authorization: `${token}`,
            },
        };

        if (method.toLowerCase() === "get") {
            return (await nationalApiInstance.get(endpoint, config)).data;
        } else if (method.toLowerCase() === "post") {
            return (await nationalApiInstance.post(endpoint, data, config))
                .data;
        }
    } catch (error) {
        console.error(
            `Erreur lors de la requête ${method} vers ${endpoint}:`,
            error.message
        );
        throw error;
    }
};

module.exports = {
    getAuthToken,
    authenticatedRequest,
};
