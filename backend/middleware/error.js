const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // wrong mongodb error/// jkn product details e id ta wrong dibo ei code ta tkn error message gula dibe
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error ---when you try set same email as a register
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);
    }

    //wrong JWT error
    if (err.name === "jsonWebTokenError") {
        const message = `Json web token invalid, Try again`
        err = new ErrorHandler(message, 400);
    }

    // JWT Expire error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token Expire, Try again`
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        // error: err,
        // error2: err.stack,
        message: err.message
    });
}