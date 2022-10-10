//Esto es lo que estamos viendo en validaciones. Esto seria para el manejo de errores con fuction async (errores de mongo)
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}