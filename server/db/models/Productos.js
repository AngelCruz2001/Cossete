var mongoose = require('mongoose');
var Shema=mongoose.Schema;

var ProductosShema=new Shema({
    Nombre:String,
    Precio:Number
});

var modelProductos=mongoose.model("Productos",ProductosShema);
module.exports.modelProductos=modelProductos;

