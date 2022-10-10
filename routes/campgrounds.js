const express = require('express');
const router = express.Router();
//Le vamos a requerir el manejo de errores:
const CatchAsyncError = require('../utilidades/CatchAsyncError');
const ExpressError = require('../utilidades/ExpressError');
//El modelo
const Campground = require('../models/campgraund');

//CONTROLADORES: Dentro de el nombre campground estan todos los controladores
const campgrounds = require('../controllers/campgrounds');
//Middleware para la autenticacion y para proteger nuestra pagina (isLoggedIn)
//JOI VALIDATION MIDDLEWARE CAMPGROUNDSCHEMA: Aqui pondremos nuestra Schema de joi para las validaciones (validateCampgroundJoi)
//MIDDLEWARE DE AUTORIZACION AUTHOR(PASSPORT) como proteger nuestras rutas (isAuthorMiddleware)
const {isLoggedIn, validateCampgroundJoi, isAuthorMiddleware} = require('../MiddlewareParaLogin');
//Multer:
const multer = require('multer');
const {storage} = require('../cloudinary/index'); 
const upload = multer({storage});

//(index.ejs) y la post del formulario new campground:
router.route('/')
    .get(CatchAsyncError(campgrounds.index))
    .post(isLoggedIn, upload.array('image') ,validateCampgroundJoi, CatchAsyncError(campgrounds.newFormCampgroundPost))
    
//Crear campamento nuevo:(new.ejs)
router.get('/new',isLoggedIn,(campgrounds.renderNewFormCampground))

//Agregaremos las tres rutas de /:id get presentacion de campamentos(show.ejs), put(actualizar campamentoo) y delete(borrar campamento)
router.route('/:id')
    .get(CatchAsyncError(campgrounds.campgroundShow))
 //Para poder actualizar algun campamento debemos utilizar el metodo override para la anulación del metodo: npm i method-override
    .put(isLoggedIn, isAuthorMiddleware, upload.array('image'), validateCampgroundJoi, CatchAsyncError(campgrounds.campgroundEdit))
    .delete(isLoggedIn, isAuthorMiddleware, CatchAsyncError(campgrounds.campgroundDelete))

//Form de Editar y actualizar campground:
router.get('/:id/edit', isLoggedIn,isAuthorMiddleware, CatchAsyncError (campgrounds.campgrounRenderEdit))

module.exports = router;