const errorHandler = (error, req, res, next) => {
    // Error handling middleware functionality
    res.render('error', {});
};

module.exports = errorHandler;