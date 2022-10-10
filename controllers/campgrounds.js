const Campground = require('../models/campgraund');
//Esto es para crear el mapa
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//Nuestro token de MapBox
const mapBoxToken = process.env.MAPBOX_TOKEN;
//Con esto es como que le decimos a mapbox quee se es nuestro token de acceso y lo guardamos en una variable
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
//Esto es de la nube (donde se guardan nuestras fotos de los campamentos)
const {cloudinary} = require('../cloudinary/index');


//Index.ejs
module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    //Vamos a estructurar las plantillas en diferentes carpetas.
    res.render('campgrounds/index', {campgrounds}) //Ponemos {camprgrounds} aqui en res.render para poder usarlo en nuestra plantilla
}

//Crear campamento: new.ejs
module.exports.renderNewFormCampground = (req, res) => {
    res.render('campgrounds/new');
}

//Ruta post para form new campground
module.exports.newFormCampgroundPost = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({ //Esta todo explicado en el word de agregar mapa
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
    }

//Ruta para ver los campamentos x id: show.ejs
module.exports.campgroundShow = async(req, res) => {
    //Le agregamos populate y reviews para poder trabajar con las reseñas junto con los campamentos.
    const campground = await Campground.findById(req.params.id).populate({
    //Aca le estamos diciendo que rellene todas las reviews de la matriz de reviews de campamento que estamos encontrando
    path:'reviews',
    populate: {
        path: 'author'
    }
    }).populate('author');
    console.log(campground);
    if(!campground){//Esto va a decir que si no es un campamento va a aparecer el flash de error:
        req.flash('error', 'No se pudo encontrar ese campamento!');
        //Y lo vamos a redirigir a todos los campamentos:
        return res.redirect('/campgrounds');
        }
    res.render('campgrounds/show', {campground});
    //Esto se enviara a un boton con un formulario que enviará una solicitud post a esta url (esta en show.ejs) por lo tanto debemos falsificar una solicitud de eliminación. Por lo tanto usaremos el metodo override
}

//Ruta de formulario de editar y actualzar campground:
module.exports.campgrounRenderEdit = async (req ,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){//Esto va a decir que si no es un campamento va a aparecer el flash de error:
        req.flash('error', 'No se pudo encontrar ese campamento!');
        //Y lo vamos a redirigir a todos los campamentos:
        return res.redirect('/campgrounds');
        }
    res.render('campgrounds/edit', {campground});
}

//Ruta post para enviar el form de actualizar e editar:
module.exports.campgroundEdit = async(req, res) => {
    //Para guardar el nuevo campamento:
    const {id} = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});// {...req.body.Campground} esto es para que actualice el title y location ya que en el formulario de edt.js pusimos:
    //name="campground[title]" y name="campground[location]" 
    //Esto es para subir varias imagenes y cargar imagenes desde nuestro pc ( esta en el archivo word: cargar iamgenes de usuario no por link)
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs);
    //Aqui haremos la logica para eliminar ciertas imagenes de nuestros campamentos. con el name: deleteImages[] y con el value:img.filename
    //Esto esta todo en el word de: Formulario de eliminacion de imagenes y eliminacion de imagenes backend.
    //Le agregaremos una if porque lo vamos a hacer si hay imagenes para eliminar, de lo contrario no pasará nada
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages } } } })
        //console.log(campground);
    }
    await campground.save();
    req.flash('success', 'Campamento Actualizado con Exito!');
    res.redirect(`/campgrounds/${campground._id}`);
}

//Ruta para eliminar campamento:
module.exports.campgroundDelete = async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id); 
    req.flash('success', 'Campamento Eliminado con Exito!');

    res.redirect('/campgrounds');  
}



