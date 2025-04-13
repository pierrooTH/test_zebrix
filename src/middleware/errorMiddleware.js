/**
 * Middleware de gestion des erreurs
 */
const errorMiddleware = (err, req, res, next) => {
    console.error(`Erreur: ${err.message}`);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: "Une erreur s'est produite",
        message: err.message,
    });
};

module.exports = errorMiddleware;
