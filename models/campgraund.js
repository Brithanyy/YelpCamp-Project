
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');
const { campgroundSchema } = require('../SchemaJoivalidate');
const { string } = require('joi');


const CampgroundSchema = new Schema({
    title: String,
    images: [
        {url: String,
        filename: String}
    ],
    //Aqui va a ir el schema para el mapa:
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
    coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    //Esto de author es para que cada usuario pueda modificar/borrar solo sus campamentos que haya creado. No puede modificar/borrar los que no creo.
    //Esto esta en la parte de passport (archivo word)
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //Esto de reviews es para vincular los comentarios/reseñas a cada campamento. Estructurar informacion con mongoose seria.
    reviews: [
        {
            //Entonces seria una ID del modelo de reviews
            type: Schema.Types.ObjectId,
            ref: 'Review'
            //Esto de const mongoose = require('mongoose');ref se vincula al modelo de review y tiene que tener el mismo nombre que el modelo review
        }
    ]
});
//Campground Delete Middleware. Crearemos esta logica para borrar todo de la base de datos, Sin esto, se borrará, pero en la base de datos quedaran datos huerfanos por asi decirlo porque no tendran un padre, serán datos sueltos.
//Vamos a borrarlos completamente:
CampgroundSchema.post('findOneAndDelete', async function (doc) {
if(doc){
    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
}
})

module.exports = mongoose.model('Campground', CampgroundSchema);