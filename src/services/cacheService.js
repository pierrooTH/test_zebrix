const { redisClient } = require("../config/redis");
const config = require("../config/env");

/**
 * Récupère une valeur du cache
 * @param {string} key - Clé de cache
 * @returns {Promise<any>} - Valeur du cache
 */
const getFromCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(
            `Erreur lors de la récupération du cache pour ${key}:`,
            error
        );
        return null;
    }
};

/**
 * Met une valeur en cache
 * @param {string} key - Clé de cache
 * @param {any} value - Valeur à mettre en cache
 * @param {number} ttl - Durée de vie en secondes
 */
const setInCache = async (key, value, ttl = config.CACHE_TTL) => {
    try {
        await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error(`Erreur lors de la mise en cache pour ${key}:`, error);
    }
};

module.exports = {
    getFromCache,
    setInCache,
};
