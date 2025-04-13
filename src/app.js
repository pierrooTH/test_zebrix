const express = require("express");
const routes = require("./routes");
const errorMiddleware = require("./middleware/errorMiddleware");
const config = require("./config/env");

const app = express();
const port = config.PORT;

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = app;
