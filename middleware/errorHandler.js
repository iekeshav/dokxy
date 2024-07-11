// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(500).send({
        status: 'error',
        message: 'An unexpected error occurred!'
    });
};

module.exports = errorHandler;
