const Redis = require("ioredis");
const config = require("./env");
const redisClient = new Redis(config.REDIS_URL);

module.exports = {
    redisClient,
};
