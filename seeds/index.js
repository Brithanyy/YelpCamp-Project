//Este será un archivo autónomo asique conectaremos mongo y el modelo.
//ESTE ARCHIVO YA ESTA CONFIGURADO PARA ESCRIBIR LA LOGICA DE SEMILLA, ES DECIR TODA LA INFO PARA LA BASE DE DATOS.
const Campground = require('../models/campgraund');

const mongoose = require('mongoose');

//Vamos a requerir el archivo de ciudades para poder hacer la logica:
const cities = require('./cities');

//Vamos a requerir el contenido del archivo seedHelpers:
const {descriptors, places} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true 
})
//Ahora hacemos la logica para verificar si hay un error y si se abre correctamente.
const db = mongoose.connection;
db.on('Error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});


//Crearemos esta variable para definir la logica: un lugar(places) aleatorio y un descriptors(descripcion) aleatorio, juntarlos y elegir un elemento aleatorio de una matriz.
const sample = array => array[Math.floor(Math.random() * array.length)]; //Entonces pasas la matriz y retur(devuelve) un elemento aleatorio a esa matriz.

//Empezaremos con borrar los datos q tenemos en la base de datos. habiamos puesto un campamento y su descripcion. vamos a borrarlo.
const seedDB = async () =>  {
     await Campground.deleteMany({});
     for(let i = 0; i < 50; i++){ //Esta logica deberia darnos 50 nuevos campamentos. (los del archivo cities.js)
    //Crearemos un numero aleatorio para elegir una ciudad.
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 7000 ) + 500;
    const camp = new Campground({ //Vamos a hacer un nuevo campamento donde estableceremos la ubicacion de ese campamento, para que sea dos cosas, una ciudad y estado
     author: '6303ba1d9561fefdba201fd3',
     location:`${cities[random1000].city}, ${cities[random1000].state}`,
     title: `${sample(descriptors)}, ${sample(places)}`, 
     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea nisi temporibus, soluta animi quod mollitia omnis, eaque error perferendis eius laborum recusandae neque facere perspiciatis aperiam est labore voluptatem molestiae.',
     price: price,
     images:
     [
        {
          url: 'https://res.cloudinary.com/dnr4rqzhj/image/upload/v1662574761/YelpCamp/ob7chwvbnhmv2iknnivu.jpg',
          filename: 'YelpCamp/ob7chwvbnhmv2iknnivu'
        },
        {
          url: 'https://res.cloudinary.com/dnr4rqzhj/image/upload/v1662574761/YelpCamp/y8rfdayrqhpm0cjwzq4a.jpg',
          filename: 'YelpCamp/y8rfdayrqhpm0cjwzq4a'
        }
    ]
       });
    await camp.save();
    }
}
seedDB().then(() => { //Asi es como cerramos mongo(base de datos).
    mongoose.connection.close()
})
//Este archivo lo ejecutamos con node: .load seeds/index.js
//Luego veremos los resultados en nuestra base de datos.
