//Aqui van todas las rutas de reviews:
const express = require('express');
const router = express.Router({ mergeParams: true }); //las rutas basadas en router deben tener mergeparams en true
//MIDDLEWARE DE AUTORIZACION AUTHOR(PASSPORT) como proteger nuestras rutas (isAuthorMiddleware)
const { validateReviewJoi, isLoggedIn, isAuthorMiddlewareReview } = require('../MiddlewareParaLogin');
const Campground = require('../models/campgraund');
const Review = require('../models/review');
//Controlador de rutas review:
const reviews = require('../controllers/review');
const ExpressError = require('../utilidades/ExpressError');
const CatchAsyncError = require('../utilidades/CatchAsyncError');

//RUTA DONDE VAMOS A ANIDAR CAMPGROUND CON REVIEW: RUTA PARA LOS COMENTARIOS
//El Formulario de esta ruta estara en show.ejs por lo tanto solo vamos a hacer la ruta de post.
router.post('/', isLoggedIn, validateReviewJoi, CatchAsyncError(reviews.reviewUser))
//Ruta para eliminar un Review: Le hacemos la ruta con :reviedID xq estamos haciendo referencia a que queremos borrar el review. No el campamento   
router.delete('/:reviewId', isLoggedIn, isAuthorMiddlewareReview, CatchAsyncError(reviews.reviewDelete));
//Para eliminarlo completamente de nuestra base de datos vamos a hacer neustro middleware para eso. En models/campground

module.exports = router;