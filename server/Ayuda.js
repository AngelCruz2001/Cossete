var builder = require('botbuilder');
var Tarjetas1=[]
var Guia=(session)=>{
    session.send("Dirigase a un producto de su interes y seleccione añadir al carrito.");
    session.send('Seleccione la talla y la cantidad de prendas que le gustaria adquirir, presione "Go to cart".');
    session.send('Aqui puede seleccionar de que forma quiere pagar')
    session.endConversation("Si tiene alguna otra duda solo digame.")
}
var traerProductos=(session,ProductosElegidos)=>{
    
    var Extension=ProductosElegidos.length;
    console.log("==========================");
    console.log(Extension);
    console.log("===========================");
        for(var i=0; i<Extension; i++){
                CrearTarjetProductos(
                    session,
                    Extension-1,
                    "Producto"+i,
                    ProductosElegidos[i].URLimg,
                    i,
                    ProductosElegidos[i].Producto,
                    ProductosElegidos[i].Precio);
            } 
}

var CrearTarjetProductos=(session,Extension,Nombre,UrlImg,ExtensionActual,NombreProducto,Precio)=>{
    // base64Img.img('data:image/jpeg;'+Base64Img,'', Nombre, function(err, filepath) {});
  
    Nombre = new builder.HeroCard(session)
    .title(NombreProducto)
    .subtitle("$"+Precio+".00")
    .text('Short Description here')
    .images([
        builder.CardImage.create(session, UrlImg)
    ])
    .buttons([
        builder.CardAction.openUrl(session, 'http://itecormovil.com/cosette/magento/index.php/shop.html', 'Comprar')
    ]);

        // Creamos un array de tarjetas
    Tarjetas1.push(Nombre)
    if(ExtensionActual===Extension){
    console.log(Extension +"  ==  "+ ExtensionActual);

        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(Tarjetas1);
        session.send(msj);
    }
}
module.exports.Guia=Guia;
module.exports.traerProductos=traerProductos;
module.exports.CrearTarjetProductos=CrearTarjetProductos;
