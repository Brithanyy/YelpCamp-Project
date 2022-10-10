//Todo esto lo encontramos en el word:'cargar imagenes de usuarios no por link'
//Le requerimos el .v2 ya que es importante porque es de los documentos y tambien requiere el almacenamiento de energia en la nube
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
}});
module.exports = {
    cloudinary, 
    storage
}