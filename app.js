if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const Joi = require('joi');
//Vamos a requerir el schemade JOI que lo hicimos en un archivo aparte
const {campgroundSchema} = require('./SchemaJoivalidate');
//Vamos a requerir el schema para validar el formulario de reviews:
const {reviewSchema} = require('./SchemaJoivalidate');
const engine = require('ejs-mate');
//Ejs-mate es un paquete de npm que nos permite agregar algunas funciones divertidas ademas nos permitirá definir algunas plantillas donde podemos tener codigo que insertamos entre algun contenido (se insertan en las plantillas ejs)
//Por ejemplo podemos tener un parcial(se le llama a la plantilla) para el head. entonces no ponemos todo el DOCTYPE, podemos tener otro parcial para el FOOTHER

const ExpressError = require('./utilidades/ExpressError');
//Requerimos ambos errores de la carpeta utilidades.
const CatchAsyncError = require('./utilidades/CatchAsyncError'); 
//Para usar en todas las fuction asyn simplemente ponemos el nombre de CatchAsyncError y esa funcion manejara los errores
//Si esto funciona, cuando haya un error no nos tiene q aparecer en la terminal

//Vamos a requerir es esquema de reviews:
const Review = require('./models/review');
//Vamas a requerir nuestro modelo que esta en la carpeta models
const Campground = require('./models/campgraund');
//Vamos a requerir de la carpeta routes el archivo campgrounds que es donde estan todas las rutas de /campgrounds
const campgroundRoutes = require('./routes/campgrounds');
//Vamos a requerir de la carpeta routes el archivo reviews que es donde estan todas las rutas de reviews
const reviewRoutes = require('./routes/reviews');
//Vamos a requerir express-sesion que es para poder usar flash:
const session = require('express-session');
//Vamos a requerir flash:
const flash = require('connect-flash');
//Requerimos Passport
const passport = require('passport');
//Requerimos la estrategia de passport que usaremos:
const localStrategy = require('passport-local');
//Requerimos el Modelo de User:
const User = require('./models/user');
//Requerimos las rutas de users:
const userRoutes = require('./routes/users');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true
   
})
//Ahora hacemos la logica para verificar si hay un error y si se abre correctamente.
const db = mongoose.connection;
db.on('Error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

//usa ejs-locals para todas las plantillas ejs:
app.engine('ejs', engine);

app.set('view engine', 'ejs');
//Apliciación para que establezca el directorio de views
app.set('views', path.join(__dirname, 'views'));

//vamos a usar un metodo de express, para la anulacion del method, ya que es un tipo de solicitud que no podemos enviar un formulario:
app.use(express.urlencoded({extended: true}));

//Vamos a 'activarla' por haci decirlo para poder usar este metodo.
app.use(methodOverride('_method'));

//Esta app use es para que express guarde archivos estaticos y son el contenido de nuestro sitio web que no cambiará, principalmente imagenes, archivos js, archivos css.
app.use(express.static(path.join(__dirname, 'public')));

//vamos a darle uso a express-session
const sessionConfig = {secret: 'EsteDeberiaSerUnSecretoMejor',
resave: false,
saveUninitialized: true,
//Vamos a establecerles algunas configuraciones a las cookies:
cookie:{
    //Lo que hace esto es darle una pequeña seguridad a nuestra cookie
    httpOnly: true,
    //Vamos a darle una fecha de vencimiento y le configuraremos la fecha de hoy  y la hora 8/8/2022 
    //Lo que quiere decir que tendra una fecha de vencimiento cada 7 dias
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Milisegundos 1000, 60 segundos, 60 minutos, 24 horas, 7 dias
    maxAge: 1000 * 60 * 60 * 24 * 7
    //Ahora si vemos nuestra cookie aparecerá con una fecha
}
};
app.use(session(sessionConfig));
//Vamos a darle uso a flash:
app.use(flash());
//Vamos a usar la estrategia de passport:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); //Dentro de localStrategy vamos a poner nuestro modelo de usuario.
//Esto le dice a pasport como serializar a los usuarios(User)
//La serializacion se refiere a como obtenemos datos o como almacenamos a un usuario en la sesión.
passport.serializeUser(User.serializeUser());
// este sera para sacar a un usuario de la sesión:
passport.deserializeUser(User.deserializeUser());//Vamos a darle uso a passport:



//Crearemos el middleware de flash:
app.use((req, res, next) => {
//Esto es para que en todas nuestras plantillas aparezca el usuario actual que ha iniciado sesion
console.log(req.session);
res.locals.currentUser = req.user;
//lo que hace esto es que no tenemos que pasar el acceso a cada plantilla. lo hace solo.
res.locals.success = req.flash('success');
//En la plantilla de boilerplate pondremos <%=success%> para que aparezca el flash
res.locals.error = req.flash('error');
next();
})

//(home.ejs)
app.get('/', (req, res) => {
    res.render('home'); //Le establecemos home porque es el nombre de la ruta. views/home.ejs
});

//ACA ESTAN TODAS LAS RUTAS DE CAMPGROUNDS
app.use('/campgrounds', campgroundRoutes);

//ACA ESTAN TODAS LAS RUTAS DE REVIEW
app.use('/campgrounds/:id/reviews', reviewRoutes);

//TODAS LAS RUTAS DE USER
app.use('/', userRoutes);

//Esto es para los errores de ExpressError:
app.all('*', (req,res,next) => {
    next(new ExpressError('Pagina No Encontrada :(', 404));
})
//EL APP.ALL TIENE QUE ESTAR PRIMERO QUE EL APP USE Y AMBOS TIENEN QUE TENER NEXT.
//El res.status del app use es el de app All. es el codigo de estado.

//Con esto vamos a manejar los errores de mongo. Solo para las funciones async
app.use((err, req, res, next) => {
    const {statusCode = 500} = err; 
    if(!err.message) err.message = 'Ocurrió un Error :(';
    res.status(statusCode).render('err', {err}) //Esto sera lo que aparecerá en pantalla si hay un error

})



app.listen(3000, () => {
    console.log('En el puerto 3000');
})
    