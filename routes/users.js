const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utilidades/CatchAsyncError');
const User = require('../models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
//Middleware para la autenticacion y para proteger nuestra pagina
const {isLoggedIn} = require('../MiddlewareParaLogin'); 
//Requerimos el controlador de ruta de user:
const user = require('../controllers/user');

//Ruta render de register y la post de register
router.route('/register')
    .get(user.userRenderRegister)
    .post(catchAsyncError(user.userRegister));


 //Inicio de sesion render y post:
 router.route('/login')
    .get(user.userRenderLogin)
//Passport nos brinda un middleware llamado passport.authenticate(), le vamos a especificar la estrategia y lo ponemos como cualquier otro middleware.
// failureFlash: true nos mostrará un flash que viene con passport y le especificamos un redirect si las cosas salen mal
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.userLogin)
//Ahora necesitamos verificar si alguien esta conectado actualmente o si esta autenticado.
//Passport tiene un metodo que tiene que ver con la sesion. Almacena sus propias cosas alli (id y demas).
//Lo de passport.serializeUser(User.serialize()) y passport.deserializeUser(User.deserialize()) tienen que ver con como se alamcena y recupera informacion de la sesión.
//Vamos a usar ese metodo que se autentica y se agrega automaticamente al objeto de la solicitud en si.
//Creamos un archivo llamado MiddlewareLogin que es para lo que dijimos anteriormente.
//const {isLoggedIn} = require('../MiddlewareParaLogin');
//Y lo pondremos en campground/new,  campground/edit, /campground/:id

//Cerrar sesion:
router.get('/logout', user.userLogout);
//Y este link (/logout) lo vamos a poner en el navbar
//En la navbar vamos a poner el link de registrarse, login y logout.
//Vamos a dejar que solo aparezca el de login y registrarse, el de cerrar sesión solo aparecerá si hemos iniciado sesion.
//Vamos a agregarle al middlewareParaLogin: console.log('REQ USER...', req.user); y esto nos dirá cuando un usuario inicio sesion
//En el middleware de app.js de flash vamos a agregar: res.locals.currentUser = req.user; Y en todas mis plantillas deberia tener acceso al usuario actual.
//Y para terminar en el archivo navbar.ejs vamos a ponerle un poco de logica:
//<div class="navbar-nav ml-auto">
//        <% if(!currentUser){ %>
//        <a class="nav-link" href="/login">Login</a>
//        <a class="nav-link" href="/register">Register</a>
//        <% }else{ %>
//        <a class="nav-link" href="/logout">Logout</a>
//        <% } %>

module.exports = router;