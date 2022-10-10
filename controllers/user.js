const User = require('../models/user');

//register render get:
module.exports.userRenderRegister = (req, res) => {
    //Crearemos una carpeta en views llamada users y pondremos las plantillas ejs.
    res.render('users/register');
}
//register:
module.exports.userRegister = async (req, res, next) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
        //Esto dice que si hay un error debe devolver el erro y de lo contrario el req.flash y el redirect
        if(err) return next(err)
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    })
}catch(e){
    req.flash('error', e.message);
    res.redirect('/register');
} 
}

//Inicio de sesion render get:
module.exports.userRenderLogin = (req, res) => {
    res.render('users/login');
}

//inicio de sesion 
module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome Back!');
    //Esto es para cuando en el middleware al usuario le exija que inicie sesion y que luego lo mande al url en el que estaba
    const redirectURL = req.session.returnTo || '/campgrounds';
    res.redirect(redirectURL);
    }

//Cerrar sesion:
module.exports.userLogout = (req, res, next) => {
    req.logout((err)=>{
        if(err){ return next(err)}
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
   })
}