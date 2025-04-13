require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    REDIS_URL: process.env.REDIS_URL,
    NATIONAL_API_URL: process.env.NATIONAL_API_URL,
    API_KEY: process.env.API_KEY,
    RESTAURANT_USERNAME: process.env.RESTAURANT_USERNAME,
    RESTAURANT_CODE: process.env.RESTAURANT_CODE,
    RESTAURANT_PASSWORD: process.env.RESTAURANT_PASSWORD,
    CACHE_TTL: parseInt(process.env.CACHE_TTL) || 300,
};
