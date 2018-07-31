var mongoose = require('mongoose');
var Shema=mongoose.Schema;

var ProductosShema=new Shema({
    Producto:String,
    Tipo:String,
    Precio:Number,
    URLimg:String
});

var modelProductos=mongoose.model("productos",ProductosShema);
module.exports.modelProductos=modelProductos;

