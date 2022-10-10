const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Esquema de user
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        //Vamos a configurar para que el correo sea unico
        unique: true
    }
})

//Esto agregará a nuestro esquema un nombre de usuario y agregará un campo para la contraseña.
//Tambien se asegurará que esos nombres de usuario sean unicos, no esten duplicados y tambien nos dara algunos metodos que podemos usar.
//Por eso es una herramienta dificil de usar porque es oculta, no sabemos que esta agregando una contraseña y un campo con nombre de usuario
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);