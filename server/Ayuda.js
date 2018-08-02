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
            ProductosElegidos=[];
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
        Tarjetas1=[];
    }
}
var GuiaPago=(session)=>{
    
        console.log("llego a guiapago");
        
        session.send("Okey deja te ayudo");
        session.send("Primero debes de estar logeado");
        var Pago = new builder.HeroCard(session)
            .title("Ahora dirigite a tu carrito para hacer el pago de tus productos")
            .buttons([
                builder.CardAction.openUrl(session, 'http://itecormovil.com/cosette/magento/index.php/checkout/cart/', 'Carrito')
            ]);
        var msjs=[]
        msjs.push(Pago);
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(msjs);
        session.send(msj);
        session.send("Puedes pagar de las siguientes maneras: ");
        session.send("1.- Pagar con tu cuenta de paypal");
        session.send("2.- Pagar con tu tarjeta de credito");
        session.send("Solo debes de seguir los pasos y listo tu carrito estara pagado");        
    
}

var GuiaCarrito=(session)=>{
    var Carrito = new builder.HeroCard(session)
        .title("Aqui esta un acceso directo a tu carrito")
        .buttons([
            builder.CardAction.openUrl(session, 'http://itecormovil.com/cosette/magento/index.php/checkout/cart/', 'Carrito')
        ]);
    var msjs1=[]
    msjs1.push(Carrito);
    var msj1 = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(msjs1);
    session.send(msj1);
}

var login=(session)=>{
    var login = new builder.HeroCard(session)
        .title("O haga click en el boton de abajo")
        .buttons([
            builder.CardAction.openUrl(session, 'http://itecormovil.com/cosette/magento/index.php/customer/account/login/', 'Iniciar sesion')
        ]);
    var msjs1=[]
    msjs1.push(login);
    var msj1 = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(msjs1);
    session.send(msj1);
    session.send("Si usted no esta registrado, puede registrarse solo haciendo click en el boton de **Create an account** ubicado a la derecha del login")
}
module.exports.login=login;
module.exports.GuiaCarrito=GuiaCarrito;
module.exports.Guia=Guia;
module.exports.GuiaPago=GuiaPago;
module.exports.traerProductos=traerProductos;
module.exports.CrearTarjetProductos=CrearTarjetProductos;
