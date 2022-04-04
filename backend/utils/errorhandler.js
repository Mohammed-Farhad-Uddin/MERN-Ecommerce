class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode;

        Error.captureStackTrace(this,this.constructor)//Error class tar modde method ace oi kan tekhe inherite kore Error class er captureStackTrace() method use kora hocce...maybe override kora hocce Error class er method ta
    }
}

module.exports = ErrorHandler;