//El modeloSchema para la validacion:
const {campgroundSchema, reviewSchema} = require('./SchemaJoivalidate');
//El modelo
const Campground = require('./models/campgraund');
const Review = require('./models/review');
//Le vamos a requerir el manejo de errores:
const ExpressError = require('./utilidades/ExpressError');

//Este middleware va a servir para proteger (new campground, edit campground, delete), tiene que ver con passport y sus atenticaciones.
//Esto significa que si no iniciaste sesion te va a saltar un error y te va a redirigir con /login.
//Ejemplo. Si queres crear un nuevo campamento pero no iniciaste sesion no vas a poder.
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //Esto va a requerir el inicio de sesion. si iniciamos sesion vamos a redirigir al usuario en donde se encontraba, ejemplo: en algun campamento en especifico:
        //req.session.returnTo = req.originalUrl;
        //Y tambien le agregaremos lo de arriba a la logica de router.post('/login') 
        req.flash('error', 'You must be signed in first!') 
        return res.redirect('/login');
    }
    next();
}

//JOI VALIDATION MIDDLEWARE CAMPGROUNDSCHEMA: Aqui pondremos nuestra Schema de joi para las validaciones
//Validacion de formulario:
module.exports.validateCampgroundJoi = (req, res, next) => {
    //Esta logica la agregaremos a el app.post de crear un nuevo campamento.
       const {error} = campgroundSchema.validate(req.body);
   if (error){
       const msg = error.details.map(el => el.message).join(',');
       throw new ExpressError(msg, 400);
     }else {
       next();
     }
   }

//MIDDLEWARE DE AUTORIZACION AUTHOR(PASSPORT) como proteger nuestras rutas:
module.exports.isAuthorMiddleware = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    //Esto significa que si NO es el propietario o el usuario que ha iniciado sesion actualmente en esta solicitud vamos a poner un flash y vamos a redirigirlo
    //Autorizacion (word passport)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//MIDDLEWARE DE AUTORIZACION AUTHOR(PASSPORT) como proteger nuestras rutas:
module.exports.isAuthorMiddlewareReview = async (req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  //Esto significa que si NO es el propietario o el usuario que ha iniciado sesion actualmente en esta solicitud vamos a poner un flash y vamos a redirigirlo
  //Autorizacion (word passport)
  if(!review.author.equals(req.user._id)){
      req.flash('error', 'You do not have permission to do that');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
} 

//JOI VALIDATION MIDDLEWARE REVIEWSCHEMA:Aqui vamos a hacer lalogica para nuestra validacion del formulario review:
module.exports.validateReviewJoi = (req, res, next) => {
    //Esta logica la agregaremos al app.post de reviews para crear un comentario.
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        console.log(error);
        throw new ExpressError(msg, 400);
      }else {
        next();
      }
    } //Este middleware lo agregaremos a app.post('/campground/:id/reviews))
