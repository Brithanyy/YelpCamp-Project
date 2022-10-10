const Joi = require('joi');
const { number } = require('joi');

//Estos esquemas son para validar los formularios del lado del servidor (back-end) La mayoria los valida solo del lado del cliente.
//Joi es una biblioteca de validación que le permite construir esquemas para validar objetos JavaScript. Básicamente, Joi proporciona métodos para verificar fácilmente cadenas, booleanos, enteros, direcciones de correo electrónico, números de teléfono, etc.
module.exports.campgroundSchema = Joi.object({ 
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
       deleteImages: Joi.array()
    
});

//Vamos a crear el schema para reviews(comentarios):
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})