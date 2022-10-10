const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

//Vamos a definir nuestro esquema sobre revisiones 'review': Esto sera para la calificación  o comentario de cada Campground.
//Vamos a practicar lo que aorendimos de vincular con mongoose
//Vamos a vincular cada campground con una id para luego anidarlo a este modelo que serian las reseñas. Para que cada campground tenga algunas reseñas.
//AL SCHEMA DE CAMPGROUND VAMOS A AGREGARLE review
//Esto seria estructurar información con Mongoose
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    }
});
module.exports = mongoose.model('Review', reviewSchema);