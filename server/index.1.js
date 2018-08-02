//Variables de dependencias
var builder = require('botbuilder');
var restify =require ('restify');
var btoa=require('btoa');
var base64img = require ('base64-img');
var opn = require('opn');
var Diccionario=require('../Diccionario');
//Variables globales
var conexion=require('./db/Consultas');
var connector=require('./db/conexion');
var funciones=require('./Ayuda');
var Producto,Accion,sql,direccionI="C:\\imgBot";
var inMemoryStorage = new builder.MemoryBotStorage();
var Extension1=2,Raraimg="",Tarjetas1=[],Tarjetas=[],revisar;
var ProductoElegido="",ProductosElegidos;
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
        // session.send("**Dando ayuda a gente mensa**")

        session.send('Muy bien, dirigite a el boton en la parte superior derecha de la pagina para iniciar')
        funciones.login(session)
    }
    // },
    // (session,results)=>{
    //     if(results.response.entity != null){
    //         var IniciarSesion= true;
    //     }
    //     session.send('Muy bien, fue un placer ayudarle, espero tenga un buen dia.');
    //     opn('http://itecormovil.com/cosette/magento/index.php/customer/account/login/');
    // }
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
dialog.matches('Despedida',[
    (session)=>{
        var Random = Math.floor(Math.random() * 4)+1; 
        switch(Random){
            case 1:
                session.send("Muy bien, espero tengas un excelente dia.")
                break;
            case 2:
                session.send("Correcto, espero poder ayudarte pronto");
                break;
            case 3:
                session.send("Gracias por probar mis servicios espero poder ayudarte en un futuro cercano");
                break;
            case 4:
                session.send("Hasta luego, gracias por su preferencia");
                break;
        }
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
        if(Producto.length>0)ProductoElegido=Producto[0].entity;
        ProductoElegido=Diccionario.Diccionario(ProductoElegido);
        console.log("|"+ProductoElegido+"|")
        if(ExtensionPrecio>0){
            revisar="Precio";
        }else if(ExtensionImagen>0){
            revisar="Imagen"
        }
        if(ProductoElegido!==""){
            await conexion.BP(ProductoElegido).then((respuesta)=>{
                ProductosElegidos=respuesta; //¿Que la consulta o mostrar los productos?
            }); 
        }else{
            await conexion.BuscarSE().then((respuesta)=>{
                ProductosElegidos=[]
                ProductosElegidos=respuesta;
            }); 
        }
        
        if(ExtensionEntidad>0){

           
            console.log("asdf"+ProductoElegido)

          
            console.log("revisar: "+revisar)
            if(revisar==="Precio"){ 
                session.beginDialog("/verPrecio");
            }else if(revisar==="Imagen"){
                session.beginDialog("/verImagen");
            }
            session.beginDialog("/verPrecio");
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
dialog.matches('Pagar',[
    (session)=>{
        funciones.GuiaPago(session);
    }
]);
dialog.matches('Carrito',[
    (session)=>{
        funciones.GuiaCarrito(session);
    }
]);

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
            // opn('http://itecormovil.com/cosette/magento/index.php/catalogsearch/advanced/'); 
            funciones.traerProductos(session,ProductosElegidos);
            session.send("Si te gusta alguno da click en el boton de comprar.")
            ProductosElegidos=[];
            ProductoElegido="";
            Producto="";
        }else{
            session.send("Okey, disfruta tu visita en cossete");
        }
        session.beginDialog('/');
        
    }
    // },
    // (session,results)=>{
    //         var Respuesta=results.response.toLowerCase();
    //         if(Respuesta===("si")){
    //             session.send("Muy bien, ¿Qué te interesa?")
    //             session.beginDialog('/')    
    //         }else if(Respuesta===("no")){
    //             //Crear TODOOOOOOOOO el catalogo pero despuecito
    //         }else{
    //             session.beginDialog('/')    
    
    //         }
            
        
    // }
])

bot.dialog('/verPrecio',[
    (session)=>{
        session.send("Okey deja busco");
        var opciones;
        // for(var k=0;k<ProductosElegidos.length;k++){
        //     opciones=`${ProductosElegidos[k].Producto}  ${ProductosElegidos[k].Precio}|`
        //     if(k===ProductosElegidos.length-1)opciones=`${ProductosElegidos[k].Producto}  ${ProductosElegidos[k].Precio}`
        // }
        funciones.traerProductos(session,ProductosElegidos);
        session.send("Encontre esto, espero y sea lo que buscabas")
        ProductosElegidos=[];
        ProductoElegido="";
        Producto="";
        session.beginDialog('/');
        // builder.Prompts.choice(session,"Tengo estas opciones, ¿Cual te gusta mas?",opciones,{ listStyle: builder.ListStyle.button });
    }
]);
        

