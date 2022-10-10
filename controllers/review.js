const Campground = require('../models/campgraund');
const Review = require('../models/review');

//Form q esta en show.ejs para crear un comentario:
module.exports.reviewUser = async(req, res) => {
    //Vamos a buscar ese campground:
    const campground = await Campground.findById(req.params.id);
    //Ahora vamos a crear el review en base al id encontrado(campground):
    const review = new Review(req.body.review); //Eso de review es porque en el formulario en el name le pusimos review y lo hacemos para poder hacer esto.
    //Debajo de la creacion del review vamos a vincular al usuario actualmente coenctado con el comentario.
    review.author = req.user._id;
    //Aqui vamos a emoujar el nuevo comentario:
    campground.reviews.push(review);
    //Guardamos ese review:
    await review.save();
    //Guardamos el campamento tambien ya que estan vinculados:
    await campground.save();
    req.flash('success', 'Comentario Creado con Exito!');

    //Vamos a redirigir este post a la pagina de show de cada campground. Con la ID:
    res.redirect(`/campgrounds/${campground._id}`);

}

//Eliminar review:
module.exports.reviewDelete = async(req, res) => {
    //Nuevo metodo para eliminar algo con mongo: Vamos a utilizar el metodo de Mongo $pull
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    req.flash('success', 'Comentario Eliminado con Exito!');
    res.redirect(`/campgrounds/${id}`);
}