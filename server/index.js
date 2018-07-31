//Variables de dependencias
var builder = require('botbuilder');
var restify =require ('restify');
var btoa=require('btoa');
var base64img = require ('base64-img');

//Variables globales
var conexion=require('./db/Consultas');
var connector=require('./db/conexion');
var Producto,Accion,sql,direccionI="C:\\imgBot";
var inMemoryStorage = new builder.MemoryBotStorage();
var Extension1=2,Raraimg="",Tarjetas1=[],Tarjetas=[],revisar;
var ProductoElegido,ProductosElegidos;
// Levantar Restify
var server = restify.createServer();
connector.conectar();
//configurando puerto
server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('listering to', server.name, server.url);
})
//Configuraciones del bot
var connector = new builder.ChatConnector({appId: '',appPassword:''})
//Crear bot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());
//conexion base de datos

    
//Configuracion de LUIS
var model = "	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b52309e8-88bd-4a01-9ddf-3be52dc0a036?subscription-key=a26e9792086947db99112f2aa9d5c3a3&verbose=true&timezoneOffset=0&q=";
var Salon;
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});

//Variables
var YaNoEntres=true;
var Asesorar;
var Hora = new Date().getHours();
var Saludo="";
var PrimeraVez=true;
var SigueSaludando=false;
var Extension=3;
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        if(YaNoEntres){
            // Say hello
            if(Hora>=12 && Hora<20){
                Saludo="Buenas tardes";
            }else if(Hora>=20 && Hora<24){
                Saludo="Buenas noches";
            }else if(Hora>0 && Hora<12){
                Saludo="Buenos dias"
            }else{
                Saludo="Hola";
            }
            
            var txt =`${Saludo} ¿En que puedo ayudarte?`;
            var reply = new builder.Message()
                    .address(message.address)
                    .text(txt);
            bot.send(reply);
            YaNoEntres=false;
        }
        }
        
    
});

// Dialogo Raíz 
// bot.dialog('/',[
//     (session)=>{
//         if(PrimeraVez===false){
//             session.send("Hola de nuevo ¿En que puedo ayudarte?");
//         }
//         PrimeraVez=false;
//         console.log('====================================');
//         console.log("Si entra retana me va a comprar un arizona");
//         console.log('====================================');
//         session.beginDialog('/Cossete')
//     }
// ]);


bot.dialog('/', dialog)
dialog.matches('IniciarSesion',[
    (session)=>{
        session.send("Dando ayuda a gente mensa")

    }
])
dialog.matches('Saludo',[
    (session)=>{
        if(!SigueSaludando){
            session.send('Hola')
            session.send('¿Hay algo en lo que pueda ayudarte?')
            SigueSaludando=true;
        }else {
            session.send("Ya ponte a hacer en vez de preguntar")
        }
    }
]) 
dialog.matches('None',[
    (session)=>{
        session.send("NONE")
    }

])


//Dialogos dependiendo del intento detectado por LUIS
dialog.matches('Comprar',[
    async(session,args,next)=>{
        var Producto=builder.EntityRecognizer.findAllEntities(args.entities, 'Producto')
        var Precio=builder.EntityRecognizer.findAllEntities(args.entities,'Precio');
        var Imagen=builder.EntityRecognizer.findAllEntities(args.entities,'Imagen');
        var ExtensionEntidad=Producto.length,ExtensionPrecio=Precio.length,ExtensionImagen=Imagen.length;
        console.log(`Precio ${ExtensionPrecio} y  Imagen  ${ExtensionImagen}`)
        console.log(ExtensionEntidad)
        if(ExtensionPrecio>0){
            revisar="Precio";
        }else if(ExtensionImagen>0){
            revisar="Imagen"
        }
        if(ExtensionEntidad>0){
            ProductoElegido=Producto[0].entity;
            console.log('====================================');
            console.log(ProductoElegido);
            console.log('====================================');

            await conexion.BP(ProductoElegido).then((respuesta)=>{
                ProductosElegidos=respuesta;
            }); 
            console.log("revisar: "+revisar)
            if(revisar==="Precio"){ 
                session.beginDialog("/verPrecio");
            }else if(revisar==="Imagen"){
                session.beginDialog("/verImagen");
            }
            console.log("Productos elegidos   "+ProductosElegidos.length);

            // session.send("Estamos programando esta parte, disculpe por las molestias");

            // for(var i=0;i<ProductosElegidos.length;i++){
            //     session.send("Producto "+ProductosElegidos[i].Producto);
            //     session.send("Tipo "+ProductosElegidos[i].Tipo);
            //     session.send("Precio "+ProductosElegidos[i].Precio+"");
            //     session.send("Imagen base64 "+ProductosElegidos[i].Imagen);
            // }
            
        }else{
            console.log("Entro")
            session.beginDialog('/ComprarSEntidad');
            
        }

    //   next();
    },
     
]);


//Funciones
var Guia=(session)=>{
    session.send("Dirigase a un producto de su interes y seleccione añadir al carrito.");
    session.send('Seleccione la talla y la cantidad de prendas que le gustaria adquirir, presione "Go to cart".');
    session.send('Aqui puede seleccionar de que forma quiere pagar')
    session.endConversation("Si tiene alguna otra duda solo digame.")
}


var CrearTarjetProductos=(session,Extension,Nombre,UrlImg,ExtensionActual,NombreProducto,Precio)=>{
    // base64Img.img('data:image/jpeg;'+Base64Img,'', Nombre, function(err, filepath) {});
    console.log('====================================');
    console.log(UrlImg);
    console.log('====================================');
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


    


bot.dialog('/ComprarSEntidad',[
    (session)=>{
        console.log('====================================');
        session.send("¡Genial!")
        builder.Prompts.choice(session,'¿Quiere que lo asesore en la busqueda de un producto?',"Si|No",{ listStyle: builder.ListStyle.button });
    },
    (session,results)=>{
        Asesorar=results.response.entity;
        console.log(Asesorar)
        if(Asesorar==="Si"){
            session.send("Se supone que aqui le enseño los productos y le muestro imagines pero pues que flojera ¿Verdad?")
        }
        builder.Prompts.text(session,"¿Algo en especifico?")
    },
    (session,results)=>{
            var Respuesta=results.response.toLowerCase();
            if(Respuesta===("si")){
                session.send("Muy bien, ¿Qué te interesa?")
                session.beginDialog('/')    
            }else if(Respuesta===("no")){
                //Crear TODOOOOOOOOO el catalogo pero despuecito
            }else{
                session.beginDialog('/')    
    
            }
            
        
    }
])

bot.dialog('/verPrecio',[
    (session)=>{
        session.send("Okey deja busco");
        var opciones;
        // for(var k=0;k<ProductosElegidos.length;k++){
        //     opciones=`${ProductosElegidos[k].Producto}  ${ProductosElegidos[k].Precio}|`
        //     if(k===ProductosElegidos.length-1)opciones=`${ProductosElegidos[k].Producto}  ${ProductosElegidos[k].Precio}`
        // }
        Extension=ProductosElegidos.length;
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
        // builder.Prompts.choice(session,"Tengo estas opciones, ¿Cual te gusta mas?",opciones,{ listStyle: builder.ListStyle.button });
    }
]);
        

