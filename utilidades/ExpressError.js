
class ExpressError extends Error {
    constructor(message, statusCode){
        super(); //Esto llamara al constructor de errores.
        this.message = message;
        this.statusCode = statusCode;
    }
}
module.exports = ExpressError;