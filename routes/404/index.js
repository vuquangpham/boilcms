const errorHandler = (error, req, res, next) => {
    // Error handling middleware functionality
    res.render('404', {});
};

module.exports = errorHandler;