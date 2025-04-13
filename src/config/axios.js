const axios = require("axios");
const config = require("./env");

const nationalApiInstance = axios.create({
    baseURL: config.NATIONAL_API_URL,
    headers: {
        "Content-Type": "application/json",
        ["apiKey"]: config.API_KEY,
    },
});

module.exports = {
    nationalApiInstance,
};
